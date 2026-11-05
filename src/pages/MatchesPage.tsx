import { useEffect, useState } from 'react';
import { Sparkles, UserPlus } from 'lucide-react';
import Alert from '@/components/Alert';
import { Avatar } from '@/components/Avatar';
import RequestSessionModal from '@/components/RequestSessionModal';
import { apiRequest, ApiError } from '@/lib/api';
import type { Match } from '@/types';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [target, setTarget] = useState<Match | null>(null);

  useEffect(() => {
    apiRequest<Match[]>('/matches')
      .then(setMatches)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load matches.'));
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6">
      <header>
        <h1 className="font-display text-4xl font-semibold">Skill matches</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Matches are students who can teach you something you want to learn and want to learn something you can teach.
        </p>
      </header>

      {notice && <Alert tone="success" message={notice} />}
      {error && <Alert tone="error" message={error} />}

      {!matches && !error && <p className="text-muted">Finding your matches...</p>}

      {matches && matches.length === 0 && (
        <div className="rounded-[1.75rem] border border-dashed border-line p-12 text-center text-muted">
          No matches yet. Add skills you teach and skills you want to learn on the Skills page.
        </div>
      )}

      <div className="space-y-5">
        {matches?.map((match) => (
          <article key={match.userId} className="grid gap-6 rounded-[1.75rem] bg-surface p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift md:grid-cols-[1fr_auto] md:items-center sm:p-8">
            <div>
              <div className="flex items-center gap-3">
                <Avatar avatarId={match.avatarId} size={48} />
                <div>
                  <h2 className="text-2xl">{match.fullName}</h2>
                  {match.university && <p className="text-sm text-muted">{match.university}</p>}
                </div>
              </div>
              <p className="mt-4 flex items-start gap-2 text-sm">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-warm" />
                {match.explanation}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                {match.canTeachYou.map((name) => (
                  <span key={`t-${name}`} className="rounded-full bg-accent px-3 py-1">Teaches you {name}</span>
                ))}
                {match.wantsFromYou.map((name) => (
                  <span key={`w-${name}`} className="rounded-full bg-secondary px-3 py-1">Wants {name} from you</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 md:items-end">
              <div className="rounded-3xl bg-pastel-warm px-6 py-4 text-center">
                <p className="font-display text-4xl font-semibold">{match.matchPercent}%</p>
                <p className="text-xs font-bold">match</p>
              </div>
              <button
                type="button"
                onClick={() => setTarget(match)}
                className="inline-flex items-center gap-2 rounded-full bg-pastel-hero px-5 py-2.5 font-bold transition hover:-translate-y-0.5"
              >
                <UserPlus className="h-4 w-4" /> Request session
              </button>
            </div>
          </article>
        ))}
      </div>

      <RequestSessionModal
        open={target !== null}
        teacher={target ? { id: target.userId, fullName: target.fullName } : null}
        onClose={() => setTarget(null)}
        onRequested={setNotice}
      />
    </div>
  );
}
