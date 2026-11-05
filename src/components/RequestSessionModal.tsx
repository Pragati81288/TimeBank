import { useEffect, useState, type FormEvent } from 'react';
import Modal from '@/components/Modal';
import Alert from '@/components/Alert';
import { apiRequest, ApiError } from '@/lib/api';
import type { SkillOffer } from '@/types';

interface SessionTarget {
  id: number;
  fullName: string;
}

interface RequestSessionModalProps {
  open: boolean;
  teacher: SessionTarget | null;
  onClose: () => void;
  onRequested: (message: string) => void;
}

export default function RequestSessionModal({ open, teacher, onClose, onRequested }: RequestSessionModalProps) {
  const [offers, setOffers] = useState<SkillOffer[]>([]);
  const [skillId, setSkillId] = useState<number | ''>('');
  const [hours, setHours] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !teacher) return;
    setSkillId('');
    setHours(1);
    setMessage('');
    setError(null);
    setLoading(true);
    apiRequest<SkillOffer[]>('/skills/browse')
      .then((all) => setOffers(all.filter((offer) => offer.ownerId === teacher.id)))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [open, teacher]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!teacher) return;
    if (skillId === '') {
      setError('Choose a skill to learn');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest('/exchanges', {
        method: 'POST',
        body: { teacherId: teacher.id, skillId, hours, message: message.trim() || null },
      });
      onRequested(`Request sent to ${teacher.fullName}.`);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send the request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} title={`Request a session with ${teacher?.fullName ?? ''}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert tone="error" message={error} />}
        {loading ? (
          <p className="text-sm text-muted">Loading their skills...</p>
        ) : offers.length === 0 ? (
          <p className="text-sm text-muted">This student has no teaching skills listed yet.</p>
        ) : (
          <>
            <div className="space-y-2">
              <label htmlFor="skill" className="text-sm font-bold">Skill you want to learn</label>
              <select
                id="skill"
                value={skillId}
                onChange={(e) => setSkillId(e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-2xl border border-line bg-bg px-4 py-3 outline-none focus:ring-4 focus:ring-primary"
              >
                <option value="">Choose a skill</option>
                {offers.map((offer) => (
                  <option key={offer.id} value={offer.skillId}>{offer.name} ({offer.level})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="hours" className="text-sm font-bold">Hours (costs this many credits)</label>
              <input
                id="hours"
                type="number"
                min={1}
                max={4}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full rounded-2xl border border-line bg-bg px-4 py-3 outline-none focus:ring-4 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-bold">Message (optional)</label>
              <textarea
                id="message"
                rows={3}
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-2xl border border-line bg-bg px-4 py-3 outline-none focus:ring-4 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-pastel-hero py-3.5 font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send request'}
            </button>
          </>
        )}
      </form>
    </Modal>
  );
}
