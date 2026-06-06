import React, { useState, useEffect } from 'react'
import { supabase, GRADES, getGrade, scoreFromChecked } from '../lib/supabase.js'

export default function HistoryPage({ session }) {
  const [scores, setScores]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('scores').select('date, checked, total_score')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false }).limit(60)
    if (data) setScores(data)
    setLoading(false)
  }

  const streak = calcStreak(scores)
  const best   = scores.length ? Math.max(...scores.map(s => s.total_score || 0)) : 0
  const avg    = scores.length ? Math.round(scores.reduce((a, s) => a + (s.total_score || 0), 0) / scores.length) : 0

  return (
    <div>
      <div className="top-bar">
        <h1>History</h1>
        <div className="subtitle">Your SANE journey</div>
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '16px 16px 0' }}>
        <StatCard label="Streak"    value={`${streak}d`} color="var(--gold)" />
        <StatCard label="Avg Score" value={avg}          color="var(--sleep)" />
        <StatCard label="Best"      value={best}         color="var(--nutrition)" />
        <StatCard label="Logged"    value={scores.length} color="var(--muted)" />
      </div>
      <div style={{ padding: '16px' }}>
        <div className="history-title" style={{ marginBottom: 12 }}>All entries</div>
        {loading && <div style={{ color: 'var(--muted)', fontSize: 14, padding: '20px 0' }}>Loading...</div>}
        {!loading && scores.length === 0 && (
          <div style={{ color: 'var(--muted)', fontSize: 14, padding: '20px 0' }}>No scores yet. Start today.</div>
        )}
        {scores.map(s => {
          const pts   = s.total_score || scoreFromChecked(s.checked || {})
          const grade = getGrade(pts)
          const d     = new Date(s.date + 'T12:00:00')
          const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
          return (
            <div key={s.date} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px', marginBottom: 8,
              background: 'var(--card)', borderRadius: 10,
              border: '1px solid var(--border)',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: grade.color + '22',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 22, color: grade.color, flexShrink: 0,
              }}>{pts}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
                <div style={{
                  fontSize: 11, color: grade.color,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: 1, textTransform: 'uppercase', marginTop: 2,
                }}>{grade.label}</div>
              </div>
              <MiniBar checked={s.checked || {}} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="dash-stat" style={{ flex: 1, padding: '12px 10px' }}>
      <div className="dash-stat-label" style={{ fontSize: 10 }}>{label}</div>
      <div className="dash-stat-value" style={{ color, fontSize: 24 }}>{value}</div>
    </div>
  )
}

function MiniBar({ checked }) {
  const pts = { s1:4,s2:3,s3:2,s4:1, a1:4,a2:3,a3:2,a4:1, n1:4,n2:3,n3:2,n4:1 }
  const pillars = [
    { ids: ['s1','s2','s3','s4'], color: 'var(--sleep)'     },
    { ids: ['a1','a2','a3','a4'], color: 'var(--activity)'  },
    { ids: ['n1','n2','n3','n4'], color: 'var(--nutrition)' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: 50 }}>
      {pillars.map((p, i) => {
        const score = p.ids.reduce((sum, id) => sum + (checked[id] ? (pts[id] || 0) : 0), 0)
        return (
          <div key={i} style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${score / 10 * 100}%`, height: '100%', background: p.color, borderRadius: 2 }} />
          </div>
        )
      })}
    </div>
  )
}

function calcStreak(scores) {
  if (!scores.length) return 0
  const sorted   = [...scores].sort((a, b) => b.date.localeCompare(a.date))
  const today    = new Date().toISOString().slice(0, 10)
  let streak = 0, expected = today
  for (const s of sorted) {
    if (s.date === expected) {
      streak++
      const d = new Date(expected + 'T12:00:00')
      d.setDate(d.getDate() - 1)
      expected = d.toISOString().slice(0, 10)
    } else break
  }
  return streak
}
