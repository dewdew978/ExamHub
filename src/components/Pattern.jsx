import React from "react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts"
import { Star } from "lucide-react"

const defaultChartData = [
  { skill: "MIS", score: 0 },
  { skill: "Data Science", score: 0 },
  { skill: "Data Viz", score: 0 },
  { skill: "ISD", score: 0 },
  { skill: "DW", score: 0 },
  { skill: "Deep Learning", score: 0 },
]

export function Pattern({ data = defaultChartData, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      backdropFilter: 'blur(4px)',
      padding: '1rem'
    }} onClick={onClose}>
      <div 
        className="card animate-fade-in" 
        style={{ 
          width: '100%', 
          maxWidth: '360px', 
          padding: '1.25rem 1rem', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          borderRadius: '14px'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem', padding: '0.25rem' }}
        >
          ✕
        </button>
        <div style={{ textAlign: 'center', marginBottom: '1rem', marginTop: '0.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', margin: 0 }}>
            <Star size={18} color="var(--accent)" />
            Skill Assessment
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.2rem', margin: 0 }}>Team proficiency across key areas</p>
        </div>
        
        <div style={{ width: '100%', height: '260px', margin: '0 auto' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} margin={{ top: 10, right: 15, bottom: 10, left: 15 }}>
              <defs>
                <linearGradient id="chart24-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.08} />
                </linearGradient>
                <filter id="chart24-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <Tooltip 
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                itemStyle={{ color: 'var(--accent)', fontWeight: 600 }}
                labelStyle={{ color: 'var(--text)', fontWeight: 500, marginBottom: '0.25rem' }}
              />
              <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }} />
              <PolarGrid stroke="var(--border-color)" strokeDasharray="3 3" />
              <Radar
                name="Proficiency"
                dataKey="score"
                fill="url(#chart24-fill)"
                stroke="var(--accent)"
                strokeWidth={2}
                filter="url(#chart24-glow)"
                dot={{ r: 4, fill: "var(--accent)", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "var(--accent)", strokeWidth: 0 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
