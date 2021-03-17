import { Response } from './types'

export class HTTPResponseError extends Error {
  constructor(response : Response, url? : string) {
    super(`HTTP Error Response: [${response.status}] [${response.statusText}] [${url}]`)
  }
}
