import { DateTime, FixedOffsetZone } from 'luxon'
import { EventEmitter } from 'events'
import wrap, { Fetcher, FetcherOptions } from './fetcher'
import { CalendarItem, Classmate, CookieManager, EtjanstChild, Fetch, MenuItem, NewsItem, Notification, ScheduleItem, Skola24Child, TimetableEntry, User } from "./types"
import { LoginStatusChecker } from './loginStatus'
import { decode } from 'he'
import * as html from 'node-html-parser'
import { URLSearchParams } from './URLSearchParams'
import { IApi } from './IApi'
import { toMarkdown } from './parseHtml'

export class ApiGbg extends EventEmitter implements IApi {
  private fetch: Fetcher

  private personalNumber?: string

  private headers: any

  private cookieManager: CookieManager

  public isLoggedIn: boolean = false

  public isFake: boolean = false


  constructor(
    fetch: Fetch,
    cookieManager: CookieManager,
    options?: FetcherOptions
  ) {
    super()
    this.fetch = wrap(fetch, options)
    this.cookieManager = cookieManager
    this.headers = {}
  }
  async getSchedule(child: EtjanstChild, from: DateTime, to: DateTime): Promise<(CalendarItem & ScheduleItem)[]> {
    const lessonsUrl = 'https://hjarntorget.goteborg.se/api/schema/lessons?'
    var lessonParams = new URLSearchParams({ 
      forUser: child.id, 
      startDateIso: from.toISODate(),
      endDateIso: to.toISODate(),
    }).toString()
    
    const lessonsResponse = await this.fetch('info', lessonsUrl + lessonParams)
    const lessonsResponseJson: any[] = await lessonsResponse.json()

    return lessonsResponseJson.map(l => {
      const start = DateTime.fromMillis(l.startDate.ts, {zone: FixedOffsetZone.instance(l.startDate.timezoneOffsetMinutes)})
      const end = DateTime.fromMillis(l.endDate.ts, {zone: FixedOffsetZone.instance(l.endDate.timezoneOffsetMinutes)})
      return {
        id: l.id,
        title: l.title,
        description: l.note,
        location: l.location,
        startDate: start.toISO(),
        endDate: end.toISO(),
        oneDayEvent: false,
        allDayEvent: false,
      }
    })
  }

  getPersonalNumber(): string | undefined {
    return this.personalNumber
  }

  async setSessionCookie(sessionCookie: string): Promise<void> {
    const hjarntorgetUrl = 'https://hjarntorget.goteborg.se'
    const hjarntorgetResponse = await this.fetch('login-cookie', hjarntorgetUrl, {
      headers: {
        cookie: sessionCookie,
      },
      redirect: 'manual',
    })

    const user = await this.getUser()
    if (!user.isAuthenticated) {
      throw new Error('Session cookie is expired')
    }

    this.isLoggedIn = true
    this.emit('login')
  }

  async getUser(): Promise<User> {
    const currentUserUrl = 'https://hjarntorget.goteborg.se/api/core/current-user'
    const currentUserResponse = await this.fetch('myChildren', currentUserUrl)
    if (currentUserResponse.status !== 200) {
      return { isAuthenticated: false }
    }

    const retrivedUser = await currentUserResponse.json()
    return {...retrivedUser, isAuthenticated: true}
  }

  async getChildren(): Promise<(Skola24Child & EtjanstChild)[]> {
    if (!this.isLoggedIn) {
      throw new Error('Not logged in...')
    }

    const myChildrenUrl = 'https://hjarntorget.goteborg.se/api/person/children'
    const myChildrenResponse = await this.fetch('myChildren', myChildrenUrl)
    const myChildrenResponseJson: any[] = await myChildrenResponse.json()

    return myChildrenResponseJson.map(c => ({
      id: c.id,
      sdsId: c.id,
      personGuid: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      name: `${c.firstName} ${c.lastName}`,
    } as (Skola24Child & EtjanstChild)));
  }

