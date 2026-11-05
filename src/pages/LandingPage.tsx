import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Compass, Heart, Repeat, Sparkles, Star, Users } from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';
import { apiRequest } from '@/lib/api';
import { CATEGORY_LABELS, type PublicStats, type SkillCategory } from '@/types';

const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS) as SkillCategory[];

const STEPS = [
  { icon: BookOpen, title: 'Share what you know', text: 'List the skills you can teach, from Java to guitar chords.' },
  { icon: Repeat, title: 'Swap with a classmate', text: 'Send a request, agree on a time and meet for one focused hour.' },
  { icon: Heart, title: 'Earn and spend credits', text: 'Teaching earns one credit per hour. Learning spends one. No money changes hands.' },
];

const FEATURED = [
  { name: 'Java Programming', by: 'Priya Sharma', tone: 'bg-primary', level: 'Expert' },
  { name: 'Graphic Design', by: 'Liam Chen', tone: 'bg-secondary', level: 'Advanced' },
  { name: 'Spanish Conversation', by: 'Sofia Martinez', tone: 'bg-accent', level: 'Expert' },
  { name: 'Calculus', by: 'Arjun Singh', tone: 'bg-warm', level: 'Advanced' },
];

export default function LandingPage() {
  const { t } = usePreferences();
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<PublicStats>('/public/stats')
      .then(setStats)
      .catch((err: Error) => setStatsError(err.message));
  }, []);

  const statCards = [
    { label: 'Students', value: stats?.students },
    { label: 'Skills offered', value: stats?.skillOffers },
    { label: 'Sessions completed', value: stats?.sessionsCompleted },
    { label: 'Hours shared', value: stats?.hoursExchanged },
  ];

  return (
    <div className="overflow-hidden">
      <section className="relative">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/60 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-secondary/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col justify-center">
            <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-bold shadow-soft">
              <Sparkles className="h-4 w-4" /> Learn something new this week
            </span>
            <h1 className="font-display text-5xl font-semibold leading-[1.1] sm:text-6xl">
              {t('tagline')}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              TimeBank is a student skill exchange. Teach what you already know, learn what you need, and settle everything in time credits instead of money.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-pastel-hero px-7 py-3.5 font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                {t('getStarted')} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/skills" className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-7 py-3.5 font-bold text-ink transition hover:-translate-y-0.5 hover:shadow-soft">
                <Compass className="h-4 w-4" /> {t('exploreSkills')}
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-md rounded-[2rem] bg-surface p-8 shadow-lift">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-muted">Your balance</p>
                <Star className="h-5 w-5 text-warm" />
              </div>
              <p className="mt-2 font-display text-6xl font-semibold">4<span className="ml-2 text-lg text-muted">{t('timeCredits')}</span></p>
              <div className="mt-8 space-y-3">
                {FEATURED.slice(0, 3).map((item) => (
                  <div key={item.name} className="flex items-center gap-4 rounded-2xl bg-bg p-4 transition hover:translate-x-1">
                    <span className={`h-10 w-10 rounded-xl ${item.tone}`} />
                    <div className="flex-1">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-muted">with {item.by}</p>
                    </div>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">{item.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-center font-display text-4xl font-semibold">How it works</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="rounded-[1.75rem] border border-line bg-surface p-8 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pastel-warm">
                <step.icon className="h-6 w-6" />
              </span>
              <p className="mt-6 text-sm font-bold text-muted">Step {index + 1}</p>
              <h3 className="mt-1 text-2xl">{step.title}</h3>
              <p className="mt-3 text-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="font-display text-4xl font-semibold">Popular categories</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {CATEGORY_ORDER.map((category) => (
            <Link
              key={category}
              to={`/skills?category=${category}`}
              className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-primary hover:shadow-soft"
            >
              {CATEGORY_LABELS[category]}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl font-semibold">Featured student skills</h2>
          <Link to="/skills" className="hidden font-bold hover:underline sm:block">See all skills</Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((item) => (
            <div key={item.name} className="group rounded-[1.75rem] bg-surface p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
              <span className={`block h-24 rounded-2xl ${item.tone} transition group-hover:scale-[1.02]`} />
              <h3 className="mt-5 text-xl">{item.name}</h3>
              <p className="mt-1 text-sm text-muted">Taught by {item.by}</p>
              <span className="mt-4 inline-block rounded-full bg-bg px-3 py-1 text-xs font-bold">{item.level}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="rounded-[2rem] bg-pastel-hero p-10 shadow-lift sm:p-14">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-4xl font-semibold">Platform at a glance</h2>
              <p className="mt-3 max-w-md text-ink/80">Live numbers from our Java backend.</p>
              {statsError && <p className="mt-4 rounded-2xl bg-surface px-4 py-3 text-sm font-semibold">{statsError}</p>}
            </div>
            <div className="grid flex-1 grid-cols-2 gap-4 md:max-w-xl">
              {statCards.map((card) => (
                <div key={card.label} className="rounded-3xl bg-surface/90 p-6 shadow-soft">
                  <p className="font-display text-4xl font-semibold">{card.value ?? '-'}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-muted">
                    <Users className="h-4 w-4" /> {card.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
