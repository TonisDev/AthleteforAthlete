import eventJson from '../data/event.json';
import athletesJson from '../data/athletes.json';
import sponsorsJson from '../data/sponsors.json';
import salePointsJson from '../data/salePoints.json';
import { athensInstant } from './format';

export interface EventInfo {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
  city: string;
  ticketPrice: number;
  ticketGoal: number;
  ticketsSold: number;
  ticketsUpdatedAt: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  organizers: string[];
}

export interface Athlete {
  name: string;
  discipline: string;
  achievements: string[];
  image: string;
}

export interface Sponsor {
  name: string;
  offer: string;
  url: string;
  logo: string;
}

export interface SalePoint {
  name: string;
  area: string;
  address: string;
  hours: string;
  mapUrl: string;
}

export const event = eventJson satisfies EventInfo;
export const startsAt = athensInstant(event.date, event.time).toISOString();

const athletesRaw = athletesJson satisfies Athlete[];
export const athletes = athletesRaw.filter((athlete) => athlete.name.trim().length > 0);

const sponsorsRaw = sponsorsJson satisfies Sponsor[];
export const sponsors = sponsorsRaw.filter((sponsor) => sponsor.name.trim().length > 0);

const salePointsRaw = salePointsJson satisfies SalePoint[];
export const salePoints = salePointsRaw.filter((point) => point.name.trim().length > 0);
