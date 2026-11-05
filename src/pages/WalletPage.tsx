import { useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Wallet as WalletIcon } from 'lucide-react';
import Alert from '@/components/Alert';
import { usePreferences } from '@/context/PreferencesContext';
import { apiRequest, ApiError } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import type { Transaction, Wallet } from '@/types';

export default function WalletPage() {
  const { t } = usePreferences();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([apiRequest<Wallet>('/wallet'), apiRequest<Transaction[]>('/wallet/transactions')])
      .then(([walletData, transactionData]) => {
        setWallet(walletData);
        setTransactions(transactionData);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load your wallet.'));
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <header>
        <h1 className="font-display text-4xl font-semibold">Wallet</h1>
        <p className="mt-2 text-muted">Earn one credit for every hour you teach, and spend one for every hour you learn.</p>
      </header>

      {error && <Alert tone="error" message={error} />}

      {wallet && (
        <section className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-[1.75rem] bg-pastel-hero p-6 shadow-soft sm:col-span-1">
            <WalletIcon className="h-6 w-6" />
            <p className="mt-4 text-sm font-bold">{t('balance')}</p>
            <p className="font-display text-5xl font-semibold">{wallet.balance}</p>
          </div>
          <div className="rounded-[1.75rem] bg-surface p-6 shadow-soft">
            <p className="text-sm font-bold text-muted">{t('earned')}</p>
            <p className="mt-2 font-display text-4xl font-semibold">{wallet.totalEarned}</p>
          </div>
          <div className="rounded-[1.75rem] bg-surface p-6 shadow-soft">
            <p className="text-sm font-bold text-muted">{t('spent')}</p>
            <p className="mt-2 font-display text-4xl font-semibold">{wallet.totalSpent}</p>
          </div>
        </section>
      )}

      <section className="rounded-[1.75rem] bg-surface p-6 shadow-soft sm:p-8">
        <h2 className="mb-5 text-2xl">{t('transactions')}</h2>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted">No transactions yet. Complete a session to see your first credits move.</p>
        ) : (
          <ul className="divide-y divide-line">
            {transactions.map((item) => {
              const earned = item.type === 'EARN';
              return (
                <li key={item.id} className="flex items-center gap-4 py-4">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${earned ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                    {earned ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold">{item.description}</p>
                    <p className="text-xs text-muted">{formatDateTime(item.createdAt)} · balance {item.balanceAfter}</p>
                  </div>
                  <p className={`font-display text-xl font-semibold ${earned ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {earned ? '+' : '-'}{item.amount}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
