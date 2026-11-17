import { useState } from 'react';
import { Check, Clock, CalendarDays, MapPin, Users, Hourglass } from 'lucide-react';

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

  const upcoming = filteredSchedule.filter(item => item.timestamp >= currentTime);
  const nextExam = upcoming[0];
  const nextDays = nextExam ? getDaysUntilExam(nextExam.timestamp, currentTime) : null;
  const doneCount = filteredSchedule.length - upcoming.length;

  // Group rows by exam day so parallel groups (ทฤษฎี / ปฏิบัติ) sit together.
  const groups = [];
  for (const item of filteredSchedule) {
    const last = groups[groups.length - 1];
    if (last && last.date === item.date) last.items.push(item);
    else groups.push({ date: item.date, timestamp: item.timestamp, items: [item] });
  }

  return (
    <div className="page animate-fade-in" style={{ maxWidth: 960 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">ตารางสอบ</h1>
          <p className="page-subtitle">กำหนดการสอบ Midterm และ Final ประจำภาคการศึกษา</p>
        </div>
      </div>

      <div className="toolbar">
        <div className="seg" role="group" aria-label="ชั้นปี">
          {[3, 4].map(y => (
            <button key={y} type="button" className={`seg-item${activeYear === y ? ' active' : ''}`} onClick={() => setActiveYear(y)}>ปี {y}</button>
          ))}
        </div>
        {['All', 'Midterm', 'Final'].map(t => (
          <button key={t} type="button" className={`chip${activeTerm === t ? ' active' : ''}`} onClick={() => setActiveTerm(t)}>
            {t === 'All' ? 'ทั้งหมด' : t}
          </button>
        ))}
        <div className="spacer" />
        {filteredSchedule.length > 0 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>สอบแล้ว {doneCount}/{filteredSchedule.length} วิชา</span>
        )}
      </div>

      {filteredSchedule.length === 0 ? (
        <div className="empty-state">
          <span className="tile"><CalendarDays size={18} /></span>
          <h3>ยังไม่มีกำหนดการสอบ</h3>
          <p>เตรียมพบกับตารางสอบเร็วๆ นี้</p>
        </div>
      ) : (
        <>
          {nextExam && (
            <div className="card" style={{ padding: '1rem 1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', boxShadow: '0 0 0 1px var(--accent-soft), var(--shadow-xs)', background: 'var(--accent-softer)' }}>
              <span className="tile tile-accent" style={{ width: 40, height: 40 }}><Hourglass size={18} /></span>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-text)', fontWeight: 500 }}>สอบถัดไป</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: 2 }}>{nextExam.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{nextExam.time} · {nextExam.location}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 600, lineHeight: 1, letterSpacing: '-0.02em' }}>{nextDays === 0 ? 'วันนี้' : nextDays}</div>
                {nextDays !== 0 && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>วันก่อนสอบ</div>}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {groups.map(group => {
              const isPastDay = group.items.every(i => i.timestamp < currentTime);
              return (
                <section key={`${group.date}-${group.timestamp}`}>
                  <div className="section-title" style={{ color: isPastDay ? 'var(--text-muted)' : 'var(--text)' }}>
                    <CalendarDays size={14} /> {group.date}
                    {isPastDay && <span className="badge" style={{ marginLeft: 4 }}><Check size={10} /> สอบแล้ว</span>}
                  </div>
                  <div className="ds-table-wrap">
                    {group.items.map((item, idx) => {
                      const isPast = item.timestamp < currentTime;
                      const isNext = nextExam && item.timestamp === nextExam.timestamp;
                      const daysUntilExam = getDaysUntilExam(item.timestamp, currentTime);
                      return (
                        <div key={item.id} style={{
                          display: 'flex', alignItems: 'flex-start', gap: '0.9rem', padding: '0.85rem 1rem', flexWrap: 'wrap',
                          borderTop: idx ? '1px solid var(--border-divider)' : 'none',
                          opacity: isPast ? 0.65 : 1,
                        }}>
                          <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: 4, flexWrap: 'wrap' }}>
                              <span className={`badge ${item.type === 'Midterm' ? 'badge-warning' : 'badge-success'}`}>{item.type}</span>
                              {item.progress && (
                                <span className="badge badge-accent" title="ความพร้อมของคลังข้อสอบวิชานี้">{item.progress}%</span>
                              )}
                              {item.courseCode && <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>{item.courseCode}</span>}
                            </div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.4 }}>{item.title}</div>
                            {item.group && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <Users size={12} /> {item.group}
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.78rem', color: 'var(--text-muted)', minWidth: 190 }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Clock size={13} /> {item.time}</span>
                            {item.location !== "-" && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><MapPin size={13} /> {item.location}</span>}
                          </div>
                          <div style={{ minWidth: 150, textAlign: 'right', fontSize: '0.75rem', alignSelf: 'center' }}>
                            {isPast
                              ? <span style={{ color: 'var(--text-subtle)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Check size={12} /> เสร็จสิ้น</span>
                              : daysUntilExam >= 0 && (
                                <span style={{ color: isNext ? 'var(--accent-text)' : 'var(--text-muted)', fontWeight: isNext ? 500 : 400 }}>
                                  {daysUntilExam === 0
                                    ? 'สอบวันนี้'
                                    : `เหลืออีก ${daysUntilExam} วันก่อนถึงวันสอบวิชานี้`}
                                </span>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
