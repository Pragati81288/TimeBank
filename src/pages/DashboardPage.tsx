import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, GraduationCap, Sparkles, Star, Wallet as WalletIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import Alert from '@/components/Alert';
import { Avatar } from '@/components/Avatar';
import { apiRequest, ApiError } from '@/lib/api';
import { formatDateTime, STATUS_STYLES } from '@/lib/format';
import type { Dashboard } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = usePreferences();
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<Dashboard>('/users/me/dashboard')
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load your dashboard.'));
  }, []);

  if (error) return <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><Alert tone="error" message={error} /></div>;
  if (!data || !user) return <div className="mx-auto max-w-6xl px-4 py-12 text-muted sm:px-6">{t('loading')}</div>;

  const firstName = user.fullName.split(' ')[0];

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
      <section className="flex flex-col gap-6 rounded-[2rem] bg-pastel-hero p-8 shadow-soft md:flex-row md:items-center md:justify-between sm:p-10">
        <div>
          <p className="text-sm font-bold text-ink/70">{t('welcomeBack')}</p>
          <h1 className="mt-1 font-display text-4xl font-semibold">Hi, {firstName}</h1>
          <p className="mt-2 max-w-lg text-ink/80">
            {user.university ? `${user.university} · ` : ''}Rating {data.averageRating ? data.averageRating.toFixed(1) : 'not yet rated'} from {data.ratingCount} review(s)
          </p>
        </div>
        <div className="rounded-3xl bg-surface p-6 text-center shadow-soft">
          <p className="text-sm font-bold text-muted">{t('balance')}</p>
          <p className="font-display text-5xl font-semibold">{data.wallet.balance}</p>
          <p className="text-sm text-muted">{t('timeCredits')}</p>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        <StatCard icon={WalletIcon} label={t('earned')} value={data.wallet.totalEarned} tone="bg-primary" />
        <StatCard icon={GraduationCap} label={t('spent')} value={data.wallet.totalSpent} tone="bg-secondary" />
        <StatCard icon={Star} label="Unread notifications" value={data.unreadNotifications} tone="bg-accent" />
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Panel title={t('teachSkills')} action={{ to: '/skills', label: 'Manage' }}>
            {data.teaching.length === 0 ? (
              <EmptyText>You have not listed any teaching skills yet.</EmptyText>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {data.teaching.map((skill) => (
                  <li key={skill.id} className="flex items-center justify-between rounded-2xl bg-bg px-4 py-3">
                    <span className="font-bold">{skill.name}</span>
                    <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold">{skill.level}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title={t('learnSkills')} action={{ to: '/skills', label: 'Add' }}>
            {data.learning.length === 0 ? (
              <EmptyText>Add a skill you would love to learn.</EmptyText>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {data.learning.map((skill) => (
                  <li key={skill.id} className="flex items-center justify-between rounded-2xl bg-bg px-4 py-3">
                    <span className="font-bold">{skill.name}</span>
                    <span className="text-xs font-semibold text-muted">{skill.level}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title={t('recommended')} action={{ to: '/matches', label: 'See all' }}>
            {data.recommendedMatches.length === 0 ? (
              <EmptyText>No mutual matches yet. Add a teaching skill and a learning goal to find partners.</EmptyText>
            ) : (
              <ul className="space-y-3">
                {data.recommendedMatches.map((match) => (
                  <li key={match.userId} className="flex items-center gap-4 rounded-2xl bg-bg p-4">
                    <Avatar avatarId={match.avatarId} size={44} />
                    <div className="flex-1">
                      <p className="font-bold">{match.fullName}</p>
                      <p className="text-sm text-muted">{match.explanation}</p>
                    </div>
                    <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold">{match.matchPercent}%</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-8">
          <Panel title={t('pendingRequests')} action={{ to: '/exchanges', label: 'Open' }}>
            {data.pendingRequests.length === 0 ? (
              <EmptyText>No pending requests right now.</EmptyText>
            ) : (
              <ul className="space-y-3">
                {data.pendingRequests.map((request) => (
                  <li key={request.id} className="rounded-2xl bg-bg p-4">
                    <div className="flex items-center gap-3">
                      <Avatar avatarId={request.role === 'TEACHER' ? request.learner.avatarId : request.teacher.avatarId} size={40} />
                      <div>
                        <p className="font-bold">{request.skillName}</p>
                        <p className="text-sm text-muted">
                          {request.role === 'TEACHER' ? `From ${request.learner.fullName}` : `Waiting for ${request.teacher.fullName}`}
                        </p>
                      </div>
                    </div>
                    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[request.status]}`}>{request.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title={t('upcomingSessions')} action={{ to: '/exchanges', label: 'Schedule' }}>
            {data.upcomingSessions.length === 0 ? (
              <EmptyText>No sessions booked yet.</EmptyText>
            ) : (
              <ul className="space-y-3">
                {data.upcomingSessions.map((session) => (
                  <li key={session.id} className="flex items-start gap-3 rounded-2xl bg-bg p-4">
                    <Avatar avatarId={session.partnerAvatarId} size={40} />
                    <div>
                      <p className="font-bold">{session.skillName} with {session.partnerName}</p>
                      <p className="text-sm text-muted">{formatDateTime(session.scheduledAt)} · {session.hours}h</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Achievements">
            <ul className="grid grid-cols-1 gap-3">
              {data.badges.map((badge) => (
                <li key={badge.key} className={`flex items-center gap-3 rounded-2xl p-3 ${badge.earned ? 'bg-secondary/60' : 'bg-bg opacity-60'}`}>
                  <Award className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">{badge.title}</p>
                    <p className="text-xs text-muted">{badge.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title={t('recentActivity')} action={{ to: '/notifications', label: 'All' }}>
            {data.recentActivity.length === 0 ? (
              <EmptyText>Nothing new yet.</EmptyText>
            ) : (
              <ul className="space-y-3 text-sm">
                {data.recentActivity.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-warm" />
                    <div>
                      <p className={item.read ? 'text-muted' : 'font-semibold'}>{item.message}</p>
                      <p className="text-xs text-muted">{formatDateTime(item.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }: { icon: typeof Star; label: string; value: number; tone: string }) {
  return (
    <div className="rounded-[1.5rem] bg-surface p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 font-display text-3xl font-semibold">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: { to: string; label: string }; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.75rem] bg-surface p-6 shadow-soft sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl">{title}</h2>
        {action && <Link to={action.to} className="text-sm font-bold hover:underline">{action.label}</Link>}
      </div>
      {children}
    </section>
  );
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return <p className="flex items-center gap-2 text-sm text-muted"><BookOpen className="h-4 w-4" />{children}</p>;
}
