import { Api } from './api'
import { FetcherOptions } from './fetcher'
import { Fetch } from './types'
import {
  RNCookieManager,
  ToughCookieJar,
  wrapReactNativeCookieManager,
  wrapToughCookie,
} from './cookies'
import { ApiGbg as ApiHjarntorget } from './apiGbg'
import { IApi } from './IApi'

export { Api, FetcherOptions }
export * from './types'
export { LoginStatusChecker } from './loginStatus'

export type ApiTarget = 'Stockholm' | 'Gothenburg'

export const initApi = (target: ApiTarget) => {
  switch (target) {
    case 'Stockholm':
      return initStockholm
    case 'Gothenburg':
      return initGothenburg
  }
}

const initStockholm = (
  fetch: Fetch,
  cookieManagerImpl: RNCookieManager | ToughCookieJar,
  options?: FetcherOptions
): IApi => {
  // prettier-ignore
  const cookieManager = ((cookieManagerImpl as RNCookieManager).get)
    ? wrapReactNativeCookieManager(cookieManagerImpl as RNCookieManager)
    : wrapToughCookie(cookieManagerImpl as ToughCookieJar)
  return new Api(fetch, cookieManager, options)
}

const initGothenburg = (
  fetch: Fetch,
  cookieManagerImpl: RNCookieManager | ToughCookieJar,
  options?: FetcherOptions
): IApi => {
  // prettier-ignore
  const cookieManager = ((cookieManagerImpl as RNCookieManager).get)
    ? wrapReactNativeCookieManager(cookieManagerImpl as RNCookieManager)
    : wrapToughCookie(cookieManagerImpl as ToughCookieJar)
  return new ApiHjarntorget(fetch, cookieManager, options)
}

export default initStockholm
