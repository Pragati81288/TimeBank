import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Bell, Clock, LogOut, Menu, Wallet, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import Logo from '@/components/Logo';
import { Avatar } from '@/components/Avatar';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { t } = usePreferences();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = user
    ? [
        { to: '/dashboard', label: t('navDashboard') },
        { to: '/skills', label: t('navSkills') },
        { to: '/matches', label: t('navMatches') },
        { to: '/exchanges', label: t('navExchanges') },
        { to: '/wallet', label: t('navWallet') },
      ]
    : [
        { to: '/', label: t('navHome') },
        { to: '/skills', label: t('navSkills') },
      ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      isActive ? 'bg-primary text-ink' : 'text-ink/80 hover:bg-primary/60 hover:text-ink'
    }`;

  const handleSignOut = () => {
    signOut();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              <Link to="/notifications" className="rounded-full p-2.5 text-ink transition hover:bg-primary/60" aria-label={t('navNotifications')}>
                <Bell className="h-5 w-5" />
              </Link>
              <Link to="/profile" className="flex items-center gap-2 rounded-full bg-secondary/60 py-1.5 pl-1.5 pr-4 text-sm font-semibold transition hover:bg-secondary">
                <Avatar avatarId={user.avatarId} size={32} />
                {user.fullName.split(' ')[0]}
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full p-2.5 text-ink transition hover:bg-primary/60"
                aria-label={t('signOut')}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-ink transition hover:bg-primary/60">
                {t('signIn')}
              </Link>
              <Link to="/register" className="rounded-full bg-pastel-hero px-5 py-2.5 text-sm font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                {t('getStarted')}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-full p-2 text-ink lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-surface px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setOpen(false)} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/wallet" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-primary/60">
                  <Wallet className="h-4 w-4" /> {t('navWallet')}
                </Link>
                <Link to="/notifications" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-primary/60">
                  <Bell className="h-4 w-4" /> {t('navNotifications')}
                </Link>
                <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-primary/60">
                  <Clock className="h-4 w-4" /> {t('navProfile')}
                </Link>
                <button type="button" onClick={handleSignOut} className="rounded-full bg-primary px-4 py-3 text-sm font-bold">
                  {t('signOut')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-full px-4 py-3 text-center text-sm font-semibold hover:bg-primary/60">
                  {t('signIn')}
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="rounded-full bg-pastel-hero px-4 py-3 text-center text-sm font-bold">
                  {t('getStarted')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
