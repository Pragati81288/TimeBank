import { useEffect, useState, type FormEvent } from 'react';
import { Award, Star } from 'lucide-react';
import Alert from '@/components/Alert';
import { Avatar, AVATAR_IDS } from '@/components/Avatar';
import { useAuth } from '@/context/AuthContext';
import { apiRequest, ApiError } from '@/lib/api';
import { formatDate } from '@/lib/format';
import type { Badge, Dashboard, Rating, User } from '@/types';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [form, setForm] = useState({ fullName: '', bio: '', university: '', location: '', avatarId: 'avatar-01' });
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.fullName,
      bio: user.bio ?? '',
      university: user.university ?? '',
      location: user.location ?? '',
      avatarId: user.avatarId,
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiRequest<Dashboard>('/users/me/dashboard'),
      apiRequest<Rating[]>(`/users/${user.id}/ratings`),
    ])
      .then(([dashboard, ratingData]) => {
        setBadges(dashboard.badges);
        setRatings(ratingData);
      })
      .catch((err) => setMessage({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not load your profile details.' }));
  }, [user]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (form.fullName.trim().length < 2) {
      setMessage({ tone: 'error', text: 'Please enter your full name.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const updated = await apiRequest<User>('/users/me', {
        method: 'PUT',
        body: {
          fullName: form.fullName.trim(),
          bio: form.bio.trim() || null,
          university: form.university.trim() || null,
          location: form.location.trim() || null,
          avatarId: form.avatarId,
        },
      });
      setUser(updated);
      setMessage({ tone: 'success', text: 'Profile saved.' });
    } catch (err) {
      setMessage({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not save your profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const average = ratings.length ? ratings.reduce((sum, item) => sum + item.stars, 0) / ratings.length : 0;
  const inputClass = 'w-full rounded-2xl border border-line bg-bg px-4 py-3 outline-none focus:ring-4 focus:ring-primary';

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6">
      <header className="flex items-center gap-5">
        <Avatar avatarId={user.avatarId} size={80} className="shadow-soft" />
        <div>
          <h1 className="font-display text-4xl font-semibold">{user.fullName}</h1>
          <p className="text-muted">{user.email} · Member since {formatDate(user.createdAt)}</p>
        </div>
      </header>

      {message && <Alert tone={message.tone} message={message.text} />}

      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-[1.75rem] bg-surface p-6 shadow-soft sm:p-8 lg:col-span-2">
          <h2 className="text-2xl">Edit profile</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-bold">Full name</label>
              <input id="fullName" className={inputClass} value={form.fullName} maxLength={100} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label htmlFor="university" className="text-sm font-bold">University</label>
              <input id="university" className={inputClass} value={form.university} maxLength={150} onChange={(e) => setForm({ ...form, university: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-bold">Location</label>
              <input id="location" className={inputClass} value={form.location} maxLength={100} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-bold">Choose your avatar</p>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
              {AVATAR_IDS.map((id) => {
                const selected = form.avatarId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setForm({ ...form, avatarId: id })}
                    className={`rounded-full p-1 transition hover:-translate-y-0.5 ${selected ? 'bg-primary ring-4 ring-primary' : 'hover:bg-bg'}`}
                  >
                    <Avatar avatarId={id} size={56} />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-bold">About you</label>
            <textarea id="bio" rows={4} maxLength={500} className={inputClass} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-pastel-hero px-7 py-3 font-bold shadow-soft transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </form>

        <div className="space-y-8">
          <section className="rounded-[1.75rem] bg-surface p-6 shadow-soft">
            <h2 className="mb-4 flex items-center gap-2 text-2xl"><Award className="h-5 w-5" /> Badges</h2>
            <ul className="space-y-3">
              {badges.map((badge) => (
                <li key={badge.key} className={`rounded-2xl p-3 ${badge.earned ? 'bg-secondary/60' : 'bg-bg opacity-60'}`}>
                  <p className="text-sm font-bold">{badge.title}</p>
                  <p className="text-xs text-muted">{badge.description}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[1.75rem] bg-surface p-6 shadow-soft">
            <h2 className="mb-1 flex items-center gap-2 text-2xl"><Star className="h-5 w-5" /> Ratings</h2>
            <p className="mb-4 text-sm text-muted">{ratings.length ? `${average.toFixed(1)} average from ${ratings.length} review(s)` : 'No reviews yet.'}</p>
            <ul className="space-y-3">
              {ratings.map((rating) => (
                <li key={rating.id} className="rounded-2xl bg-bg p-4">
                  <p className="text-sm font-bold">{rating.raterName} · {rating.stars} star{rating.stars === 1 ? '' : 's'}</p>
                  <p className="text-xs text-muted">{rating.skillName}</p>
                  {rating.comment && <p className="mt-2 text-sm">{rating.comment}</p>}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
