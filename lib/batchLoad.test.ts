import { MockedFunction, MockedObject } from 'ts-jest/dist/utils/testing'
import init from './'
import { Api } from './api'
import { Fetch, Response } from './types'
import CookieManager from '@react-native-cookies/cookies'

describe('batch load', () => {
  let api: Api
  let fetch: Fetch
  let response: MockedObject<Response>
  beforeEach(() => {
    response = {
      headers: { get: jest.fn() },
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn(),
      text: jest.fn(),
    }
    fetch = jest.fn().mockResolvedValue(response)
    api = init(fetch, CookieManager)
  })
  it('sets batchMode to false as default', () => {
    expect(api.batchMode).toBe(false)
  })
  it('sets batchMode to true if one or more children has status FS', async () => {
    response.json.mockResolvedValue({
      Success: true,
      Error: null,
      Data: [
        { Status: "GR" },
        { Status: "FS" },
      ],
    })
    await api.getChildren()

    expect(api.batchMode).toBe(true)
  })
  it('sets batchMode to false on logout', async () => {
    api.batchMode = true
    await api.logout()

    expect(api.batchMode).toBe(false)
  })
})