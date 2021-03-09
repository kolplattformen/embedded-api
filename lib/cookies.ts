import { camelCase, pascalCase } from 'change-case'

export interface Cookie {
  name: string
  value: string
  path?: string
  domain?: string
  version?: string
  expires?: string
  secure?: boolean
  httpOnly?: boolean
  [key: string]: string|boolean|undefined
}

export interface CookieManager {
  setCookie: (cookie: Cookie, url: string) => Promise<void>
  getCookies: (url: string) => Promise<Cookie[]>
  setCookieString: (cookieString: string, url: string) => Promise<void>
  getCookieString: (url: string) => Promise<string>
  clearAll: () => Promise<void>
}

interface Serializer {
  (cookie: Cookie): string
}
interface Deserializer {
  (cookieString: string): Cookie
}
export const serialize: Serializer = (cookie) => {
  const tokens = [`${cookie.name}=${cookie.value}`]

  const keyVals = ['expires', 'domain', 'path']
  keyVals.filter((key) => cookie[key]).forEach((key) => {
    tokens.push(`${pascalCase(key)}=${cookie[key]}`)
  })

  const bools = ['secure', 'httpOnly']
  bools.filter((key) => cookie[key]).forEach((key) => {
    tokens.push(pascalCase(key))
  })

  return tokens.join('; ')
}
export const deserialize: Deserializer = (cookieString) => {
  const [nameVal, ...others] = cookieString.split(';').map((token) => token.trim())
  const [name, value] = nameVal.split('=')

  const cookie: Cookie = {
    name,
    value,
  }

  others.map((keyVal) => keyVal.split('=')).forEach(([key, val]) => {
    const prop = camelCase(key)
    // eslint-disable-next-line default-case
    switch (prop) {
      case 'expires':
      case 'domain':
      case 'path':
        cookie[prop] = val
        break
      case 'secure':
      case 'httpOnly':
        cookie[prop] = true
        break
    }
  })

  return cookie
}

interface ToughCookie {
  toString: () => string
}
interface ToughCookieJar {
  getCookieString: (url: string) => Promise<string>
  getCookies: (url: string) => Promise<ToughCookie[]>
  setCookie: (cookie: string, url: string) => Promise<any>
  removeAllCookies: () => Promise<void>
}
const wrapToughCookie = (jar: ToughCookieJar): CookieManager => ({
  getCookieString: (url) => jar.getCookieString(url),
  getCookies: async (url) => {
    const cookies = await jar.getCookies(url)
    return cookies.map((cookie) => deserialize(cookie.toString()))
  },
  setCookie: async (cookie, url) => {
    await jar.setCookie(serialize(cookie), url)
  },
  setCookieString: async (cookieString, url) => {
    await jar.setCookie(cookieString, url)
  },
  clearAll: () => jar.removeAllCookies()
})

export const wrap = (implementation: ToughCookieJar): CookieManager => wrapToughCookie(implementation)
