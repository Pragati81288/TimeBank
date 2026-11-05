import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import Logo from '@/components/Logo';
import { usePreferences } from '@/context/PreferencesContext';

export default function Footer() {
  const { t } = usePreferences();
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="space-y-4 md:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm text-muted">{t('tagline')}</p>
        </div>
        <div className="space-y-3">
          <h3 className="text-base">Explore</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="hover:text-ink" to="/skills">Browse skills</Link></li>
            <li><Link className="hover:text-ink" to="/register">Join for free</Link></li>
            <li><Link className="hover:text-ink" to="/login">Sign in</Link></li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-base">Contact</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@timebank.demo</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (555) 010-2026</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Campus Hub, Student Union</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © 2026 TimeBank. Time credits are not real money.
      </div>
    </footer>
  );
}
