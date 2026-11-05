import { useState, type FormEvent } from 'react';
import Modal from '@/components/Modal';
import Alert from '@/components/Alert';
import { apiRequest, ApiError } from '@/lib/api';

interface ScheduleModalProps {
  requestId: number | null;
  defaultValue: string;
  onClose: () => void;
  onDone: (message: string) => void;
}

export function ScheduleModal({ requestId, defaultValue, onClose, onDone }: ScheduleModalProps) {
  const [scheduledAt, setScheduledAt] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (requestId === null) return;
    if (!scheduledAt) {
      setError('Choose a date and time');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest(`/exchanges/${requestId}/schedule`, { method: 'POST', body: { scheduledAt } });
      onDone('Session scheduled.');
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not schedule the session.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={requestId !== null} title="Schedule your session" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert tone="error" message={error} />}
        <div className="space-y-2">
          <label htmlFor="scheduledAt" className="text-sm font-bold">Date and time</label>
          <input
            id="scheduledAt"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full rounded-2xl border border-line bg-bg px-4 py-3 outline-none focus:ring-4 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-pastel-hero py-3.5 font-bold shadow-soft transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Confirm time'}
        </button>
      </form>
    </Modal>
  );
}

interface RateModalProps {
  requestId: number | null;
  partnerName: string;
  onClose: () => void;
  onDone: (message: string) => void;
}

export function RateModal({ requestId, partnerName, onClose, onDone }: RateModalProps) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (requestId === null) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest(`/exchanges/${requestId}/rate`, {
        method: 'POST',
        body: { stars, comment: comment.trim() || null },
      });
      onDone(`Thanks for rating ${partnerName}.`);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save your rating.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={requestId !== null} title={`Rate ${partnerName}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert tone="error" message={error} />}
        <div className="flex justify-center gap-2" role="radiogroup" aria-label="Stars">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={stars === value}
              aria-label={`${value} stars`}
              onClick={() => setStars(value)}
              className={`rounded-full px-3 py-2 text-2xl transition hover:scale-110 ${value <= stars ? 'text-warm' : 'text-line'}`}
            >
              &#9733;
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <label htmlFor="comment" className="text-sm font-bold">Comment (optional)</label>
          <textarea
            id="comment"
            rows={3}
            maxLength={300}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-2xl border border-line bg-bg px-4 py-3 outline-none focus:ring-4 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-pastel-hero py-3.5 font-bold shadow-soft transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {submitting ? 'Sending...' : 'Submit rating'}
        </button>
      </form>
    </Modal>
  );
}