  async getCalendar(child: EtjanstChild): Promise<CalendarItem[]> {
    const lessonsUrl = 'https://hjarntorget.goteborg.se/api/schema/lessons';

    const schedule = await this.getSchedule(child, DateTime.now(), DateTime.now().plus({months:1}))
    return schedule.map(s => ({ ...s, title: s.title + " (from calendar)"}));
  }
  async getClassmates(child: EtjanstChild): Promise<Classmate[]> {
    return [];
  }
  async getNews(child: EtjanstChild): Promise<NewsItem[]> {
    if (!this.isLoggedIn) {
      throw new Error('Not logged in...')
    }

    const infoUrl = 'https://hjarntorget.goteborg.se/api/information/messages-by-date-desc?messageStatus=CURRENT&offset=0&limit=10&language=en'
    const infoResponse = await this.fetch('info', infoUrl)
    const infoResponseJson: any[] = await infoResponse.json()
    // TODO: Filter out read messages?
    return infoResponseJson.map(i => {
      const body = html.parse(decode(i.body || ""))
      const bodyText = toMarkdown(i.body)
      
      const introText = body.innerText || ""
      const publishedDate = new Date(i.created.ts)

      return {
        id: i.id,
        author: i.creator && `${i.creator.firstName} ${i.creator.lastName}`, 
        header: i.title,
        intro: introText,
        body: bodyText,
        published: publishedDate.toISOString(),
        modified: publishedDate.toISOString(),
        fullImageUrl: i.creator && `https://hjarntorget.goteborg.se${i.creator.imagePath}`
      }
    })
  }
  async getNewsDetails(child: EtjanstChild, item: NewsItem): Promise<any> {
    const infoSetReadUrl = `https://hjarntorget.goteborg.se/api/information/set-message-read?messageId=${item.id}`
    this.fetch('info', infoSetReadUrl, {
      method: 'POST',
    })
    
    return {...item };
  }

  async getMenu(child: EtjanstChild): Promise<MenuItem[]> {
    // Have not found this available on hjärntorget. Perhaps do a mapping to https://www.skolmaten.se/ ?
    return []
  }
  
