import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { History, Trophy, Target, ListChecks, Search } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import SubjectIcon from './SubjectIcon';

export default function ScoreHistory({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  const fetchHistory = useCallback(async () => {
    try {
      // ดึงข้อมูลคะแนนพร้อมกับข้อมูลข้อสอบที่เชื่อมโยงกัน
      const { data, error } = await supabase
        .from('user_scores')
        .select(`
          score, 
          created_at, 
          exam_id, 
          exams (name, category, questionCount)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        // หากไม่มีคอลัมน์ created_at อาจเกิด error ได้ ให้ลองดึงแบบไม่มี created_at ดู
        console.warn("Could not fetch with created_at, falling back...", error);
        const { data: fallbackData } = await supabase
          .from('user_scores')
          .select(`
            score, 
            exam_id, 
            exams (name, category, questionCount)
          `)
          .eq('user_id', user.id);
        
        setHistory(fallbackData || []);
      } else {
        setHistory(data || []);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, fetchHistory]);

  const rows = history.map((item, i) => {
    const total = item.exams?.questionCount || null;
    const pct = total ? Math.round((item.score / total) * 100) : null;
    return { ...item, key: `${item.exam_id}-${item.created_at || i}`, total, pct, name: item.exams?.name || item.exam_id, category: item.exams?.category || 'ทั่วไป' };
  });
  const categories = [...new Set(rows.map(r => r.category))];
  const q = query.trim().toLowerCase();
  const visible = rows.filter(r => (category === 'all' || r.category === category) && (!q || r.name.toLowerCase().includes(q)));
  const withPct = rows.filter(r => r.pct !== null);
  const avg = withPct.length ? Math.round(withPct.reduce((s, r) => s + r.pct, 0) / withPct.length) : null;
  const best = withPct.length ? Math.max(...withPct.map(r => r.pct)) : null;
  const totalScore = rows.reduce((s, r) => s + (r.score || 0), 0);
  const chartData = [...withPct].reverse().slice(-14).map((r, i) => ({ i: i + 1, name: r.name, pct: r.pct }));

  const formatDate = (value) => value
    ? new Date(value).toLocaleString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })
    : '—';

  const pctTone = (pct) => pct === null ? '' : pct >= 80 ? 'badge-success' : pct >= 50 ? 'badge-info' : 'badge-error';

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">ประวัติคะแนน</h1>
          <p className="page-subtitle">ผลการทำข้อสอบทุกครั้งของคุณ เรียงจากล่าสุด</p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state" style={{ padding: '4rem 1rem' }}>
          <div className="progress" style={{ width: 120, margin: '0 auto' }}><span style={{ width: '40%' }} /></div>
        </div>
      ) : rows.length === 0 ? (
        <div className="empty-state">
          <span className="tile"><History size={18} /></span>
          <h3>ยังไม่มีประวัติการทำข้อสอบ</h3>
          <p>ทำข้อสอบชุดแรกให้จบเพื่อเริ่มติดตามพัฒนาการของคุณ</p>
        </div>
      ) : (
        <>
          <div className="stat-grid" style={{ marginBottom: '1rem' }}>
            <div className="stat"><div className="stat-label"><ListChecks size={13} /> จำนวนครั้งที่สอบ</div><div className="stat-value">{rows.length}</div></div>
            <div className="stat"><div className="stat-label"><Target size={13} /> ค่าเฉลี่ย</div><div className="stat-value">{avg ?? '—'}{avg !== null && <span style={{ fontSize: '0.9rem', color: 'var(--text-subtle)' }}>%</span>}</div></div>
            <div className="stat"><div className="stat-label"><Trophy size={13} /> ดีที่สุด</div><div className="stat-value">{best ?? '—'}{best !== null && <span style={{ fontSize: '0.9rem', color: 'var(--text-subtle)' }}>%</span>}</div></div>
            <div className="stat"><div className="stat-label"><History size={13} /> คะแนนสะสม</div><div className="stat-value">{totalScore.toLocaleString()}</div></div>
          </div>

          {chartData.length > 1 && (
            <div className="card" style={{ padding: '1rem 1rem 0.5rem', marginBottom: '1.25rem' }}>
              <div className="section-title">เปอร์เซ็นต์ล่าสุด <span className="muted">· {chartData.length} ครั้งหลังสุด</span></div>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                    <CartesianGrid vertical={false} stroke="var(--border-divider)" />
                    <XAxis dataKey="i" tick={{ fill: 'var(--text-subtle)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} ticks={[0, 50, 100]} tick={{ fill: 'var(--text-subtle)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: 'var(--surface-hover)' }}
                      contentStyle={{ background: 'var(--surface)', border: 'none', borderRadius: 8, boxShadow: 'var(--shadow-popover)', fontSize: 12 }}
                      labelFormatter={(_, p) => p?.[0]?.payload?.name || ''}
                      formatter={(v) => [`${v}%`, 'คะแนน']}
                    />
                    <Bar dataKey="pct" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="toolbar">
            <div className="search" style={{ width: 240, maxWidth: '100%' }}>
              <Search size={14} />
              <input className="input" value={query} onChange={e => setQuery(e.target.value)} placeholder="ค้นหาชุดข้อสอบ…" aria-label="ค้นหาประวัติ" />
            </div>
            <button type="button" className={`chip${category === 'all' ? ' active' : ''}`} onClick={() => setCategory('all')}>ทุกหมวด</button>
            {categories.map(c => (
              <button key={c} type="button" className={`chip${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>

          <div className="ds-table-wrap">
            <div className="ds-table-scroll">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>ชุดข้อสอบ</th>
                    <th>หมวดวิชา</th>
                    <th>วันที่ทำ</th>
                    <th style={{ textAlign: 'right' }}>คะแนน</th>
                    <th style={{ textAlign: 'right' }}>ผลลัพธ์</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map(r => (
                    <tr key={r.key}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 200 }}>
                          <span className="tile" style={{ width: 26, height: 26 }}><SubjectIcon category={r.category} size={13} color="var(--text-muted)" /></span>
                          <span style={{ fontWeight: 500 }}>{r.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{r.category}</td>
                      <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatDate(r.created_at)}</td>
                      <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                        <strong style={{ fontWeight: 600 }}>{r.score}</strong>{r.total && <span style={{ color: 'var(--text-subtle)' }}>/{r.total}</span>}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {r.pct !== null
                          ? <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div className="progress hide-sm" style={{ width: 64, height: 4 }}><span style={{ width: `${r.pct}%`, background: r.pct >= 80 ? 'var(--success)' : r.pct >= 50 ? 'var(--info)' : 'var(--error)' }} /></div>
                              <span className={`badge ${pctTone(r.pct)}`}>{r.pct}%</span>
                            </div>
                          : <span style={{ color: 'var(--text-subtle)' }}>—</span>}
                      </td>
                    </tr>
                  ))}
                  {visible.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>ไม่พบรายการที่ตรงกับตัวกรอง</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
