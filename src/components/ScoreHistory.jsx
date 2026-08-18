import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { History, Award, Calendar, CheckCircle } from 'lucide-react';

export default function ScoreHistory({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
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
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ 
          background: 'var(--accent)', color: 'white', padding: '0.5rem', 
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <History size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>ประวัติการทำข้อสอบ</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>ดูคะแนนแบบละเอียดว่าคุณทำข้อสอบชุดไหนไปบ้าง</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <History size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>คุณยังไม่มีประวัติการทำข้อสอบ</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((item, index) => {
            const examName = item.exams?.name || item.exam_id || 'Unknown Exam';
            const category = item.exams?.category || 'General';
            const totalQ = item.exams?.questionCount;
            
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
              <div key={index} style={{ 
                background: 'var(--card)', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s',
              }}
              className="history-card"
              >
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.4 }}>{examName}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Calendar size={14} /> 
                      {dateStr}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'var(--bg)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                      <CheckCircle size={12} style={{ color: 'var(--accent)' }} /> 
                      {category}
                    </span>
                  </div>
                </div>
                
                <div style={{ 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  color: '#10b981', 
                  padding: '0.75rem 1.25rem', 
                  borderRadius: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.25rem',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{item.score}</span>
                  <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>คะแนน</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
