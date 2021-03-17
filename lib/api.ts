import { DateTime } from 'luxon'
import { EventEmitter } from 'events'
import { decode } from 'he'
import * as html from 'node-html-parser'
import { HTTPResponseError } from './HttpResponseError'
import {
  checkStatus,
  LoginStatusChecker,
} from './loginStatus'
import {
  AuthTicket,
  CalendarItem,
  Child,
  Classmate,
  CookieManager,
  Fetch,
  MenuItem,
  NewsItem,
  Notification,
  RequestInit,
  ScheduleItem,
  User,
  Response,
} from './types'
import * as routes from './routes'
import * as parse from './parse'
import wrap, { Fetcher, FetcherOptions } from './fetcher'
import * as fake from './fakeData'

const fakeResponse = <T>(data: T): Promise<T> => new Promise((res) => (
  setTimeout(() => res(data), 200 + Math.random() * 800)
))

export class Api extends EventEmitter {
  private fetch: Fetcher

  private personalNumber?: string

  private headers: any

  private cookieManager: CookieManager

  public isLoggedIn: boolean = false

  public isFake: boolean = false

  constructor(fetch: Fetch, cookieManager: CookieManager, options?: FetcherOptions) {
    super()
    this.fetch = wrap(fetch, options, (childId) => this.selectChildById(childId))
    this.cookieManager = cookieManager
    this.headers = {}
  }

  public getPersonalNumber(): string | undefined {
    return this.personalNumber
  }

  private getRequestInit(options: RequestInit = {}): RequestInit {
    return {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    }
  }

  public async getSession(url: string, options?: RequestInit): Promise<RequestInit> {
    const init = this.getRequestInit(options)
    const cookie = await this.cookieManager.getCookieString(url)
    return {
      ...init,
      headers: {
        ...init.headers,
        cookie,
      },
    }
  }

  private async clearSession(): Promise<void> {
    this.headers = {}
    await this.cookieManager.clearAll()
  }

  private addHeader(name: string, value: string): void {
    this.headers[name] = value
  }

  public async login(personalNumber: string): Promise<LoginStatusChecker> {
    if (personalNumber.endsWith('1212121212')) return this.fakeMode()

    this.isFake = false

    const ticketUrl = routes.login(personalNumber)
    const ticketResponse = await this.fetch('auth-ticket', ticketUrl)

    if (!ticketResponse.ok) {
      throw new Error(`Server Error [${ticketResponse.status}] [${ticketResponse.statusText}] [${ticketUrl}]`)
    }

    const ticket: AuthTicket = await ticketResponse.json()

    // login was initiated - store personal number
    this.personalNumber = personalNumber

    const status = checkStatus(this.fetch, ticket)
    status.on('OK', async () => {
      await this.retrieveSessionCookie()
      await this.retrieveXsrfToken()
      await this.retrieveApiKey()

      this.isLoggedIn = true
      this.emit('login')
    })
    status.on('ERROR', () => { this.personalNumber = undefined })

    return status
  }

  private async retrieveSessionCookie(): Promise<void> {
    const url = routes.loginCookie
    await this.fetch('login-cookie', url)
  }

  private async retrieveXsrfToken(): Promise<void> {
    const url = routes.hemPage
    const session = this.getRequestInit()
    const response = await this.fetch('hemPage', url, session)
    const text = await response.text()

    const doc = html.parse(decode(text || ''))
    const htmlInput = doc.querySelector('input[name="__RequestVerificationToken"]')
    if (htmlInput === null) {
      // throw new Error('Could not find XSRF-token input field on page')
      return
    }
    const xsrfToken = htmlInput.getAttribute('value') || ''
    this.addHeader('X-XSRF-Token', xsrfToken)
  }

  private async retrieveApiKey(): Promise<void> {
    const url = routes.startBundle
    const session = this.getRequestInit()
    const response = await this.fetch('startBundle', url, session)
    const text = await response.text()

    const apiKeyRegex = /"API-Key": "([\w\d]+)"/gm
    const apiKeyMatches = apiKeyRegex.exec(text)
    const apiKey = apiKeyMatches && apiKeyMatches.length > 1 ? apiKeyMatches[1] : ''

    this.addHeader('API-Key', apiKey)
  }

  private async retrieveCdnUrl(): Promise<string> {
    const url = routes.cdn
    const session = this.getRequestInit()
    const response = await this.fetch('cdn', url, session)
    const cdnUrl = await response.text()
    return cdnUrl
  }

  private async retrieveAuthBody(): Promise<string> {
    const url = routes.auth
    const session = this.getRequestInit()
    const response = await this.fetch('auth', url, session)
    const authBody = await response.text()
    return authBody
  }

  private async retrieveAuthToken(url: string, authBody: string): Promise<string> {
    const session = this.getRequestInit({
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        Origin: 'https://etjanst.stockholm.se',
        Referer: 'https://etjanst.stockholm.se/',
        Connection: 'keep-alive',
      },
      body: authBody,
      credentials: 'omit',
    })
    delete session.headers['API-Key']

    // Perform request
    const response = await this.fetch('createItem', url, session)

    if (!response.ok) {
      throw new Error(`Server Error [${response.status}] [${response.statusText}] [${url}]`)
    }

