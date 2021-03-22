import lock, { Lock } from './lock'

describe('lock', () => {
  it('returns a Lock instance', async () => {
    const _lock = await lock('id')
    expect(_lock).toBeDefined()
    _lock.release()
  })
  it('returns the same instance for the same id', async () => {
    const lock1 = await lock('id')
    const lock2 = await lock('id')

    expect(lock1).toStrictEqual(lock2)
    
    lock1.release()
    lock2.release()
  })
  it('does not return a new lock while another is active', async (done) => {
    let allReleased = false
    const lock1 = await lock('id')
    lock('id2').then((lock2) => {
      expect(allReleased).toBe(true)
      lock2.release()
      done()
    })
    const lock3 = await lock('id')

    lock1.release()
    lock3.release()
    allReleased = true
  })
})
