import wrap, { CallInfo, Fetcher, Recorder } from './fetcher'
import { Fetch, Headers, Response } from './types'
const Blob = require('node-blob')
Blob.prototype.arrayBuffer = async function () {
  return this.buffer.buffer
}

describe('fetcher', () => {
  let fetch: jest.Mocked<Fetch>
  let response: jest.Mocked<Response>
  let headers: jest.Mocked<Headers>
  let fetcher: Fetcher
  beforeEach(() => {
    headers = { get: jest.fn() }
    response = {
      ok: true,
      status: 200,
      statusText: 'ok',
      json: jest.fn(),
      text: jest.fn(),
      blob: jest.fn(),
      headers,
    }
    fetch = jest.fn().mockResolvedValue(response)
    fetcher = wrap(fetch)
  })
  it('calls fetch', async () => {
    await fetcher('foo', '/')
    expect(fetch).toHaveBeenCalledWith('/', undefined)
  })
  it('json returns the result', async () => {
    const data = { foo: 'bar' }
    response.json.mockResolvedValue(data)

    const res = await fetcher('foo', '/')
    const result = await res.json()

    expect(result).toEqual(data)
  })
  it('text returns the result', async () => {
    const data = 'Hello World!'
    response.text.mockResolvedValue(data)

    const res = await fetcher('foo', '/')
    const result = await res.text()

    expect(result).toEqual(data)
  })
  it('blob returns the result', async () => {
    const data = new Blob()
    response.blob.mockResolvedValue(data)

    const res = await fetcher('foo', '/')
    const result = await res.blob()

    expect(result).toEqual(data)
  })
  describe('record', () => {
    let recorder: Recorder
    beforeEach(() => {
      recorder = jest.fn().mockResolvedValue(undefined)
      fetcher = wrap(fetch, { record: recorder })
    })
    it('records with the correct parameters for json', async () => {
      response.json.mockResolvedValue({})

      await (await fetcher('foo', '/')).json()

      const expectedInfo: CallInfo = {
        name: 'foo',
        type: 'json',
        url: '/',
        status: 200,
        statusText: 'ok',
      }
      const expectedData = {}
      expect(recorder).toHaveBeenCalledWith(expectedInfo, expectedData)
    })
    it('records with the correct parameters for text', async () => {
      response.text.mockResolvedValue('Hello')

      await (await fetcher('foo', '/')).text()

      const expectedInfo: CallInfo = {
        name: 'foo',
        type: 'text',
        url: '/',
        status: 200,
        statusText: 'ok',
      }
      const expectedData = 'Hello'
      expect(recorder).toHaveBeenCalledWith(expectedInfo, expectedData)
    })
    it('records with the correct parameters for blob', async () => {
      const data = new Blob('Hello')
      response.blob.mockResolvedValue(data)

      await (await fetcher('foo', '/')).blob()

      const expectedInfo: CallInfo = {
        name: 'foo',
        type: 'blob',
        url: '/',
        status: 200,
        statusText: 'ok',
      }
      expect(recorder).toHaveBeenCalledWith(expectedInfo, data)
    })
  })
})
