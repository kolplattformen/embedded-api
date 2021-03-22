import { EventEmitter } from 'events'

export class Lock extends EventEmitter {
  public readonly id: string

  private waiting: number = 1

  constructor(id: string) {
    super()
    this.id = id
  }

  public increment(): void {
    this.waiting += 1
  }

  public release(): void {
    this.waiting -= 1
    if (this.waiting === 0) {
      this.emit('release')
    }
  }
}

let active: Lock | undefined
const lock = async (id: string): Promise<Lock> => {
  if (active) {
    if (active.id === id) {
      active.increment()
      return active
    }

    return new Promise((resolve) => {
      active?.once('release', () => {
        resolve(lock(id))
      })
    })
  }

  active = new Lock(id)
  active.once('release', () => {
    active = undefined
  })
  return active
}

export default lock
