import wrap, { Fetcher } from './fetcher'
import { checkStatus } from './loginStatus'
import { Fetch, Headers, Response } from './types'

describe.skip('login', () => {
  describe('#checkStatus', () => {
    /*
    it('exposes token', () => {
      response.text.mockResolvedValue('PENDING')

      const check = checkStatus(fetch)(ticket)
      expect(check.token).toEqual(ticket.token)
      check.cancel()
    })
    it('emits PENDING', (done) => {
      response.text.mockResolvedValue('PENDING')

      const check = checkStatus(fetch)(ticket)
      check.on('PENDING', async () => {
        await check.cancel()
        done()
      })
    })
    it('retries on PENDING', (done) => {
      response.text.mockResolvedValueOnce('PENDING')
      response.text.mockResolvedValueOnce('OK')

      const check = checkStatus(fetch)(ticket)
      check.on('OK', () => {
        expect(fetch).toHaveBeenCalledTimes(2)
        done()
      })
    })
  })
  describe('#getSessionCookie', () => {
    it('returns session cookie', async () => {
      headers.get.mockReturnValue('cookie')

      const cookie = await getSessionCookie(fetch)()

      expect(cookie).toEqual('cookie')
    })
  */
    it('works', () => { })
  })
})
