import { useState, useEffect, useRef } from 'react';
import { getTeams, getTeamAnswers, reviewAnswer } from '../../../services/api';

/* ── Inline SVG helpers ──────────────────────────────────── */
const AcceptIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const RejectIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const RefreshIcon = ({ spinning }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    style={spinning ? { animation: 'spin 1s linear infinite' } : {}}>
    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

/* shared style tokens */
const inputStyle = {
  width: '100%',
  padding: '0.65rem 1rem',
  borderRadius: 10,
  border: '2.5px solid var(--color-green)',
  fontSize: '0.95rem',
  fontFamily: 'var(--font-body)',
  background: 'var(--color-bg-primary)',
  color: 'var(--color-text-primary)',
  outline: 'none',
  boxSizing: 'border-box',
};

const TeamPanel = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamAnswers, setTeamAnswers] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [reviewingAnswers, setReviewingAnswers] = useState({});
  const pollingIntervalRef = useRef(null);
  const lastFetchTimestampRef = useRef(null);

  useEffect(() => {
    fetchTeams();
    pollingIntervalRef.current = setInterval(() => refreshData(), 10000);
    return () => { if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current); };
  }, []);

  // Removed useEffect on selectedTeam — handleTeamClick already calls fetchTeamAnswers.
  // Having it here caused an infinite loop because fetchTeamAnswers/fetchTeams
  // mutated selectedTeam, re-triggering this effect endlessly.

  const refreshData = async () => {
    setRefreshing(true);
    await fetchTeams(false, lastFetchTimestampRef.current);
    if (selectedTeam) await fetchTeamAnswers(selectedTeam.username, false, lastFetchTimestampRef.current);
    setRefreshing(false);
    setLastUpdated(new Date());
  };

  const fetchTeams = async (showLoading = true, timestamp = null) => {
    try {
      if (showLoading) setLoadingTeams(true);
      setError(null);
      const response = await getTeams(timestamp);
      lastFetchTimestampRef.current = response.timestamp;
      if (response.success) {
        let updated = response.teams;
        if (timestamp && teams.length > 0 && response.teams.length > 0) {
          updated = [...teams];
          response.teams.forEach(t => {
            const idx = updated.findIndex(x => x.id === t.id);
            if (idx >= 0) updated[idx] = t; else updated.push(t);
          });
        }
        setTeams(updated);
        const filtered = updated.filter(t => t.username.toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredTeams(filtered);
        // Don't call setSelectedTeam here — it triggers infinite re-renders
        setLastUpdated(new Date());
      } else {
        setError(response.message);
      }
    } catch {
      setError('Failed to fetch teams');
    } finally {
      if (showLoading) setLoadingTeams(false);
    }
  };

  const fetchTeamAnswers = async (username, showLoading = true) => {
    try {
      if (showLoading) setLoadingAnswers(true);
      setError(null);
      const response = await getTeamAnswers(username);
      if (response.success) {
        const newAnswers = response.answers || [];
        setTeamAnswers(newAnswers);
        const updatedReviewing = { ...reviewingAnswers };
        newAnswers.forEach(a => { if (a.is_reviewed && updatedReviewing[a.id]) delete updatedReviewing[a.id]; });
        setReviewingAnswers(updatedReviewing);
      } else {
        setError(response.message);
        setTeamAnswers([]);
      }
    } catch {
      setError('Failed to fetch team answers');
      setTeamAnswers([]);
    } finally {
      if (showLoading) setLoadingAnswers(false);
    }
  };

  const formatDateTime = (ts) => {
    if (!ts) return 'N/A';
    return new Date(ts).toLocaleString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    });
  };

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setSearchQuery(q);
    setFilteredTeams(teams.filter(t => t.username.toLowerCase().includes(q)));
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    // Cloudinary URLs are already full https:// URLs
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // Legacy local paths
    const cleanPath = url.startsWith('/') ? url.substring(1) : url;
    const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '').replace(/\/$/, '');
    return `${baseUrl}/${cleanPath}`;
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    fetchTeamAnswers(team.username);
  };

  const handleReview = async (answerId, isAccepted, event) => {
    event.preventDefault();
    setError(null);
    setReviewingAnswers(prev => ({ ...prev, [answerId]: true }));
    // Optimistic update
    setTeamAnswers(prev => prev.map(a =>
      a.id === answerId ? { ...a, is_reviewed: true, is_accepted: isAccepted, reviewed_at: new Date().toISOString() } : a
    ));
    try {
      const response = await reviewAnswer(selectedTeam.username, answerId, isAccepted);
      if (response.success) {
        await fetchTeams(false);
      } else {
        setError(response.message || 'Failed to review answer');
        fetchTeamAnswers(selectedTeam.username, false);
      }
    } catch {
      setError('Failed to review answer');
      fetchTeamAnswers(selectedTeam.username, false);
    } finally {
      setReviewingAnswers(prev => { const u = { ...prev }; delete u[answerId]; return u; });
    }
  };

  /* ── Sub-renders ─────────────────────────────────────────── */
  const renderTeamList = () => (
    <div className="team-list-col">
      {/* Team list header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--color-green)', margin: 0 }}>
          🏴‍☠️ Teams ({filteredTeams.length})
        </h2>
        <button
          onClick={refreshData}
          disabled={refreshing}
          title="Refresh"
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: 'var(--color-blue)', border: '2px solid #4a9ab8', boxShadow: '2px 2px 0 #4a9ab8', borderRadius: 8, color: '#fff' }}
        >
          <RefreshIcon spinning={refreshing} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {lastUpdated && (
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brown)', marginBottom: '0.75rem' }}>
          🕐 {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search teams…"
        value={searchQuery}
        onChange={handleSearch}
        style={{ ...inputStyle, marginBottom: '0.75rem' }}
      />

      {/* List */}
      {loadingTeams && teams.length === 0 ? (
        <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-brown)', textAlign: 'center', padding: '1rem', animation: 'pulse 1.5s infinite' }}>
          Loading teams…
        </div>
      ) : filteredTeams.length === 0 ? (
        <div style={{ color: 'var(--color-green)', fontWeight: 700, textAlign: 'center', padding: '1rem' }}>No teams found</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filteredTeams.map(team => {
            const isSelected = selectedTeam?.id === team.id;
            return (
              <button
                key={team.id}
                onClick={() => handleTeamClick(team)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: 10,
                  border: isSelected ? '2.5px solid var(--color-green)' : '2px solid var(--color-bg-secondary)',
                  background: isSelected ? 'var(--color-bg-secondary)' : 'var(--color-bg-card)',
                  boxShadow: isSelected ? '3px 3px 0 var(--color-green-dim)' : 'none',
                  transform: isSelected ? 'translate(-2px, -2px)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <div style={{ fontWeight: 800, color: 'var(--color-green)', fontSize: '0.95rem' }}>{team.username}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-brown)', fontWeight: 600, marginTop: 2 }}>
                  📜 {team.answers_count || 0} answers submitted
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderAnswerCard = (answer) => {
    const statusColor = answer.is_accepted ? '#2e7d32' : 'var(--color-red)';
    const statusBg = answer.is_accepted ? '#e8f5e9' : '#ffebee';

    return (
      <div key={answer.id} style={{
        background: '#fff',
        borderRadius: 14,
        border: '2.5px solid var(--color-bg-secondary)',
        padding: '1.25rem',
        boxShadow: '3px 3px 0 var(--color-bg-secondary)',
      }}>
        {/* Top row: question num + timestamps */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '0.75rem' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--color-green)' }}>
              Question {answer.question_number}
              {answer.is_bonus && <span style={{ marginLeft: 6, color: '#c17900', fontSize: '0.85rem' }}>⭐ Bonus</span>}
            </span>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-brown)', fontWeight: 700, marginTop: 2, fontFamily: 'var(--font-mono)' }}>
              🪙 {answer.points} pts
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-green-dim)', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
            <div>Submitted: {formatDateTime(answer.submitted_at)}</div>
            {answer.is_reviewed && <div style={{ marginTop: 2 }}>Reviewed: {formatDateTime(answer.reviewed_at)}</div>}
          </div>
        </div>

        {/* Question text */}
        <p style={{ fontSize: '0.9rem', color: '#444', margin: '0 0 0.5rem 0', fontStyle: 'italic' }}>
          {answer.question_text}
        </p>

        {/* Question image */}
        {answer.question_image_url && (
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-green)', marginBottom: 4 }}>📷 Clue Image:</div>
            <img src={getImageUrl(answer.question_image_url)} alt="Question" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 10, border: '2px solid var(--color-green)', objectFit: 'contain' }}
              onError={e => { e.target.style.display = 'none'; }} />
          </div>
        )}

        {/* Answer */}
        <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-green)', marginBottom: 4 }}>📝 Team's Answer:</div>
          {answer.text_answer && <p style={{ margin: 0, fontSize: '0.95rem', color: '#333' }}>{answer.text_answer}</p>}
          {answer.image_answer_url && (
            <img src={getImageUrl(answer.image_answer_url)} alt="Answer" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 10, border: '2px solid var(--color-brown)', marginTop: 8, objectFit: 'contain' }}
              onError={e => { e.target.style.display = 'none'; }} />
          )}
        </div>

        {/* Review buttons or status */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {!answer.is_reviewed ? (
            <>
              <button
                onClick={e => handleReview(answer.id, true, e)}
                disabled={reviewingAnswers[answer.id]}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1.1rem', fontSize: '0.9rem', background: 'var(--color-green)', border: '2px solid var(--color-green-dim)', boxShadow: '3px 3px 0 var(--color-green-dim)', borderRadius: 10, color: '#fff' }}
              >
                <AcceptIcon /> {reviewingAnswers[answer.id] ? 'Processing…' : 'Accept ✓'}
              </button>
              <button
                onClick={e => handleReview(answer.id, false, e)}
                disabled={reviewingAnswers[answer.id]}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1.1rem', fontSize: '0.9rem', background: 'var(--color-red)', border: '2px solid #991a08', boxShadow: '3px 3px 0 #991a08', borderRadius: 10, color: '#fff' }}
              >
                <RejectIcon /> {reviewingAnswers[answer.id] ? 'Processing…' : 'Reject ✕'}
              </button>
            </>
          ) : (
            <div style={{ padding: '0.5rem 1rem', borderRadius: 10, background: statusBg, border: `2px solid ${statusColor}`, color: statusColor, fontWeight: 800, fontSize: '0.9rem' }}>
              {answer.is_accepted ? '✓ Accepted' : '✕ Rejected'}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAnswersPanel = () => (
    <div className="team-answers-col">
      {!selectedTeam ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 240, gap: 16, color: 'var(--color-green)', opacity: 0.6 }}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="28" stroke="var(--color-green)" strokeWidth="3" strokeDasharray="8 6" />
            <text x="30" y="38" textAnchor="middle" fontSize="24">🏴‍☠️</text>
          </svg>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', margin: 0 }}>Select a crew to view their answers</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--color-green)', margin: 0 }}>
              {selectedTeam.username}'s Submissions ({teamAnswers.length})
            </h2>
            {refreshing && (
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-brown)', animation: 'pulse 1.5s infinite' }}>
                ⚓ Refreshing answers…
              </span>
            )}
          </div>

          {error && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: 10, border: '2px solid var(--color-red)', background: '#ffebee', color: 'var(--color-red)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>
              ⚠ {error}
            </div>
          )}

          {loadingAnswers && teamAnswers.length === 0 ? (
            <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-brown)', textAlign: 'center', padding: '2rem', animation: 'pulse 1.5s infinite' }}>
              Loading answers…
            </div>
          ) : teamAnswers.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-bg-secondary)', borderRadius: 14, border: '2px dashed var(--color-green)', color: 'var(--color-green)', fontWeight: 700 }}>
              🗺 No answers submitted yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {teamAnswers.map(answer => renderAnswerCard(answer))}
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div>
      {/* Error banner (top-level) */}
      {error && !selectedTeam && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 10, border: '2px solid var(--color-red)', background: '#ffebee', color: 'var(--color-red)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>
          ⚠ {error}
        </div>
      )}

      <div className="team-panel-layout">
        {renderTeamList()}
        {renderAnswersPanel()}
      </div>
    </div>
  );
};

export default TeamPanel;