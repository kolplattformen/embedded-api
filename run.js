const nodeFetch = require('node-fetch')
const { CookieJar } = require('tough-cookie')
const fetchCookie = require('fetch-cookie/node-fetch')

const init = require('./dist').default

const [,,personalNumber] = process.argv

if (!personalNumber) {
  console.error('You must pass in a valid personal number, eg `node run 197001011111`')
  process.exit(1)
}

async function run () {
  const cookieJar = new CookieJar()
  const fetch = fetchCookie(nodeFetch, cookieJar)

  try {

    const api = init(fetch, () => cookieJar.removeAllCookies())
    const status = await api.login(personalNumber)
    status.on('PENDING', () => console.log('PENDING'))
    status.on('USER_SIGN', () => console.log('USER_SIGN'))
    status.on('ERROR', () => console.error('ERROR'))
    status.on('OK', () => console.log('OK'))

    api.on('login', async () => {
      console.log('Logged in')
      const children = await api.getChildren()
      console.log(children)
      const calendar = await api.getCalendar(children[0].id)
      console.log(calendar)
      const classmates = await api.getClassmates(children[0].id)
      console.log(classmates)
      const schedule = await api.getSchedule(children[0].id)
      console.log(schedule)

      await api.logout()
    })

    api.on('logout', () => {
      console.log('Logged out')
      process.exit(0)
    })
  } catch (err) {
    console.error(err)
  }
}

run()