  async getNotifications(child: EtjanstChild): Promise<Notification[]> {
    const hjarntorgetEventsUrl = 'https://hjarntorget.goteborg.se/api/events/events-sorted-by-name?offset=0&limit=100'
    const hjarntorgetEventsResponse = await this.fetch('events', hjarntorgetEventsUrl)
    const hjarntorgetEventsResponseJson: any[] = await hjarntorgetEventsResponse.json()
    const membersInEvents = await Promise.all(hjarntorgetEventsResponseJson.filter(e => e.state === 'ONGOING')
      .map(async e => {
        const eventId = e.id as number
        const rolesInEventUrl = `https://hjarntorget.goteborg.se/api/event-members/roles?eventId=${eventId}&language=en`
        const rolesInEvenResponse = await this.fetch('roles-in-event', rolesInEventUrl)
        const rolesInEvenResponseJson: any[] = await rolesInEvenResponse.json()

        const eventMembers = await Promise.all(rolesInEvenResponseJson.map(async r => {
            const roleId = r.id
            const membersWithRoleUrl = `https://hjarntorget.goteborg.se/api/event-members/members-having-role?eventId=${eventId}&roleId=${roleId}`
            const membersWithRoleResponse = await this.fetch('event-role-members', membersWithRoleUrl)
            const membersWithRoleResponseJson: any[] = await membersWithRoleResponse.json()
            return membersWithRoleResponseJson
        }))
        return {eventId, eventMembers: ([] as any[]).concat(...eventMembers)}
      }))
    const membersInChildsEvents = membersInEvents.filter(e => e.eventMembers.find(p => p.id === child.id)).reduce((acc, e) => acc.concat(e.eventMembers), ([] as any[]))
    

    const wallMessagesUrl = 'https://hjarntorget.goteborg.se/api/wall/events?language=en&limit=500'
    const wallMessagesResponse = await this.fetch('wall-events', wallMessagesUrl)
    const wallMessagesResponseJson: any[] = await wallMessagesResponse.json()
    return wallMessagesResponseJson.filter(message => {
      return membersInChildsEvents.find(member => member.id === message.creator.id)
    }).map(message => {
      const createdDate = new Date(message.created.ts)
      return { 
        id: message.id,
        sender: message.creator && `${message.creator.firstName} ${message.creator.lastName}`, 
        dateCreated: createdDate.toISOString(),
        message: message.body,
        url: message.url,
        category: message.title,
        type: message.type,
      }
    });
    
  }
  async getSkola24Children(): Promise<(Skola24Child)[]> {
    return [];
  }
  async getTimetable(child: Skola24Child, week: number, year: number, lang: string): Promise<TimetableEntry[]> {

    const startDate = DateTime.fromJSDate(getDateOfISOWeek(week, year))
    const endDate = startDate.plus({days: 7})
    const lessonsUrl = 'https://hjarntorget.goteborg.se/api/schema/lessons?';
    var lessonParams = new URLSearchParams({ 
      forUser: child.personGuid, // This is a bit of a hack due to how we map things...
      startDateIso: startDate.toISODate(),
      endDateIso: endDate.toISODate(),
    }).toString();
    
    const lessonsResponse = await this.fetch('info', lessonsUrl + lessonParams)
    const lessonsResponseJson: any[] = await lessonsResponse.json()

    return lessonsResponseJson.map(l => {
      const start = DateTime.fromMillis(l.startDate.ts, {zone: FixedOffsetZone.instance(l.startDate.timezoneOffsetMinutes)})
      const end = DateTime.fromMillis(l.endDate.ts, {zone: FixedOffsetZone.instance(l.endDate.timezoneOffsetMinutes)})
      return {
        id: l.id,
        teacher: l.bookedTeacherNames && l.bookedTeacherNames[0],
        location: l.location,
        timeStart: start.toISOTime().substring(0,5),
        timeEnd: end.toISOTime().substring(0,5),
        dayOfWeek: start.toJSDate().getDay(),
        blockName: l.title,
        dateStart: start.toISODate(),
        dateEnd: start.toISODate(),
      } as TimetableEntry
    })
    
  }
  async logout(): Promise<void> {
    this.isLoggedIn = false
    this.cookieManager.clearAll()
  }

