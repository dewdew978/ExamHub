import React, { useState } from 'react';
import { Check, Clock, CalendarDays, MapPin } from 'lucide-react';

const examSchedule = [
  {
    id: 1,
    year: 3,
    date: "17 สิงหาคม 2569",
    time: "09:30 - 12:30",
    title: "INTELLIGENT SYSTEM DEVELOPMENT",
    type: "Midterm",
    location: "IT - M 23 - A2",
    timestamp: new Date("2026-08-17T09:30:00").getTime(),
  },
  {
    id: 2,
    year: 3,
    date: "18 สิงหาคม 2569",
    time: "13:30 - 16:30",
    title: "APPLIED MACHINE LEARNING",
    type: "Midterm",
    location: "IT - M 23 - C9",
    timestamp: new Date("2026-08-18T13:30:00").getTime(),
  },
  {
    id: 3,
    year: 3,
    date: "19 สิงหาคม 2569",
    time: "13:30 - 16:30",
    title: "CLOUD TECHNOLOGY INFRASTRUCTURE",
    type: "Midterm",
    location: "IT - L304 - B6",
    timestamp: new Date("2026-08-19T13:30:00").getTime(),
  },
  {
    id: 4,
    year: 3,
    date: "20 สิงหาคม 2569",
    time: "09:30 - 12:30",
    title: "DATA WAREHOUSING",
    type: "Midterm",
    location: "IT - Project Base4 ชั้น 3 - E1",
    timestamp: new Date("2026-08-20T09:30:00").getTime(),
  },
  {
    id: 5,
    year: 3,
    date: "21 สิงหาคม 2569",
    time: "13:30 - 16:30",
    title: "DEEP LEARNING IN MEDICAL IMAGE AND VIDEO ANALYSIS",
    type: "Midterm",
    location: "IT - M 03 - C1",
    timestamp: new Date("2026-08-21T13:30:00").getTime(),
  },
  {
    id: 6,
    year: 3,
    date: "26 ตุลาคม 2569",
    time: "09:30 - 12:30",
    title: "APPLIED MACHINE LEARNING",
    type: "Final",
    location: "-",
    timestamp: new Date("2026-10-26T09:30:00").getTime(),
  },
  {
    id: 7,
    year: 3,
    date: "28 ตุลาคม 2569",
    time: "13:30 - 16:30",
    title: "CLOUD TECHNOLOGY INFRASTRUCTURE",
    type: "Final",
    location: "-",
    timestamp: new Date("2026-10-28T13:30:00").getTime(),
  },
  {
    id: 8,
    year: 3,
    date: "30 ตุลาคม 2569",
    time: "13:30 - 16:30",
    title: "DEEP LEARNING IN MEDICAL IMAGE AND VIDEO ANALYSIS",
    type: "Final",
    location: "-",
    timestamp: new Date("2026-10-30T13:30:00").getTime(),
  },
  {
    id: 9,
    year: 3,
    date: "2 พฤศจิกายน 2569",
    time: "09:30 - 12:30",
    title: "INTELLIGENT SYSTEM DEVELOPMENT",
    type: "Final",
    location: "-",
    timestamp: new Date("2026-11-02T09:30:00").getTime(),
  },
  {
    id: 10,
    year: 3,
    date: "4 พฤศจิกายน 2569",
    time: "09:30 - 12:30",
    title: "DATA WAREHOUSING",
    type: "Final",
    location: "-",
    timestamp: new Date("2026-11-04T09:30:00").getTime(),
  },
  {
    id: 11,
    year: 3,
    date: "จัดสอบเอง",
    time: "-",
    title: "INVESTMENT PLANNING",
    type: "Final",
    location: "-",
    timestamp: new Date("2026-11-10T00:00:00").getTime(),
  },
  {
    id: 12,
    year: 3,
    date: "จัดสอบเอง",
    time: "-",
    title: "PROFESSIONAL COMMUNICATION AND PRESENTATION",
    type: "Final",
    location: "-",
    timestamp: new Date("2026-11-10T00:00:00").getTime(),
  }
];

