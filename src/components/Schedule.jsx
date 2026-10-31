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
    date: "จันทร์ 2 พฤศจิกายน 2569",
    time: "09:30 - 12:30",
    courseCode: "06026211",
    title: "APPLIED MACHINE LEARNING",
    group: "กลุ่ม 12 ปฏิบัติ",
    type: "Final",
    location: "IT - Project Base4 ชั้น 3 - D4",
    progress: 98,
    timestamp: new Date("2026-11-02T09:30:00+07:00").getTime(),
  },
  {
    id: 7,
    year: 3,
    date: "จันทร์ 2 พฤศจิกายน 2569",
    time: "09:30 - 12:30",
    courseCode: "06026211",
    title: "APPLIED MACHINE LEARNING",
    group: "กลุ่ม 11 ทฤษฎี",
    type: "Final",
    location: "IT - Project Base4 ชั้น 3 - D4",
    progress: 98,
    timestamp: new Date("2026-11-02T09:30:00+07:00").getTime(),
  },
  {
    id: 8,
    year: 3,
    date: "พุธ 4 พฤศจิกายน 2569",
    time: "13:30 - 16:30",
    courseCode: "06026242",
    title: "CLOUD TECHNOLOGY INFRASTRUCTURE",
    group: "กลุ่ม 11 ทฤษฎี",
    type: "Final",
    location: "IT - L304 - B6",
    progress: 97,
    timestamp: new Date("2026-11-04T13:30:00+07:00").getTime(),
  },
  {
    id: 9,
    year: 3,
    date: "ศุกร์ 6 พฤศจิกายน 2569",
    time: "13:30 - 16:30",
    courseCode: "06026225",
    title: "DEEP LEARNING IN MEDICAL IMAGE AND VIDEO ANALYSIS",
    group: "กลุ่ม 11 ทฤษฎี",
    type: "Final",
    location: "IT - M 22 - B10",
    progress: 95,
    timestamp: new Date("2026-11-06T13:30:00+07:00").getTime(),
  },
  {
    id: 10,
    year: 3,
    date: "จันทร์ 9 พฤศจิกายน 2569",
    time: "09:30 - 12:30",
    courseCode: "06026240",
    title: "INTELLIGENT SYSTEM DEVELOPMENT",
    group: "กลุ่ม 12 ปฏิบัติ",
    type: "Final",
    location: "IT - M 22 - B5",
    progress: 94,
    timestamp: new Date("2026-11-09T09:30:00+07:00").getTime(),
  },
  {
    id: 11,
    year: 3,
    date: "จันทร์ 9 พฤศจิกายน 2569",
    time: "09:30 - 12:30",
    courseCode: "06026240",
    title: "INTELLIGENT SYSTEM DEVELOPMENT",
    group: "กลุ่ม 11 ทฤษฎี",
    type: "Final",
    location: "IT - M 22 - B5",
    progress: 94,
    timestamp: new Date("2026-11-09T09:30:00+07:00").getTime(),
  },
  {
    id: 12,
    year: 3,
    date: "พุธ 11 พฤศจิกายน 2569",
    time: "09:30 - 12:30",
    courseCode: "06026212",
    title: "DATA WAREHOUSING",
    group: "กลุ่ม 12 ปฏิบัติ",
    type: "Final",
    location: "IT - Project Base4 ชั้น 3 - E1",
    progress: 92,
    timestamp: new Date("2026-11-11T09:30:00+07:00").getTime(),
  },
  {
    id: 13,
    year: 3,
    date: "พุธ 11 พฤศจิกายน 2569",
    time: "09:30 - 12:30",
    courseCode: "06026212",
    title: "DATA WAREHOUSING",
    group: "กลุ่ม 11 ทฤษฎี",
    type: "Final",
    location: "IT - Project Base4 ชั้น 3 - E1",
    progress: 92,
    timestamp: new Date("2026-11-11T09:30:00+07:00").getTime(),
  }
];

const DAY_MS = 24 * 60 * 60 * 1000;
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;

function getDaysUntilExam(timestamp, now = Date.now()) {
  const examDay = Math.floor((timestamp + BANGKOK_OFFSET_MS) / DAY_MS);
  const currentDay = Math.floor((now + BANGKOK_OFFSET_MS) / DAY_MS);
  return examDay - currentDay;
}

export default function Schedule({ now = Date.now() }) {
  const [activeYear, setActiveYear] = useState(3);
  const [activeTerm, setActiveTerm] = useState('All');
  const currentTime = now;

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
            const daysUntilExam = getDaysUntilExam(item.timestamp, currentTime);
            
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
                        {item.progress && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
                            {item.progress}%
                          </span>
                        )}
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                          {item.date}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.35rem', lineHeight: 1.35, letterSpacing: '-0.2px' }}>
                        {item.courseCode && `${item.courseCode} `}{item.title}
                      </h3>
                      {item.group && (
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                          {item.group}
                        </div>
                      )}
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
                  {!isPast && daysUntilExam >= 0 && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-divider)', color: isNext ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 500 }}>
                      {daysUntilExam === 0
                        ? 'สอบวันนี้'
                        : `เหลืออีก ${daysUntilExam} วันก่อนถึงวันสอบวิชานี้`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