  public async login(personalNumber?: string): Promise<LoginStatusChecker> {
    console.log("initiating login to hjarntorget")
    const beginLoginUrl = 'https://hjarntorget.goteborg.se'
    const beginLoginRedirectResponse = await this.fetch('begin-login', beginLoginUrl, {
      redirect: 'follow'
    })

    const beginLoginRedirectUrl = (beginLoginRedirectResponse as any).url
    const shibolethLoginParam = new URLSearchParams({
      entityID: 'https://auth.goteborg.se/FIM/sps/HjarntorgetEID/saml20'
    }).toString()
    const shibbolethLoginUrl = decodeURIComponent(beginLoginRedirectUrl.substring(beginLoginRedirectUrl.indexOf('return=') + 'return='.length)) + '&' + shibolethLoginParam
    
    console.log("prepping??? shibboleth")
    const shibbolethLoginResponse = await this.fetch('begin-login', shibbolethLoginUrl, {
      redirect: 'follow'
    })

    const shibbolethRedirectUrl = (shibbolethLoginResponse as any).url
    const shibbolethLoginResponseText = await shibbolethLoginResponse.text()

    const { initBankIdUrl, initBankIdParams } = extractInitBankIdParams(shibbolethRedirectUrl)
    console.log("initiating bankid...")
    const initBankIdResponse = await this.fetch('init-bankId', initBankIdUrl + initBankIdParams, {
      redirect: 'follow'
    })

    const initBankIdResponseText = await initBankIdResponse.text()
    const mvghostRequestBody = extractMvghostRequestBody(initBankIdResponseText)

    console.log("picking auth server???")
    const mvghostUrl = 'https://m00-mg-local.idp.funktionstjanster.se/samlv2/idp/req/0/34?mgvhostparam=0'
    const mvghostResponse = await this.fetch('mvghost', mvghostUrl, {
      redirect: 'follow',
      method: 'POST',
      body: mvghostRequestBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    //const mvghostResponseText = await mvghostResponse.text()

    console.log("start bankid sign in")
    // We may get redirected to some other subdomain i.e. not 'm00-mg-local':
    // https://mNN-mg-local.idp.funktionstjanster.se/mg-local/auth/ccp11/grp/other
    const beingBankIdUrlBase = (mvghostResponse as any).url
    const beingBankIdUrl = beingBankIdUrlBase + '/ssn'
    var ssnBody = new URLSearchParams({ ssn: personalNumber }).toString();
    var beginBankIdResponse = await this.fetch('being-bankid', beingBankIdUrl, {
      redirect: 'follow',
      method: 'POST',
      body: ssnBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log("start polling")
    // https://mNN-mg-local.idp.funktionstjanster.se/mg-local/auth/ccp11/grp/verify
    const verifyUrl = (beginBankIdResponse as any).url;
    const verifyUrlBase = verifyUrl.substring(0, verifyUrl.length - 'verify'.length)
    const statusChecker = checkStatus(this.fetch, verifyUrlBase)
    
    statusChecker.on('OK', async () => {
      // setting these similar to how the sthlm api does it
      // not sure if it is needed or if the cookies are enough for fetching all info...
      this.isLoggedIn = true
      this.personalNumber = personalNumber;
      this.emit('login')
    })
    statusChecker.on('ERROR', () => {
      this.personalNumber = undefined
    })

    return statusChecker;
  }
}

class HjarntorgetChecker extends EventEmitter {

  private fetcher: Fetcher
  private basePollingUrl: string
  public token: string

  private cancelled: boolean = false

  constructor(fetcher: Fetcher, basePollingUrl: string) {
    super()
    this.token = '' // not used, but needed for compatability with the LoginStatusChecker 
    this.fetcher = fetcher
    this.basePollingUrl = basePollingUrl

    this.check()
  }

  async check(): Promise<void> {
    try {
      console.log("polling bankid signature")
      // https://mNN-mg-local.idp.funktionstjanster.se/mg-local/auth/ccp11/grp/pollstatus
      const pollStatusUrl = this.basePollingUrl + "pollstatus"
      const pollStatusResponse = await this.fetcher('poll-status', pollStatusUrl)
      const pollStatusResponseJson = await pollStatusResponse.json()

      const keepPolling = pollStatusResponseJson.infotext !== ''
      const isError = pollStatusResponseJson.location.indexOf('error') >= 0;
      if (!keepPolling && !isError) {
        console.log("bankid successfull! follow to location...")
        // follow response location to get back to auth.goteborg.se
        // r.location is something like 'https://mNN-mg-local.idp.funktionstjanster.se/mg-local/auth/ccp11/grp/signature'
        const signatureResponse = await this.fetcher('signature', pollStatusResponseJson.location, { redirect: "follow" });
        const signatureResponseText = await signatureResponse.text();

        const authGbgLoginBody = extractAuthGbgLoginRequestBody(signatureResponseText)
        const authGbgLoginUrl = 'https://auth.goteborg.se/FIM/sps/BankID/saml20/login'
        console.log("authGbg saml login")
        const authGbgLoginResponse = await this.fetcher('samlLogin', authGbgLoginUrl, {
          redirect: 'follow',
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: authGbgLoginBody
        })
        const authGbgLoginResponseText = await authGbgLoginResponse.text()

        const hjarntorgetSAMLLoginRequestBody = extractHjarntorgetSAMLLoginRequestBody(authGbgLoginResponseText)
        const hjarntorgetSAMLLoginUrl = 'https://hjarntorget.goteborg.se/Shibboleth.sso/SAML2/POST'
        console.log("hjarntorget saml login")
        
        await this.fetcher('samlLogin', hjarntorgetSAMLLoginUrl, {
          method: 'POST',
          redirect: 'follow',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: hjarntorgetSAMLLoginRequestBody,
        })

        // TODO: add some checks to see if everything is actually 'OK'...
        this.emit('OK')
      } else if (isError) {
        console.log("polling error")
        this.emit('ERROR')
      } else if (!this.cancelled && keepPolling) {
        console.log("keep on polling...")
        setTimeout(() => this.check(), 3000)
      }
    } catch(er) {
      console.log('Error validating login to Hjärntorget', er)
      this.emit('ERROR')
    }
  }

  async cancel(): Promise<void> {
    this.cancelled = true
  }
}

const checkStatus = (fetch: Fetcher, basePollingUrl: string): LoginStatusChecker => new HjarntorgetChecker(fetch, basePollingUrl)

function extractInitBankIdParams(shibbolethRedirectUrl: any) {
  const targetParam = decodeURIComponent(shibbolethRedirectUrl.substring(shibbolethRedirectUrl.indexOf('Target=') + 'Target='.length))
  const initBankIdUrl = 'https://auth.goteborg.se/FIM/sps/BankID/saml20/logininitial?'
  const initBankIdParams = new URLSearchParams({
    ITFIM_WAYF_IDP: 'https://m00-mg-local.idp.funktionstjanster.se/samlv2/idp/metadata/0/34',
    submit: 'Mobilt BankID',
    ResponseBinding: 'HTTPPost',
    RequestBinding: 'HTTPPost',
    Target: targetParam,
  }).toString()
  return { initBankIdUrl, initBankIdParams }
}

function extractMvghostRequestBody(initBankIdResponseText: string) {
  const doc = html.parse(decode(initBankIdResponseText))
  const inputAttrs = doc.querySelectorAll('input').map(i => (i as any).rawAttrs)
  const relayState = extractInputField('RelayState', inputAttrs)
  const samlRequest = extractInputField("SAMLRequest", inputAttrs)
  const mvghostRequestBody = new URLSearchParams({ RelayState: relayState, SAMLRequest: samlRequest }).toString()
  return mvghostRequestBody
}

function extractHjarntorgetSAMLLoginRequestBody(authGbgLoginResponseText: string) {
  const authGbgLoginDoc = html.parse(decode(authGbgLoginResponseText))
  const inputAttrs = authGbgLoginDoc.querySelectorAll('input').map(i => (i as any).rawAttrs)
  const relayState = extractInputField('RelayState', inputAttrs)
  const samlResponse = extractInputField("SAMLResponse", inputAttrs)
  const hjarntorgetSAMLLoginRequestBody = new URLSearchParams({ RelayState: relayState, SAMLResponse: samlResponse }).toString()
  return hjarntorgetSAMLLoginRequestBody
}

function extractAuthGbgLoginRequestBody(signatureResponseText: string) {
  const signatureResponseDoc = html.parse(decode(signatureResponseText))
  const signatureResponseTextAreas = signatureResponseDoc.querySelectorAll('textarea')
  const SAMLResponseElem = signatureResponseTextAreas.find(ta => {
    const nameAttr = ta.getAttribute("name")
    return nameAttr === 'SAMLResponse'
  })
  const SAMLResponseText = SAMLResponseElem?.rawText

  const RelayStateElem = signatureResponseTextAreas.find(ta => {
    const nameAttr = ta.getAttribute("name")
    return nameAttr === 'RelayState'
  })
  const RelayStateText = RelayStateElem?.rawText
  const authGbgLoginBody = new URLSearchParams({
    'SAMLResponse': SAMLResponseText,
    'RelayState': RelayStateText,
  }).toString()
  return authGbgLoginBody
}

const extractInputField = (sought: string, attrs: string[]) => {
  // there must be a better way to do this...
  const s = attrs.find(e => e.indexOf(sought) >= 0) || ""
  const v = s.substring(s.indexOf('value="') + 'value="'.length)
  return v.substring(0, v.length - 2)
}

function mapResponseToChildren(myChildrenResponseText: string): EtjanstChild[] {
  const myChildrenDoc = html.parse(decode(myChildrenResponseText))
  const childrenH4 = myChildrenDoc.querySelectorAll('h4')
  return childrenH4.map(e => ({ id: '', sdsId: '', name: e.textContent.trim() }))
}

function getDateOfISOWeek(week: number, year: number,) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
      ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}
