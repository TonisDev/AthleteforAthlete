export const ticketApi = 'https://athlete-for-athlete.tonisdevv.workers.dev/api/tickets';

export function assetPath(path: string) {
  if (!path || /^https?:\/\//.test(path)) return path;
  const base = import.meta.env.BASE_URL;
  return `${base}${path.replace(/^\//, '')}`;
}
