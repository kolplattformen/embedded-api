import routes from './routes'
import {
  CalendarItem, Child, Classmate, Fetch, RequestInit,
} from './types'
import { etjanst, child, calendarItem } from './parse'
import moment, { Moment } from 'moment'

export const list = (fetch: Fetch, init?: RequestInit) => async (): Promise<Child[]> => {
  const url = routes.children
  const response = await fetch(url, init)
  const data = await response.json()
  return etjanst(data).map(child)
}

export const calendar = (fetch: Fetch, init?:RequestInit) => async (childId: string): Promise<CalendarItem[]> => {
  const url = routes.calendar(childId)
  const response = await fetch(url, init)
  const data = await response.json()
  return etjanst(data).map(calendarItem)
}

export const classmates = (fetch: Fetch, init?:RequestInit) => async (childId: string): Promise<Classmate[]> => {
  const url = routes.classmates(childId)
  const response = await fetch(url, init)
  const data = await response.json()
  return etjanst(data)
}

export const schedule = (fetch: Fetch, init?:RequestInit) => async (childId: string): Promise<any> => {
  const from: Moment = moment().subtract(1, 'month')
  const to: Moment = moment().add(1, 'month')
  const url = routes.schedule(childId, from.toISOString(), to.toISOString())
  const response = await fetch(url, init)
  const data = await response.json()
  return etjanst(data)
}
