import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { History, Calendar, CheckCircle } from 'lucide-react';

export default function ScoreHistory({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid var(--border-divider)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '1rem 0', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          background: 'var(--accent)', color: 'white', padding: '0.45rem', 
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <History size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, letterSpacing: '-0.3px' }}>ประวัติการทำข้อสอบ</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.8125rem' }}>ดูคะแนนแบบละเอียดว่าคุณทำข้อสอบชุดไหนไปบ้าง</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', borderRadius: '12px' }}>
          <History size={36} style={{ opacity: 0.2, margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', margin: 0 }}>คุณยังไม่มีประวัติการทำข้อสอบ</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {history.map((item, index) => {
            const examName = item.exams?.name || item.exam_id || 'Unknown Exam';
            const category = item.exams?.category || 'General';
            
            // Format date if available
            let dateStr = 'ไม่ระบุเวลา';
            if (item.created_at) {
              const d = new Date(item.created_at);
              dateStr = d.toLocaleDateString('th-TH', { 
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              });
            }

            return (
              <div 
                key={index} 
                className="card"
                style={{ 
                  padding: '1.15rem 1rem', 
                  borderRadius: '10px', 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.35rem', lineHeight: 1.35, letterSpacing: '-0.2px' }}>{examName}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={13} /> 
                      {dateStr}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--surface-hover)', padding: '0.1rem 0.4rem', borderRadius: '4px', boxShadow: 'var(--shadow-border)' }}>
                      <CheckCircle size={11} style={{ color: 'var(--accent)' }} /> 
                      {category}
                    </span>
                  </div>
                </div>
                
                <div style={{ 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  color: 'var(--success)', 
                  padding: '0.4rem 0.75rem', 
                  borderRadius: '8px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.25rem',
                  boxShadow: '0 0 0 1px rgba(16, 185, 129, 0.2)',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{item.score}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>คะแนน</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