export default function Schedule() {
  const [activeYear, setActiveYear] = useState(3);
  const [activeTerm, setActiveTerm] = useState('All');
  const currentTime = Date.now();

  const filteredSchedule = examSchedule.filter(item => {
    const matchYear = item.year === activeYear;
    const matchTerm = activeTerm === 'All' || item.type === activeTerm;
    return matchYear && matchTerm;
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarDays size={24} color="var(--accent)" />
          ตารางสอบ (Exam Schedule)
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>กำหนดการสอบ Midterm และ Final ประจำภาคการศึกษา</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button 
          className={`btn ${activeYear === 3 ? 'btn-primary' : 'btn-outline'}`} 
          onClick={() => setActiveYear(3)}
          style={{ flex: 1 }}
        >
          ปี 3
        </button>
        <button 
          className={`btn ${activeYear === 4 ? 'btn-primary' : 'btn-outline'}`} 
          onClick={() => setActiveYear(4)}
          style={{ flex: 1 }}
        >
          ปี 4
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
        <button 
          className={`btn ${activeTerm === 'All' ? 'btn-primary' : 'btn-outline'}`} 
          onClick={() => setActiveTerm('All')}
          style={{ flex: 1, padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
        >
          ทั้งหมด
        </button>
        <button 
          className={`btn ${activeTerm === 'Midterm' ? 'btn-primary' : 'btn-outline'}`} 
          onClick={() => setActiveTerm('Midterm')}
          style={{ flex: 1, padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
        >
          Midterm
        </button>
        <button 
          className={`btn ${activeTerm === 'Final' ? 'btn-primary' : 'btn-outline'}`} 
          onClick={() => setActiveTerm('Final')}
          style={{ flex: 1, padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
        >
          Final
        </button>
      </div>

      {filteredSchedule.length === 0 ? (
        <div className="card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CalendarDays size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.2 }} />
          <p style={{ fontSize: '1rem', fontWeight: 500 }}>ยังไม่มีกำหนดการสอบ</p>
          <p style={{ fontSize: '0.8125rem', marginTop: '0.35rem' }}>เตรียมพบกับตารางสอบเร็วๆ นี้</p>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute',
            left: '0.625rem',
            top: '0.75rem',
            bottom: '0.75rem',
            width: '2px',
            background: 'var(--border-divider)',
            zIndex: 0
          }} />

          {filteredSchedule.map((item, index) => {
            const isPast = item.timestamp < currentTime;
            const isNext = !isPast && (index === 0 || filteredSchedule[index - 1].timestamp < currentTime);
            
            let indicatorBg = 'var(--surface)';
            let indicatorBorder = '2px solid var(--border-divider)';
            
            if (isPast) {
              indicatorBg = 'var(--accent)';
              indicatorBorder = '2px solid var(--accent)';
            } else if (isNext) {
              indicatorBg = 'var(--surface)';
              indicatorBorder = '2px solid var(--accent)';
            }

            return (
              <div key={item.id} style={{ position: 'relative', marginBottom: '1.25rem' }}>
                {/* Indicator */}
                <div style={{
                  position: 'absolute',
                  left: '-2rem',
                  top: '0.25rem',
                  width: '1.25rem',
                  height: '1.25rem',
                  borderRadius: '50%',
                  background: indicatorBg,
                  border: indicatorBorder,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  boxShadow: isNext ? '0 0 0 3px rgba(0, 112, 243, 0.15)' : 'none'
                }}>
                  {isPast && <Check size={10} color="#fff" strokeWidth={3} />}
                  {isNext && <div style={{ width: '0.4rem', height: '0.4rem', borderRadius: '50%', background: 'var(--accent)' }} />}
                </div>

                {/* Content Card */}
                <div className="card" style={{ 
                  padding: '1.15rem 1rem', 
                  borderLeft: isNext ? '3px solid var(--accent)' : 'none',
                  opacity: isPast ? 0.8 : 1,
                  borderRadius: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 600, 
                          padding: '0.15rem 0.4rem', 
                          borderRadius: '4px',
                          background: item.type === 'Midterm' ? 'rgba(245, 166, 35, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: item.type === 'Midterm' ? 'var(--warning)' : 'var(--success)',
                          textTransform: 'uppercase'
                        }}>
                          {item.type}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                          {item.date}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.35rem', lineHeight: 1.35, letterSpacing: '-0.2px' }}>
                        {item.title}
                      </h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                        <Clock size={14} />
                        {item.time}
                      </div>
                      {item.location !== "-" && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                          <MapPin size={14} />
                          {item.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
