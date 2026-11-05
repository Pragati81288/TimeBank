import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Pencil, Plus, Search, Trash2, UserPlus } from 'lucide-react';
import Alert from '@/components/Alert';
import { Avatar } from '@/components/Avatar';
import Modal from '@/components/Modal';
import RequestSessionModal from '@/components/RequestSessionModal';
import SkillFormModal from '@/components/SkillFormModal';
import { apiRequest, ApiError } from '@/lib/api';
import { CATEGORY_LABELS, type SkillCategory, type SkillOffer } from '@/types';

type Tab = 'browse' | 'mine';

export default function SkillsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>('browse');
  const [query, setQuery] = useState('');
  const category = (searchParams.get('category') as SkillCategory | null) ?? null;
  const [browse, setBrowse] = useState<SkillOffer[]>([]);
  const [mine, setMine] = useState<SkillOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SkillOffer | null>(null);
  const [deleting, setDeleting] = useState<SkillOffer | null>(null);
  const [requestTarget, setRequestTarget] = useState<{ id: number; fullName: string } | null>(null);

  const loadBrowse = useCallback(async () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (category) params.set('category', category);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<SkillOffer[]>(`/skills/browse${suffix}`);
  }, [query, category]);

  const loadMine = useCallback(() => apiRequest<SkillOffer[]>('/skills/mine'), []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [browseData, mineData] = await Promise.all([loadBrowse(), loadMine()]);
      setBrowse(browseData);
      setMine(mineData);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load skills.');
    } finally {
      setLoading(false);
    }
  }, [loadBrowse, loadMine]);

  useEffect(() => {
    const timer = setTimeout(() => {
      refresh();
    }, 250);
    return () => clearTimeout(timer);
  }, [refresh]);

  const teaching = useMemo(() => mine.filter((item) => item.skillType === 'TEACH'), [mine]);
  const learning = useMemo(() => mine.filter((item) => item.skillType === 'LEARN'), [mine]);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await apiRequest(`/skills/mine/${deleting.id}`, { method: 'DELETE' });
      setMessage({ tone: 'success', text: `${deleting.name} removed.` });
      setDeleting(null);
      refresh();
    } catch (err) {
      setMessage({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not delete this skill.' });
      setDeleting(null);
    }
  };

  const setCategory = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('category', value);
    else next.delete('category');
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Skills</h1>
          <p className="mt-2 text-muted">Discover what classmates can teach, or share your own.</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-pastel-hero px-6 py-3 font-bold shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          <Plus className="h-4 w-4" /> Add a skill
        </button>
      </header>

      {message && <Alert tone={message.tone} message={message.text} />}
      {error && <Alert tone="error" message={error} />}

      <div className="flex gap-2 rounded-full bg-surface p-1.5 shadow-soft w-fit">
        {(['browse', 'mine'] as Tab[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${tab === item ? 'bg-primary' : 'hover:bg-bg'}`}
          >
            {item === 'browse' ? 'Browse skills' : 'My skills'}
          </button>
        ))}
      </div>

      {tab === 'browse' ? (
        <section className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="flex flex-1 items-center gap-3 rounded-full border border-line bg-surface px-5 py-3 shadow-soft focus-within:ring-4 focus-within:ring-primary">
              <Search className="h-4 w-4 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by skill name"
                className="w-full bg-transparent outline-none"
                aria-label="Search by skill name"
              />
            </label>
            <select
              value={category ?? ''}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full border border-line bg-surface px-5 py-3 font-semibold shadow-soft outline-none focus:ring-4 focus:ring-primary"
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {(Object.keys(CATEGORY_LABELS) as SkillCategory[]).map((key) => (
                <option key={key} value={key}>{CATEGORY_LABELS[key]}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-muted">Loading skills...</p>
          ) : browse.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-line p-12 text-center text-muted">
              No matching skills yet. Try another search or be the first to teach it.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {browse.map((offer) => (
                <article key={offer.id} className="flex flex-col rounded-[1.75rem] bg-surface p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                  <span className="w-fit rounded-full bg-secondary/70 px-3 py-1 text-xs font-bold">{CATEGORY_LABELS[offer.category]}</span>
                  <h3 className="mt-4 text-2xl">{offer.name}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-muted">
                    <Avatar avatarId={offer.ownerAvatarId} size={28} />
                    Taught by {offer.ownerName} · {offer.level}
                  </p>
                  {offer.details && <p className="mt-3 text-sm">{offer.details}</p>}
                  <button
                    type="button"
                    onClick={() => setRequestTarget({ id: offer.ownerId, fullName: offer.ownerName })}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-pastel-hero py-3 font-bold transition hover:-translate-y-0.5"
                  >
                    <UserPlus className="h-4 w-4" /> Request a session
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="grid gap-8 lg:grid-cols-2">
          <SkillList title="Skills I can teach" items={teaching} onEdit={(s) => { setEditing(s); setFormOpen(true); }} onDelete={setDeleting} />
          <SkillList title="Skills I want to learn" items={learning} onEdit={(s) => { setEditing(s); setFormOpen(true); }} onDelete={setDeleting} />
        </section>
      )}

      <SkillFormModal
        open={formOpen}
        existing={editing}
        onClose={() => setFormOpen(false)}
        onSaved={(text) => { setMessage({ tone: 'success', text }); refresh(); }}
      />

      <RequestSessionModal
        open={requestTarget !== null}
        teacher={requestTarget}
        onClose={() => setRequestTarget(null)}
        onRequested={(text) => setMessage({ tone: 'success', text })}
      />

      <Modal open={deleting !== null} title="Remove this skill?" onClose={() => setDeleting(null)}>
        <p className="text-muted">{deleting?.name} will be removed from your profile. Past sessions are not affected.</p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={() => setDeleting(null)} className="flex-1 rounded-full border border-line py-3 font-bold">Keep it</button>
          <button type="button" onClick={confirmDelete} className="flex-1 rounded-full bg-rose-200 py-3 font-bold">Remove</button>
        </div>
      </Modal>
    </div>
  );
}

function SkillList({ title, items, onEdit, onDelete }: {
  title: string;
  items: SkillOffer[];
  onEdit: (skill: SkillOffer) => void;
  onDelete: (skill: SkillOffer) => void;
}) {
  return (
    <div className="rounded-[1.75rem] bg-surface p-6 shadow-soft">
      <h2 className="mb-5 text-2xl">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted">Nothing here yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((skill) => (
            <li key={skill.id} className="flex items-center justify-between gap-4 rounded-2xl bg-bg p-4">
              <div>
                <p className="font-bold">{skill.name}</p>
                <p className="text-sm text-muted">{CATEGORY_LABELS[skill.category]} · {skill.level}</p>
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => onEdit(skill)} className="rounded-full p-2 transition hover:bg-primary/60" aria-label={`Edit ${skill.name}`}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => onDelete(skill)} className="rounded-full p-2 transition hover:bg-rose-100" aria-label={`Delete ${skill.name}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
