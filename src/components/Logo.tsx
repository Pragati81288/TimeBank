import { Link } from 'react-router-dom';
import { Hourglass } from 'lucide-react';

export default function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="TimeBank home">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pastel-hero shadow-soft transition group-hover:rotate-12">
        <Hourglass className="h-5 w-5 text-ink" />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">TimeBank</span>
    </Link>
  );
}
