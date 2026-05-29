import React, { useEffect, useState } from 'react';

interface PromptPairRow {
  id: string;
  shitty: string;
  withContext: string;
  failureMode: string;
  status: 'candidate' | 'approved' | 'rejected';
}

type View = 'run' | 'candidates' | 'approved';

interface ShittyPromptsApi {
  run: (req: { pairCount: number; provider: string; model: string }) => Promise<{ runId: string; pairCount: number }>;
  listByStatus: (status: 'candidate' | 'approved' | 'rejected') => Promise<PromptPairRow[]>;
  accept: (id: string) => Promise<void>;
  reject: (id: string) => Promise<void>;
  edit: (id: string, patch: { shitty?: string; withContext?: string }) => Promise<void>;
}

interface ShittyPromptsTabProps {
  api: ShittyPromptsApi;
}

export function ShittyPromptsTab({ api }: ShittyPromptsTabProps): React.JSX.Element {
  const [view, setView] = useState<View>('candidates');
  const [candidates, setCandidates] = useState<PromptPairRow[]>([]);
  const [approved, setApproved] = useState<PromptPairRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const [candidateRows, approvedRows] = await Promise.all([
        api.listByStatus('candidate'),
        api.listByStatus('approved'),
      ]);
      setCandidates(candidateRows);
      setApproved(approvedRows);
      setError(null);
    } catch (err) {
      setCandidates([]);
      setApproved([]);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  useEffect(() => { void refresh(); }, []);

  const acceptPair = async (id: string) => {
    setError(null);
    try {
      await api.accept(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const rejectPair = async (id: string) => {
    setError(null);
    try {
      await api.reject(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const generate = async () => {
    setBusy(true);
    setError(null);
    try {
      await api.run({ pairCount: 12, provider: 'ollama', model: 'gemma3:4b' });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="shitty-prompts-tab">
      <nav className="sp-subnav">
        <button type="button" onClick={() => setView('run')}>Run</button>
        <button type="button" onClick={() => setView('candidates')}>Candidates ({candidates.length})</button>
        <button type="button" onClick={() => setView('approved')}>Approved ({approved.length})</button>
      </nav>

      {error && <div className="atelier-alert atelier-alert--error">{error}</div>}

      {view === 'run' && (
        <section className="sp-run">
          <button type="button" className="atelier-btn atelier-btn--primary" onClick={() => void generate()} disabled={busy}>
            {busy ? 'Generating...' : 'Generate 12 pairs'}
          </button>
        </section>
      )}

      {view === 'candidates' && (
        <ul className="sp-candidates">
          {candidates.length === 0 && <li className="sp-empty">No candidates. Run a generation first.</li>}
          {candidates.map((p) => (
            <li key={p.id} className="sp-row">
              <div className="sp-shitty">{p.shitty}</div>
              <div className="sp-with">{p.withContext}</div>
              <div className="sp-meta">{p.failureMode}</div>
              <div className="sp-actions">
                <button type="button" className="atelier-btn atelier-btn--primary" onClick={() => void acceptPair(p.id)}>Accept</button>
                <button type="button" className="atelier-btn atelier-btn--secondary" onClick={() => void rejectPair(p.id)}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {view === 'approved' && (
        <ul className="sp-approved">
          {approved.length === 0 && <li className="sp-empty">No approved pairs yet.</li>}
          {approved.map((p) => (
            <li key={p.id} className="sp-row">
              <div className="sp-shitty">{p.shitty}</div>
              <div className="sp-with">{p.withContext}</div>
              <div className="sp-meta">{p.failureMode}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
