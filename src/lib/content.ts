import siteJson from '../data/site.json';
import { athensInstant } from './format';

export interface Block {
  id: string;
  kicker: string;
  title: string;
  text: string;
  empty: string;
}

export interface NavItem {
  id: string;
  label: string;
}

export interface Named {
  name: string;
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
  rank: number;
  size: string;
}

export interface SalePoint {
  name: string;
  area: string;
  address: string;
  hours: string;
  mapUrl: string;
}

export interface SectionFace {
  color: string;
  tone: string;
  image: string;
  position: string;
  size: string;
  opacity: number;
}

export interface Look {
  backgroundColor: string;
  backgroundImage: string;
  backgroundPosition: string;
  backgroundSize: string;
  backgroundRepeat: string;
  backgroundOpacity: number;
  ink: string;
  paper: string;
  clay: string;
  lane: string;
  button: string;
  countdownWash: string;
  sections: {
    hero: SectionFace;
    athletes: SectionFace;
    clubs: SectionFace;
    transparency: SectionFace;
    tickets: SectionFace;
    sponsors: SectionFace;
    contact: SectionFace;
  };
}

interface Site {
  title: string;
  description: string;
  city: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
  ticketPrice: number;
  ticketGoal: number;
  ticketsSold: number;
  ticketsUpdatedAt: string;
  hero: {
    lineStart: string;
    bridge: string;
    lineEnd: string;
    lede: string;
    cta: string;
  };
  nav: NavItem[];
  blocks: {
    organizers: Block;
    athletes: Block;
    clubs: Block;
    transparency: Block;
    sponsors: Block & {
      askTitle: string;
      askText: string;
    };
    tickets: Block;
    contact: Block;
  };
  countdown: {
    label: string;
    done: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  stats: {
    sold: string;
    raised: string;
    goal: string;
    updated: string;
  };
  labels: {
    nav: string;
    map: string;
    phone: string;
    email: string;
    back: string;
    backToForm: string;
    sponsorCta: string;
  };
  form: {
    name: string;
    phone: string;
    email: string;
    area: string;
    count: string;
    countMax: number;
    phonePlaceholder: string;
    areaPlaceholder: string;
    either: string;
    submit: string;
    privacy: string;
    fail: string;
  };
  message: {
    name: string;
    phone: string;
    email: string;
    body: string;
    bodyPlaceholder: string;
    either: string;
    submit: string;
    privacy: string;
    fail: string;
  };
  notices: {
    thanksTitle: string;
    thanksText: string;
    failedTitle: string;
    failedText: string;
  };
  contact: {
    phone: string;
    phoneDisplay: string;
    email: string;
  };
  look: Look;
  organizers: Named[];
  athletes: Athlete[];
  clubs: Named[];
  sponsors: Sponsor[];
  salePoints: SalePoint[];
}

function hex(value: string, fallback: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

function cssToken(value: string, fallback: string) {
  return /^[a-zA-Z0-9% ._-]{1,48}$/.test(value) ? value : fallback;
}

function imagePath(value: string) {
  if (!value) return '';
  if ((/^https?:\/\//.test(value) || value.startsWith('/')) && !/["'()]/.test(value)) return value;
  return '';
}

function opacity(value: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0.4;
  return Math.min(1, Math.max(0, value));
}

function wash(value: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+)\s*)?\)$/.test(value)) return value;
  return 'rgba(243, 236, 223, 0.08)';
}

function face(raw: SectionFace, fallbackColor: string, fallbackTone: 'dark' | 'light'): SectionFace {
  const tone = raw.tone === 'light' || raw.tone === 'dark' ? raw.tone : fallbackTone;
  return {
    color: hex(raw.color, fallbackColor),
    tone,
    image: imagePath(raw.image),
    position: cssToken(raw.position, 'center center'),
    size: cssToken(raw.size, 'cover'),
    opacity: opacity(raw.opacity),
  };
}

function named(list: Named[]) {
  return list.filter((item) => item.name.trim().length > 0);
}

function sponsorSize(value: string) {
  if (value === 'large' || value === 'medium' || value === 'small') return value;
  return 'medium';
}

function rankedSponsors(list: Sponsor[]) {
  return list
    .filter((item) => item.name.trim().length > 0)
    .map((item) => ({
      ...item,
      rank: Number.isFinite(item.rank) ? item.rank : 100,
      size: sponsorSize(item.size),
    }))
    .sort((a, b) => a.rank - b.rank);
}

function sanitizeLook(look: Look): Look {
  const dark = '#100e0c';
  const paper = hex(look.paper, '#efe6d6');
  const clay = hex(look.clay, '#4a3c36');
  return {
    backgroundColor: hex(look.backgroundColor, dark),
    backgroundImage: imagePath(look.backgroundImage),
    backgroundPosition: cssToken(look.backgroundPosition, 'center center'),
    backgroundSize: cssToken(look.backgroundSize, 'cover'),
    backgroundRepeat: cssToken(look.backgroundRepeat, 'no-repeat'),
    backgroundOpacity: opacity(look.backgroundOpacity),
    ink: hex(look.ink, '#f3ecdf'),
    paper,
    clay,
    lane: hex(look.lane, '#e23b2f'),
    button: hex(look.button, '#9c241e'),
    countdownWash: wash(look.countdownWash),
    sections: {
      hero: face(look.sections.hero, dark, 'dark'),
      athletes: face(look.sections.athletes, dark, 'dark'),
      clubs: face(look.sections.clubs, dark, 'dark'),
      transparency: face(look.sections.transparency, paper, 'light'),
      tickets: face(look.sections.tickets, paper, 'light'),
      sponsors: face(look.sections.sponsors, clay, 'dark'),
      contact: face(look.sections.contact, clay, 'dark'),
    },
  };
}

const parsed = siteJson satisfies Site;

export const site = {
  ...parsed,
  look: sanitizeLook(parsed.look),
  nav: parsed.nav.filter((item) => item.id.trim() && item.label.trim()),
  organizers: named(parsed.organizers),
  athletes: parsed.athletes.filter((item) => item.name.trim().length > 0),
  clubs: named(parsed.clubs),
  sponsors: rankedSponsors(parsed.sponsors),
  salePoints: parsed.salePoints.filter((item) => item.name.trim().length > 0),
};

export const startsAt = athensInstant(site.date, site.time).toISOString();

export function lookVars(look: Look) {
  return [
    `--bg:${look.backgroundColor}`,
    `--ink:${look.ink}`,
    `--paper:${look.paper}`,
    `--lane:${look.lane}`,
    `--button:${look.button}`,
  ].join(';');
}
