import { useEffect, useState, type FormEvent } from 'react';
import Modal from '@/components/Modal';
import Alert from '@/components/Alert';
import { apiRequest, ApiError } from '@/lib/api';
import { CATEGORY_LABELS, type SkillCategory, type SkillOffer, type CatalogSkill } from '@/types';

interface SkillFormModalProps {
  open: boolean;
  existing: SkillOffer | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function SkillFormModal({ open, existing, onClose, onSaved }: SkillFormModalProps) {
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('PROGRAMMING');
  const [skillType, setSkillType] = useState<'TEACH' | 'LEARN'>('TEACH');
  const [level, setLevel] = useState('Intermediate');
  const [details, setDetails] = useState('');
  const [suggestions, setSuggestions] = useState<CatalogSkill[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSkillName(existing?.name ?? '');
    setCategory(existing?.category ?? 'PROGRAMMING');
    setSkillType(existing?.skillType ?? 'TEACH');
    setLevel(existing?.level ?? 'Intermediate');
    setDetails(existing?.details ?? '');
  }, [open, existing]);

  useEffect(() => {
    if (!open || existing) return;
    apiRequest<CatalogSkill[]>('/skills')
      .then(setSuggestions)
      .catch(() => setSuggestions([]));
  }, [open, existing]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!existing && skillName.trim().length < 2) {
      setError('Enter a skill name with at least 2 characters');
      return;
    }
    setSubmitting(true);
    try {
      if (existing) {
        await apiRequest(`/skills/mine/${existing.id}`, { method: 'PUT', body: { level, details: details.trim() || null } });
        onSaved(`${existing.name} updated.`);
      } else {
        await apiRequest('/skills/mine', {
          method: 'POST',
          body: { skillName: skillName.trim(), category, skillType, level, details: details.trim() || null },
        });
        onSaved(`${skillName.trim()} added to your skills.`);
      }
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save this skill.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full rounded-2xl border border-line bg-bg px-4 py-3 outline-none focus:ring-4 focus:ring-primary disabled:opacity-60';

  return (
    <Modal open={open} title={existing ? 'Edit skill' : 'Add a skill'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert tone="error" message={error} />}

        <div className="space-y-2">
          <label htmlFor="skillName" className="text-sm font-bold">Skill name</label>
          <input
            id="skillName"
            list="skill-suggestions"
            value={skillName}
            disabled={Boolean(existing)}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="e.g. Java, Photoshop, Guitar"
            className={inputClass}
          />
          <datalist id="skill-suggestions">
            {suggestions.map((skill) => <option key={skill.id} value={skill.name} />)}
          </datalist>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-bold">Category</label>
            <select id="category" value={category} disabled={Boolean(existing)} onChange={(e) => setCategory(e.target.value as SkillCategory)} className={inputClass}>
              {(Object.keys(CATEGORY_LABELS) as SkillCategory[]).map((key) => (
                <option key={key} value={key}>{CATEGORY_LABELS[key]}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="skillType" className="text-sm font-bold">I want to</label>
            <select id="skillType" value={skillType} disabled={Boolean(existing)} onChange={(e) => setSkillType(e.target.value as 'TEACH' | 'LEARN')} className={inputClass}>
              <option value="TEACH">Teach this</option>
              <option value="LEARN">Learn this</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="level" className="text-sm font-bold">Level</label>
          <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} className={inputClass}>
            {LEVELS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="details" className="text-sm font-bold">Details (optional)</label>
          <textarea id="details" rows={3} maxLength={300} value={details} onChange={(e) => setDetails(e.target.value)} className={inputClass} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-pastel-hero py-3.5 font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Save skill'}
        </button>
      </form>
    </Modal>
  );
}
