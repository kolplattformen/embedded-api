import fetcher, { CallInfo, Fetcher, Recorder } from './fetcher'
import { Fetch, Headers, Response } from './types'
const Blob = require('node-blob')
Blob.prototype.arrayBuffer = async function () {
  return this.buffer.buffer
}

describe('fetcher', () => {
  let fetch: jest.Mocked<Fetch>
  let response: jest.Mocked<Response>
  let headers: jest.Mocked<Headers>
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
  })
  describe('#fetchJson', () => {
    let fetchJson: Fetcher<any>
    beforeEach(() => {
      fetchJson = fetcher(fetch).fetchJson
    })
    it('calls fetch', async () => {
      await fetchJson('foo', '/')
      expect(fetch).toHaveBeenCalledWith('/', undefined)
    })
    it('calls response.json()', async () => {
      await fetchJson('foo', '/')
      expect(response.json).toHaveBeenCalled()
    })
    it('returns the result', async () => {
      const data = { foo: 'bar' }
      response.json.mockResolvedValue(data)

      const result = await fetchJson('foo', '/')

      expect(result).toEqual(data)
    })
  })
  describe('#fetchText', () => {
    let fetchText: Fetcher<string>
    beforeEach(() => {
      fetchText = fetcher(fetch).fetchText
    })
    it('calls fetch', async () => {
      await fetchText('foo', '/')
      expect(fetch).toHaveBeenCalledWith('/', undefined)
    })
    it('calls response.text()', async () => {
      await fetchText('foo', '/')
      expect(response.text).toHaveBeenCalled()
    })
    it('returns the result', async () => {
      const data = 'Hello World!'
      response.text.mockResolvedValue(data)

      const result = await fetchText('foo', '/')

      expect(result).toEqual(data)
    })
  })
  describe('#fetchRaw', () => {
    let fetchRaw: Fetcher<Blob>
    beforeEach(() => {
      fetchRaw = fetcher(fetch).fetchRaw
    })
    it('calls fetch', async () => {
      await fetchRaw('foo', '/')
      expect(fetch).toHaveBeenCalledWith('/', undefined)
    })
    it('calls response.blob()', async () => {
      await fetchRaw('foo', '/')
      expect(response.blob).toHaveBeenCalled()
    })
    it('returns the result', async () => {
      const data = new Blob()
      response.blob.mockResolvedValue(data)

      const result = await fetchRaw('foo', '/')

      expect(result).toEqual(data)
    })
  })
  describe('record', () => {
    let recorder: Recorder
    beforeEach(() => {
      recorder = jest.fn().mockResolvedValue(undefined)
    })
    describe('#fetchJson', () => {
      let fetchJson: Fetcher<any>
      beforeEach(() => {
        fetchJson = fetcher(fetch, { record: recorder }).fetchJson
      })
      it('records with the correct filename', async () => {
        response.json.mockResolvedValue({})

        await fetchJson('foo', '/')

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
    })
    describe('#fetchText', () => {
      let fetchText: Fetcher<string>
      beforeEach(() => {
        fetchText = fetcher(fetch, { record: recorder }).fetchText
      })
      it('records with the correct filename', async () => {
        response.text.mockResolvedValue('Hello')

        await fetchText('foo', '/')

        const expectedInfo: CallInfo = {
          name: 'foo',
          type: 'txt',
          url: '/',
          status: 200,
          statusText: 'ok',
        }
        const expectedData = 'Hello'
        expect(recorder).toHaveBeenCalledWith(expectedInfo, expectedData)
      })
    })
    describe('#fetchRaw', () => {
      let fetchRaw: Fetcher<Blob>
      beforeEach(() => {
        fetchRaw = fetcher(fetch, { record: recorder }).fetchRaw
      })
      it('records with the correct filename', async () => {
        const data = new Blob('Hello')
        response.blob.mockResolvedValue(data)

        await fetchRaw('foo', '/')

        const expectedInfo: CallInfo = {
          name: 'foo',
          type: 'binary',
          url: '/',
          status: 200,
          statusText: 'ok',
        }
        const expectedData = data.buffer.buffer
        expect(recorder).toHaveBeenCalledWith(expectedInfo, expectedData)
      })
    })
  })
})
