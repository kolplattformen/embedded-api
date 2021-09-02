import { Language } from '@skolplattformen/curriculum/dist/translations';
import { LoginStatusChecker } from './loginStatus';
import {
  CalendarItem,
  Classmate,
  MenuItem,
  NewsItem,
  Notification,
  User,
  Skola24Child,
  EtjanstChild
} from './types';

export interface IApi {
  getPersonalNumber(): string | undefined;
  login(personalNumber?: string): Promise<LoginStatusChecker>;
  setSessionCookie(sessionCookie: string): Promise<void>;
  getUser(): Promise<User>;
  getChildren(): Promise<EtjanstChild[]>;
  getCalendar(child: EtjanstChild): Promise<CalendarItem[]>;
  getClassmates(child: EtjanstChild): Promise<Classmate[]>;
  getNews(child: EtjanstChild): Promise<NewsItem[]>;
  getNewsDetails(child: EtjanstChild, item: NewsItem): Promise<any>;
  getMenu(child: EtjanstChild): Promise<MenuItem[]>;
  getNotifications(child: EtjanstChild): Promise<Notification[]>;
  getSkola24Children(): Promise<Skola24Child[]>;
  getTimetable(child: Skola24Child, week: number, year: number, lang: Language): Promise<any>;
  logout(): Promise<void>;
}
