import { useState, useEffect, useRef } from 'react';
import { getTeamResults } from '../../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/* ── Medal SVG ────────────────────────────────────────────── */
const MedalSVG = ({ rank }) => {
  const colors = { 1: ['#ffd700', '#b8860b'], 2: ['#c0c0c0', '#808080'], 3: ['#cd7f32', '#8b5a2b'] };
  const [fill, stroke] = colors[rank] || ['#d4e7a0', '#256130'];
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ verticalAlign: 'middle' }}>
      <circle cx="11" cy="14" r="8" fill={fill} stroke={stroke} strokeWidth="2" />
      <text x="11" y="18" textAnchor="middle" fontSize="8" fill={stroke} fontWeight="bold">{rank}</text>
      <line x1="8" y1="7" x2="6" y2="1" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="7" x2="16" y2="1" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="1" x2="16" y2="1" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

const ResultPanel = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    fetchResults();
    pollingIntervalRef.current = setInterval(() => refreshData(), 15000);
    return () => { if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current); };
  }, []);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchResults(false);
    setRefreshing(false);
  };

  const fetchResults = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      const response = await getTeamResults();
      if (response.success) {
        const sorted = [...response.results].sort((a, b) => {
          if (b.total_points !== a.total_points) return b.total_points - a.total_points;
          return (a.total_time || Number.MAX_VALUE) - (b.total_time || Number.MAX_VALUE);
        });
        setResults(sorted);
        setLastUpdated(new Date());
      } else {
        setError(response.message);
      }
    } catch {
      setError('Failed to fetch results');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Treasure Hunt Results', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    autoTable(doc, {
      startY: 35,
      head: [['Rank', 'Team', 'Total Points', 'Questions Solved', 'Total Time', 'Last Submission']],
      body: results.map((r, i) => [
        i + 1, r.username, r.total_points,
        `${r.normal_solved} + ${r.bonus_solved} bonus`,
        formatTime(r.total_time), r.last_submission_time || 'N/A',
      ]),
      theme: 'striped',
      headStyles: { fillColor: [37, 97, 48], textColor: 255 },
      styles: { fontSize: 10 },
    });
    doc.save('treasure_hunt_results.pdf');
  };

  if (loading && !refreshing) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--color-green)', animation: 'pulse 1.5s infinite' }}>
          🏆 Loading Leaderboard…
        </span>
      </div>
    );
  }

  const rowBg = (i) => {
    if (i === 0) return '#fff9e6';
    if (i === 1) return '#f8f8f8';
    if (i === 2) return '#fdf5ef';
    return i % 2 === 0 ? '#fff' : 'var(--color-bg-primary)';
  };

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.8rem' }}>🏆</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-green)', margin: 0 }}>Leaderboard</h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          {lastUpdated && (
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-brown)', fontFamily: 'var(--font-body)' }}>
              🕐 {lastUpdated.toLocaleTimeString()}
            </span>
          )}

          <button
            onClick={exportToPDF}
            disabled={results.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', fontSize: '0.88rem', background: 'var(--color-green)', border: '2px solid var(--color-green-dim)', boxShadow: '3px 3px 0 var(--color-green-dim)', borderRadius: 10 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Download PDF
          </button>

          <button
            onClick={refreshData}
            disabled={refreshing}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', fontSize: '0.88rem', background: 'var(--color-blue)', border: '2px solid #4a9ab8', boxShadow: '3px 3px 0 #4a9ab8', borderRadius: 10, color: '#fff' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" className={refreshing ? 'animate-spin' : ''}>
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 10, border: '2px solid var(--color-red)', background: '#ffebee', color: 'var(--color-red)', fontWeight: 700, marginBottom: '1rem' }}>
          ⚠ {error}
        </div>
      )}

      {results.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-bg-secondary)', borderRadius: 14, border: '2px dashed var(--color-green)', color: 'var(--color-green)', fontWeight: 700, fontSize: '1.1rem' }}>
          🗺 No results yet — teams need approved answers to appear here.
        </div>
      ) : (
        <div className="results-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fff', borderRadius: 14, overflow: 'hidden', border: '3px solid var(--color-green)', minWidth: 520 }}>
            <thead>
              <tr style={{ background: 'var(--color-green)', color: '#fff' }}>
                {['Rank', 'Team', 'Points', 'Questions', 'Time', 'Last Submission'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontFamily: 'var(--font-heading)', fontSize: '0.85rem', letterSpacing: 1, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={r.username} style={{ background: rowBg(i), borderBottom: '1px solid var(--color-bg-secondary)' }}>
                  <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MedalSVG rank={i + 1} />
                      {i === 0 && <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b8860b', marginLeft: 2 }}>WINNER</span>}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: i < 3 ? 800 : 600, color: 'var(--color-green-dim)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.username}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--color-brown)' }}>{r.total_points}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-green-dim)', fontSize: '0.9rem' }}>
                    {r.normal_solved} + <span style={{ color: '#c17900' }}>{r.bonus_solved}★</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-green-dim)', fontSize: '0.9rem' }}>{formatTime(r.total_time)}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--color-brown)', fontFamily: 'var(--font-mono)' }}>
                    {r.last_submission_time || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {refreshing && (
        <div style={{ textAlign: 'center', color: 'var(--color-brown)', fontWeight: 700, marginTop: '0.75rem', fontSize: '0.85rem' }}>
          ⚓ Refreshing…
        </div>
      )}
    </div>
  );
};

export default ResultPanel;