const athens = 'Europe/Athens';

export function athensInstant(date: string, time: string) {
  const pretend = new Date(`${date}T${time}:00Z`);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: athens,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = Object.fromEntries(
    formatter
      .formatToParts(pretend)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );
  const hour = parts.hour === '24' ? 0 : Number(parts.hour);
  const wall = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    hour,
    Number(parts.minute),
    Number(parts.second),
  );
  return new Date(pretend.getTime() - (wall - pretend.getTime()));
}

export function formatWeekday(iso: string) {
  return new Intl.DateTimeFormat('el-GR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: athens,
  }).format(new Date(iso));
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat('el-GR', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: athens,
  }).format(new Date(iso));
}

export function formatDay(isoDate: string) {
  return new Intl.DateTimeFormat('el-GR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: athens,
  }).format(new Date(`${isoDate}T12:00:00+03:00`));
}

export function formatShortDay(iso: string) {
  return new Intl.DateTimeFormat('el-GR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: athens,
  }).format(new Date(iso));
}

export function formatEuros(amount: number) {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function phoneHref(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('30')) return `tel:+${digits}`;
  return `tel:+30${digits}`;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters =
    parts.length <= 1 ? (parts[0] ?? '').slice(0, 2) : parts.slice(0, 2).map((part) => part[0]).join('');
  return letters.toLocaleUpperCase('el-GR');
}

export function remainingParts(deadline: string, now = Date.now()) {
  const total = Math.max(0, Math.floor((new Date(deadline).getTime() - now) / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: new Date(deadline).getTime() <= now,
  };
}

export function pad(value: number) {
  return String(value).padStart(2, '0');
}
