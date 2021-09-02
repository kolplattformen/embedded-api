import { DateTime } from 'luxon'
import { EventEmitter } from 'events'
import wrap, { Fetcher, FetcherOptions } from './fetcher'
import { CalendarItem, Classmate, CookieManager, EtjanstChild, Fetch, MenuItem, NewsItem, Notification, Skola24Child, User } from "./types"
import { LoginStatusChecker } from './loginStatus'
import { decode } from 'he'
import * as html from 'node-html-parser'
import { URLSearchParams } from './URLSearchParams'
import { IApi } from './IApi'

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

  getPersonalNumber(): string | undefined {
    throw new Error('Method not implemented.')
  }
  setSessionCookie(sessionCookie: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  getUser(): Promise<User> {
    throw new Error('Method not implemented.')
  }
  async getChildren(): Promise<EtjanstChild[]> {
    // dummy implementation just fetches the childrens' names
    if (!this.isLoggedIn) {
      throw new Error('Not logged in...')
    }

    const myChildrenUrl = 'https://hjarntorget.goteborg.se/portletMyChildren.do'
    const myChildrenResponse = await this.fetch('myChildren', myChildrenUrl)
    const myChildrenResponseText = await myChildrenResponse.text()
    return mapResponseToChildren(myChildrenResponseText)
  }
  getCalendar(child: EtjanstChild): Promise<CalendarItem[]> {
    throw new Error('Method not implemented.')
  }
  getClassmates(child: EtjanstChild): Promise<Classmate[]> {
    throw new Error('Method not implemented.')
  }
  getNews(child: EtjanstChild): Promise<NewsItem[]> {
    throw new Error('Method not implemented.')
  }
  getNewsDetails(child: EtjanstChild, item: NewsItem): Promise<any> {
    throw new Error('Method not implemented.')
  }
  getMenu(child: EtjanstChild): Promise<MenuItem[]> {
    throw new Error('Method not implemented.')
  }
  getNotifications(child: EtjanstChild): Promise<Notification[]> {
    throw new Error('Method not implemented.')
  }
  getSkola24Children(): Promise<Skola24Child[]> {
    throw new Error('Method not implemented.')
  }
  getTimetable(child: Skola24Child, week: number, year: number, lang: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
  logout(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  public async login(personalNumber?: string): Promise<LoginStatusChecker> {
    const beginLoginUrl = 'https://hjarntorget.goteborg.se'
    const beginLoginRedirectResponse = await this.fetch('begin-login', beginLoginUrl, {
      redirect: 'follow'
    })

    const beginLoginRedirectUrl = (beginLoginRedirectResponse as any).url
    const shibolethLoginParam = new URLSearchParams({
      entityID: 'https://auth.goteborg.se/FIM/sps/HjarntorgetEID/saml20'
    }).toString()
    const shibbolethLoginUrl = decodeURIComponent(beginLoginRedirectUrl.substring(beginLoginRedirectUrl.indexOf('return=') + 'return='.length)) + '&' + shibolethLoginParam

    const shibbolethLoginResponse = await this.fetch('begin-login', shibbolethLoginUrl, {
      redirect: 'follow'
    })

    const shibbolethRedirectUrl = (shibbolethLoginResponse as any).url
    const shibbolethLoginResponseText = await shibbolethLoginResponse.text()

    const { initBankIdUrl, initBankIdParams } = extractInitBankIdParams(shibbolethRedirectUrl)
    const initBankIdResponse = await this.fetch('init-bankId', initBankIdUrl + initBankIdParams, {
      redirect: 'follow'
    })

    const initBankIdResponseText = await initBankIdResponse.text()
    const mvghostRequestBody = extractMvghostRequestBody(initBankIdResponseText)

    const mvghostUrl = 'https://m00-mg-local.idp.funktionstjanster.se/samlv2/idp/req/0/34?mgvhostparam=0'
    const mvghostResponse = await this.fetch('mvghost', mvghostUrl, {
      redirect: 'follow',
      method: 'POST',
      body: mvghostRequestBody,
    })
    const mvghostResponseText = await mvghostResponse.text()

    // We may get redirected to some other subdomain i.e. not 'm00-mg-local':
    // https://mNN-mg-local.idp.funktionstjanster.se/mg-local/auth/ccp11/grp/other
    const beingBankIdUrlBase = (mvghostResponse as any).url
    const beingBankIdUrl = beingBankIdUrlBase + '/ssn'
    var ssnBody = new URLSearchParams({ ssn: personalNumber }).toString();
    var beginBankIdResponse = await this.fetch('being-bankid', beingBankIdUrl, {
      redirect: 'follow',
      method: 'POST',
      body: ssnBody
    });
    const beginBankIdResponseText = await beginBankIdResponse.text()

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
      // https://mNN-mg-local.idp.funktionstjanster.se/mg-local/auth/ccp11/grp/pollstatus
      const pollStatusUrl = this.basePollingUrl + "pollstatus"
      const pollStatusResponse = await this.fetcher('poll-status', pollStatusUrl)
      const pollStatusResponseJson = await pollStatusResponse.json()

      const keepPolling = pollStatusResponseJson.infotext !== ''
      const isError = pollStatusResponseJson.location.indexOf('error') >= 0;
      if (!keepPolling && !isError) {
        // follow response location to get back to auth.goteborg.se
        // r.location is something like 'https://mNN-mg-local.idp.funktionstjanster.se/mg-local/auth/ccp11/grp/signature'
        const signatureResponse = await this.fetcher('signature', pollStatusResponseJson.location, { redirect: "follow" });
        const signatureResponseText = await signatureResponse.text();

        const authGbgLoginBody = extractAuthGbgLoginRequestBody(signatureResponseText)
        const authGbgLoginUrl = 'https://auth.goteborg.se/FIM/sps/BankID/saml20/login'
        const authGbgLoginResponse = await this.fetcher('samlLogin', authGbgLoginUrl, {
          redirect: 'follow',
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: authGbgLoginBody
        })
        const authGbgLoginResponseText = await authGbgLoginResponse.text()

        const hjarntorgetSAMLLoginRequestBody = extractHjarntorgetSAMLLoginRequestBody(authGbgLoginResponseText)
        const hjarntorgetSAMLLoginUrl = 'https://hjarntorget.goteborg.se/Shibboleth.sso/SAML2/POST'
        const hjarntorgetSAMLLoginResponse = await this.fetcher('samlLogin', hjarntorgetSAMLLoginUrl, {
          method: 'POST',
          redirect: 'follow',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: hjarntorgetSAMLLoginRequestBody,
        })

        // TODO: add some checks to see if we everything is actually 'OK'...
        this.emit('OK')
      } else if (isError) {
        this.emit('ERROR')
      } else if (!this.cancelled && keepPolling) {
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
