import { useCallback, useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import Alert from '@/components/Alert';
import { apiRequest, ApiError } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import type { Notification } from '@/types';

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await apiRequest<Notification[]>('/notifications'));
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load notifications.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (id: number) => {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: 'POST' });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update this notification.');
    }
  };

  const markAll = async () => {
    setBusy(true);
    try {
      await apiRequest('/notifications/read-all', { method: 'POST' });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update notifications.');
    } finally {
      setBusy(false);
    }
  };

  const unread = items?.filter((item) => !item.read).length ?? 0;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Notifications</h1>
          <p className="mt-2 text-muted">{unread > 0 ? `${unread} unread` : 'You are all caught up.'}</p>
        </div>
        {unread > 0 && (
          <button
            type="button"
            onClick={markAll}
            disabled={busy}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-pastel-hero px-5 py-2.5 font-bold shadow-soft transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </button>
        )}
      </header>

      {error && <Alert tone="error" message={error} />}
      {items === null && !error && <p className="text-muted">Loading...</p>}

      {items && items.length === 0 && (
        <div className="rounded-[1.75rem] border border-dashed border-line p-12 text-center text-muted">
          <Bell className="mx-auto mb-3 h-6 w-6" />
          Updates about your requests, sessions and credits will appear here.
        </div>
      )}

      {items && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex items-start gap-4 rounded-[1.5rem] p-5 shadow-soft transition ${item.read ? 'bg-surface' : 'bg-secondary/50'}`}
            >
              <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${item.read ? 'bg-line' : 'bg-ink'}`} aria-hidden="true" />
              <div className="flex-1">
                <p className={item.read ? 'text-muted' : 'font-semibold'}>{item.message}</p>
                <p className="mt-1 text-xs text-muted">{formatDateTime(item.createdAt)}</p>
              </div>
              {!item.read && (
                <button
                  type="button"
                  onClick={() => markRead(item.id)}
                  className="shrink-0 rounded-full border border-line bg-bg px-3 py-1.5 text-xs font-bold transition hover:-translate-y-0.5"
                >
                  Mark read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
