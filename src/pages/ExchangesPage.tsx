import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, CheckCheck, Star } from 'lucide-react';
import Alert from '@/components/Alert';
import { Avatar } from '@/components/Avatar';
import { RateModal, ScheduleModal } from '@/components/exchanges/ExchangeDialogs';
import { apiRequest, ApiError } from '@/lib/api';
import { formatDateTime, STATUS_STYLES, toLocalInputValue } from '@/lib/format';
import type { ExchangeRequest, Session } from '@/types';

type Tab = 'requests' | 'sessions';

interface Feedback {
  tone: 'success' | 'error';
  text: string;
}

export default function ExchangesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: Tab = searchParams.get('tab') === 'sessions' ? 'sessions' : 'requests';
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [scheduleId, setScheduleId] = useState<number | null>(null);
  const [rateTarget, setRateTarget] = useState<{ requestId: number; partnerName: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [requestData, sessionData] = await Promise.all([
        apiRequest<ExchangeRequest[]>('/exchanges'),
        apiRequest<Session[]>('/sessions'),
      ]);
      setRequests(requestData);
      setSessions(sessionData);
    } catch (err) {
      setFeedback({ tone: 'error', text: err instanceof ApiError ? err.message : 'Could not load exchanges.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setTab = (next: Tab) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', next);
    setSearchParams(params, { replace: true });
  };

  const runAction = async (request: ExchangeRequest, action: 'accept' | 'reject' | 'cancel' | 'complete', success: string) => {
    setBusyId(request.id);
    setFeedback(null);
    try {
      await apiRequest(`/exchanges/${request.id}/${action}`, { method: 'POST' });
      setFeedback({ tone: 'success', text: success });
      await load();
    } catch (err) {
      setFeedback({ tone: 'error', text: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.' });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6">
      <header>
        <h1 className="font-display text-4xl font-semibold">Exchanges</h1>
        <p className="mt-2 text-muted">Accept requests, book times, and mark sessions complete to move credits.</p>
      </header>

      {feedback && <Alert tone={feedback.tone} message={feedback.text} />}

      <div className="flex w-fit gap-2 rounded-full bg-surface p-1.5 shadow-soft">
        {(['requests', 'sessions'] as Tab[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${tab === item ? 'bg-primary' : 'hover:bg-bg'}`}
          >
            {item === 'requests' ? 'Requests' : 'Sessions'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : tab === 'requests' ? (
        requests.length === 0 ? (
          <Empty text="No exchange requests yet. Find a skill on the Skills page to get started." />
        ) : (
          <ul className="space-y-5">
            {requests.map((request) => {
              const isTeacher = request.role === 'TEACHER';
              const busy = busyId === request.id;
              return (
                <li key={request.id} className="rounded-[1.75rem] bg-surface p-6 shadow-soft sm:p-7">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl">{request.skillName}</h2>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[request.status]}`}>{request.status}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                        <Avatar avatarId={isTeacher ? request.learner.avatarId : request.teacher.avatarId} size={24} />
                        <span>{isTeacher ? `Requested by ${request.learner.fullName}` : `Teacher: ${request.teacher.fullName}`} · {request.hours}h</span>
                      </div>
                      {request.message && <p className="mt-3 rounded-2xl bg-bg p-4 text-sm">&ldquo;{request.message}&rdquo;</p>}
                      {request.scheduledAt && (
                        <p className="mt-3 flex items-center gap-2 text-sm font-semibold">
                          <Calendar className="h-4 w-4" /> {formatDateTime(request.scheduledAt)}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {request.status === 'PENDING' && isTeacher && (
                        <>
                          <ActionButton disabled={busy} onClick={() => runAction(request, 'accept', 'Request accepted.')} tone="primary">Accept</ActionButton>
                          <ActionButton disabled={busy} onClick={() => runAction(request, 'reject', 'Request declined.')}>Decline</ActionButton>
                        </>
                      )}
                      {(request.status === 'PENDING' || (request.status === 'ACCEPTED' && request.sessionStatus !== 'COMPLETED')) && !isTeacher && (
                        <ActionButton disabled={busy} onClick={() => runAction(request, 'cancel', 'Request cancelled.')}>Cancel</ActionButton>
                      )}
                      {request.status === 'ACCEPTED' && request.sessionStatus !== 'COMPLETED' && (
                        <>
                          <ActionButton disabled={busy} onClick={() => setScheduleId(request.id)} tone="primary">
                            {request.scheduledAt ? 'Reschedule' : 'Schedule'}
                          </ActionButton>
                          {request.scheduledAt && (
                            <ActionButton disabled={busy} onClick={() => runAction(request, 'complete', 'Session marked complete. Credits updated.')}>
                              <CheckCheck className="h-4 w-4" /> Mark complete
                            </ActionButton>
                          )}
                        </>
                      )}
                      {request.rateable && (
                        <ActionButton
                          onClick={() => setRateTarget({ requestId: request.id, partnerName: request.role === 'TEACHER' ? request.learner.fullName : request.teacher.fullName })}
                        >
                          <Star className="h-4 w-4" /> Rate
                        </ActionButton>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )
      ) : sessions.length === 0 ? (
        <Empty text="No sessions yet. Once a request is scheduled it will appear here." />
      ) : (
        <ul className="space-y-4">
          {sessions.map((session) => (
            <li key={session.id} className="flex flex-col gap-3 rounded-[1.5rem] bg-surface p-6 shadow-soft md:flex-row md:items-center md:justify-between">
              <Avatar avatarId={session.partnerAvatarId} size={48} />
              <div className="flex-1">
                <p className="font-bold">{session.skillName} with {session.partnerName}</p>
                <p className="text-sm text-muted">{formatDateTime(session.scheduledAt)} · {session.hours}h · {session.role === 'TEACHER' ? 'You teach' : 'You learn'}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[session.status]}`}>{session.status}</span>
                {session.rateable && (
                  <ActionButton onClick={() => setRateTarget({ requestId: session.requestId, partnerName: session.partnerName })}>
                    <Star className="h-4 w-4" /> Rate
                  </ActionButton>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <ScheduleModal
        requestId={scheduleId}
        defaultValue={toLocalInputValue(new Date(Date.now() + 24 * 60 * 60 * 1000))}
        onClose={() => setScheduleId(null)}
        onDone={(text) => { setFeedback({ tone: 'success', text }); load(); }}
      />

      <RateModal
        requestId={rateTarget?.requestId ?? null}
        partnerName={rateTarget?.partnerName ?? ''}
        onClose={() => setRateTarget(null)}
        onDone={(text) => { setFeedback({ tone: 'success', text }); load(); }}
      />

    </div>
  );
}

function ActionButton({ children, onClick, disabled, tone }: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tone?: 'primary';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 disabled:opacity-50 ${
        tone === 'primary' ? 'bg-pastel-hero shadow-soft' : 'border border-line bg-bg'
      }`}
    >
      {children}
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-[1.75rem] border border-dashed border-line p-12 text-center text-muted">{text}</div>;
}
