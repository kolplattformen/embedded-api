import { Fetch, RequestInit, Response } from './types'

export interface CallInfo extends RequestInit {
  name: string
  type: string
  url: string
  status: number
  statusText: string
  error?: Error
}

export interface FetcherOptions {
  record?: (info: CallInfo, data: string | Buffer | ArrayBuffer) => Promise<void>
}

export interface Fetcher<T> {
  (name: string, url: string, init?: RequestInit): Promise<T>
}

export interface Recorder {
  (info: CallInfo, data: string | Buffer | ArrayBuffer): Promise<void>
}

const record = async (
  name: string,
  url: string,
  init: RequestInit | undefined,
  type: string,
  options: FetcherOptions,
  response: Response,
  data: string | Buffer | ArrayBuffer,
): Promise<void> => {
  if (!options.record) {
    return
  }
  const info: CallInfo = {
    ...(init || {}),
    name,
    url,
    type,
    status: response.status,
    statusText: response.statusText,
  }
  await options.record(info, data)
}

export default function fetcher(fetch: Fetch, options: FetcherOptions = {}) {
  return {
    fetchJson: async (name: string, url: string, init?: RequestInit): Promise<any> => {
      const response = await fetch(url, init)
      const json = await response.json()
      await record(name, url, init, 'json', options, response, json)
      return json
    },
    fetchText: async (name: string, url: string, init?: RequestInit): Promise<string> => {
      const response = await fetch(url, init)
      const text = await response.text()
      await record(name, url, init, 'txt', options, response, text)
      return text
    },
    fetchRaw: async (name: string, url: string, init?: RequestInit): Promise<Blob> => {
      const response = await fetch(url, init)
      const blob = await response.blob()
      if (options.record) {
        const binary = await blob.arrayBuffer()
        await record(name, url, init, 'binary', options, response, binary)
      }
      return blob
    },
  }
}
