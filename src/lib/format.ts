export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function toLocalInputValue(date: Date): string {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-warm/60 text-ink',
  ACCEPTED: 'bg-sky-100 text-ink',
  SCHEDULED: 'bg-sky-100 text-ink',
  COMPLETED: 'bg-emerald-100 text-emerald-900',
  REJECTED: 'bg-rose-100 text-rose-900',
  CANCELLED: 'bg-line text-ink',
};
