import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts"
import { Radar as RadarIcon, X } from "lucide-react"

const defaultChartData = [
  { skill: "MIS", score: 0 },
  { skill: "Data Science", score: 0 },
  { skill: "Data Viz", score: 0 },
  { skill: "ISD", score: 0 },
  { skill: "DW", score: 0 },
  { skill: "Deep Learning", score: 0 },
]

// Skill radar: accumulated score per subject category.
export function Pattern({ data = defaultChartData, onClose }) {
  const top = [...data].sort((a, b) => b.score - a.score).slice(0, 3).filter(d => d.score > 0)
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()} role="dialog" aria-label="คะแนนสะสมและทักษะ">
        <div className="modal-header">
          <span className="tile tile-accent"><RadarIcon size={16} /></span>
          <div style={{ flex: 1 }}>
            <div className="modal-title">คะแนนสะสม & ทักษะ</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>ภาพรวมความถนัดแยกตามหมวดวิชา</div>
          </div>
          <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={onClose} aria-label="ปิด"><X size={16} /></button>
        </div>

        <div style={{ width: '100%', height: 280, padding: '0 0.5rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} margin={{ top: 16, right: 28, bottom: 8, left: 28 }}>
              <Tooltip
                contentStyle={{ background: 'var(--surface)', border: 'none', borderRadius: 8, boxShadow: 'var(--shadow-popover)', fontSize: 12 }}
                itemStyle={{ color: 'var(--accent)', fontWeight: 600 }}
                labelStyle={{ color: 'var(--text)', fontWeight: 500 }}
              />
              <PolarGrid stroke="var(--border-color)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }} />
              <Radar
                name="คะแนน"
                dataKey="score"
                fill="var(--accent)"
                fillOpacity={0.18}
                stroke="var(--accent)"
                strokeWidth={1.75}
                dot={{ r: 3, fill: "var(--accent)", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "var(--accent)", strokeWidth: 0 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'flex-start', flexWrap: 'wrap', gap: '0.4rem' }}>
          {top.length === 0
            ? <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>ทำข้อสอบให้ครบชุดเพื่อเริ่มสะสมคะแนน</span>
            : <>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: 4 }}>ถนัดที่สุด</span>
                {top.map(d => <span key={d.skill} className="badge badge-accent">{d.skill}</span>)}
              </>}
        </div>
      </div>
    </div>
  )
}