    const authData = await response.json()
    return authData.token
  }

  async fakeMode(): Promise<LoginStatusChecker> {
    this.isFake = true

    setTimeout(() => {
      this.isLoggedIn = true
      this.emit('login')
    }, 50)

    const emitter: any = new EventEmitter()
    emitter.token = 'fake'
    return emitter
  }

  public async getUser(): Promise<User> {
    if (this.isFake) return fakeResponse(fake.user())

    const url = routes.user
    const session = this.getRequestInit()
    const response = await this.fetch('user', url, session)
    const data = await response.json()
    return parse.user(data)
  }

  public async getChildren(): Promise<Child[]> {
    if (this.isFake) return fakeResponse(fake.children())

    const cdnUrl = await this.retrieveCdnUrl()
    const authBody = await this.retrieveAuthBody()
    const token = await this.retrieveAuthToken(cdnUrl, authBody)

    const url = routes.children
    const session = this.getRequestInit({
      headers: {
        Accept: 'application/json;odata=verbose',
        Auth: token,
        Host: 'etjanst.stockholm.se',
        Referer: 'https://etjanst.stockholm.se/Vardnadshavare/inloggad2/hem',
      },
    })
    const response = await this.fetch('children', url, session)

    if (!response.ok) {
      throw new Error(`Server Error [${response.status}] [${response.statusText}] [${url}]`)
    }

    const data = await response.json()
    return parse.children(data)
  }

  public async selectChild(child : Child): Promise<Child> {
    const response = await this.selectChildById(child.id)

    this.checkAndThrowIfNotSuccess(response)
    const data = await response.json()
    return parse.child(parse.etjanst(data))
  }

  private async selectChildById(childId: string) {
    const requestInit = this.getRequestInit({
      method: 'POST',
      headers: {
        host: 'etjanst.stockholm.se',
        accept: 'application/json, text/plain, */*',
        'accept-Encoding': 'gzip, deflate',
        'content-Type': 'application/json;charset=UTF-8',
        origin: 'https://etjanst.stockholm.se',
        referer: 'https://etjanst.stockholm.se/vardnadshavare/inloggad2/hem',
      },
      body: JSON.stringify({
        id: childId,
      }),
    })

    const response = await this.fetch('selectChild', routes.selectChild, requestInit)
    return response
  }

  public async getCalendar(child: Child): Promise<CalendarItem[]> {
    if (this.isFake) return fakeResponse(fake.calendar(child))

    const url = routes.calendar(child.id)
    const session = this.getRequestInit()
    const response = await this.fetch('calendar', url, session, child.id)
    const data = await response.json()
    return parse.calendar(data)
  }

  public async getClassmates(child: Child): Promise<Classmate[]> {
    if (this.isFake) return fakeResponse(fake.classmates(child))

    const url = routes.classmates(child.sdsId)
    const session = this.getRequestInit()
    const response = await this.fetch('classmates', url, session, child.id)
    const data = await response.json()
    return parse.classmates(data)
  }

  public async getSchedule(child: Child, from: DateTime, to: DateTime): Promise<ScheduleItem[]> {
    if (this.isFake) return fakeResponse(fake.schedule(child))

    const url = routes.schedule(child.sdsId, from.toISODate(), to.toISODate())
    const session = this.getRequestInit()
    const response = await this.fetch('schedule', url, session, child.id)
    const data = await response.json()
    return parse.schedule(data)
  }

  public async getNews(child: Child): Promise<NewsItem[]> {
    if (this.isFake) return fakeResponse(fake.news(child))

    const url = routes.news(child.id)
    const session = this.getRequestInit()
    const response = await this.fetch('news', url, session, child.id)
    const data = await response.json()
    return parse.news(data)
  }

  public async getNewsDetails(child: Child, item: NewsItem): Promise<any> {
    if (this.isFake) {
      return fakeResponse(fake.news(child).find((ni) => ni.id === item.id))
    }
    const url = routes.newsDetails(child.id, item.id)
    const session = this.getRequestInit()
    const response = await this.fetch(`news_${item.id}`, url, session, child.id)
    const data = await response.json()
    return parse.newsItemDetails(data)
  }

  public async getMenu(child: Child): Promise<MenuItem[]> {
    if (this.isFake) return fakeResponse(fake.menu(child))

    const url = routes.menu(child.id)
    const session = this.getRequestInit()
    const response = await this.fetch('menu', url, session, child.id)
    const data = await response.json()
    return parse.menu(data)
  }

  public async getNotifications(child: Child): Promise<Notification[]> {
    if (this.isFake) return fakeResponse(fake.notifications(child))

    const url = routes.notifications(child.sdsId)
    const session = this.getRequestInit()
    const response = await this.fetch('notifications', url, session, child.id)
    const data = await response.json()
    return parse.notifications(data)
  }

  public async logout() {
    this.isFake = false
    this.personalNumber = undefined
    this.isLoggedIn = false
    this.emit('logout')
    await this.clearSession()
  }

  // eslint-disable-next-line class-methods-use-this
  private checkAndThrowIfNotSuccess(response : Response) {
    if (response.ok) {
      // response.status >= 200 && response.status < 300
      return response
    }
    console.log(`HTTP Error Response: [${response.status}] [${response.statusText}] [${response.url}]`)
    throw new HTTPResponseError(response, response.url)
  }
}
