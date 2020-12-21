import * as moment from 'moment'
import * as h2m from 'h2m'
import { htmlDecode } from 'js-htmlencode'
import { CalendarItem, Child, NewsItem } from './types'

const camel = require('camelcase-keys')

export interface EtjanstResponse {
  Success: boolean
  Error: string|null
  Data: any|any[]
}

export const etjanst = (response: EtjanstResponse): any|any[] => {
  if (!response.Success) {
    throw new Error(response.Error || '')
  }
  return camel(response.Data, { deep: true })
}

export const child = ({
  id, sdsId, name, status, schoolId,
}: any): Child => ({
  id, sdsId, name, status, schoolId,
})

export const calendarItem = ({
  id, title, description, location, startDate, endDate, allDay,
}: any): CalendarItem => ({
  id, title, description, location, startDate, endDate, allDay,
})

export const newsItem = ({
  newsId, header, preamble, body, bannerImageUrl, pubDateSe, modDateSe,
}: any): NewsItem => ({
  header,
  id: newsId,
  intro: preamble,
  imageUrl: bannerImageUrl,
  body: htmlDecode(h2m(body)),
  published: moment(new Date(pubDateSe)),
  modified: moment(new Date(modDateSe)),
})
