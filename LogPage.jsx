import React, { useState, useEffect, useRef } from 'react'
import { supabase, PILLARS, getGrade, scoreFromChecked, pillarScore, todayKey, debounce } from '../lib/supabase.js'

export default function LogPage({ session }) {
  const [checked, setChecked]   = useState({})
  const [open, setOpen]         = useState({ sleep: true, activity: true, nutrition: true, eval: true })
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [history, setHistory]   = useState([])
  const userId = session.user.id
  const today  = todayKey()

  useEffect(() => {
    loadToday()
    loadHistory()
  }, [])

  async function loadToday() {
    const { data } = await supabase
      .from('scores').select('checked')
      .eq('user_id', userId).eq('date', today).single()
    if (data?.checked) setChecked(data.checked)
  }

  async function loadHistory() {
    const { data } = await supabase
      .from('scores').select('date, checked')
      .eq('user_id', userId).order('date', { ascending: false }).limit(7)
    if (data) setHistory(data)
  }

  const saveRef = useRef(debounce(async (newChecked) => {
    setSaving(true)
    const total = scoreFromChecked(newChecked)
    await supabase.from('scores').upsert({
      user_id: userId, date: today, checked: newChecked,
      total_score: total,
      sleep_score:     pillarScore('sleep',     newChecked),
      activity_score:  pillarScore('activity',  newChecked),
      nutrition_score: pillarScore('nutrition', newChecked),
    }, { onConflict: 'user_id,date' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, 800))

  function toggle(itemId) {
    const next = { ...checked, [itemId]: !checked[itemId] }
    setChecked(next)
    saveRef.current(next)
  }

  const total  = scoreFromChecked(checked)
  const grade  = getGrade(total)
  const circ   = 238.76
  const offset = circ - (circ * total / 30)
  const last7  = getLast7(history, today)

  return (
    <div>
      <div className="top-bar">
        <h1>SANE SCORE</h1>
        <div className="subtitle">{formatDate(today)}</div>
      </div>

      <div className="score-ring-wrap">
        <div className="ring-container">
          <svg viewBox="0 0 88 88">
            <circle className="ring-bg" cx="44" cy="44" r="38" />
            <circle className="ring-fill" cx="44" cy="44" r="38"
              stroke={grade.color} strokeDasharray={circ} strokeDashoffset={offset} />
          </svg>
          <div className="ring-label">
            <span className="ring-num">{total}</span>
            <span className="ring-denom">/30</span>
          </div>
        </div>
        <div className="pillar-bars">
          {[
            { id: 'sleep',     label: 'Sleep',    color: 'var(--sleep)',     max: 10 },
            { id: 'activity',  label: 'Activity', color: 'var(--activity)',  max: 10 },
            { id: 'nutrition', label: 'Nutrition',color: 'var(--nutrition)', max: 10 },
            { id: 'eval',      label: 'Eval',     color: 'var(--eval)',      max: 4  },
          ].map(p => {
            const pts = p.id === 'eval'
              ? PILLARS.find(x => x.id === 'eval').items.filter(i => checked[i.id]).length
              : pillarScore(p.id, checked)
            return (
              <div className="pillar-row" key={p.id}>
                <div className="pillar-label" style={{ color: p.color }}>{p.label}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ background: p.color, width: `${pts / p.max * 100}%` }} />
                </div>
                <div className="pillar-pts" style={{ color: p.color }}>{pts}/{p.max}</div>
              </div>
            )
          })}
        </div>
      </div>

      {PILLARS.map(pillar => {
        const isOpen = open[pillar.id]
        const pts = pillar.id === 'eval'
          ? pillar.items.filter(i => checked[i.id]).length
          : pillarScore(pillar.id, checked)
        const max = pillar.id === 'eval' ? 4 : 10
        return (
          <div key={pillar.id}>
            <div className="section-header"
              onClick={() => setOpen(o => ({ ...o, [pillar.id]: !o[pillar.id] }))}>
              <div className="section-dot" style={{ background: pillar.color }} />
              <div className="section-title" style={{ color: pillar.color }}>{pillar.label}</div>
              <div className="section-score" style={{ color: pillar.color }}>{pts}/{max}</div>
              <div className={`section-chevron ${isOpen ? 'open' : ''}`}>▾</div>
            </div>
            {isOpen && (
              <div>
                {pillar.items.map(item => (
                  <div key={item.id} className="item-row" onClick={() => toggle(item.id)}>
                    <div className="item-label">{item.label}<span>{item.sub}</span></div>
                    <div className="item-pts-label">
                      {item.pts > 0 ? `${item.pts} pt${item.pts > 1 ? 's' : ''}` : '—'}
                    </div>
                    <div className={`checkbox ${checked[item.id] ? 'checked' : ''}`}
                      style={checked[item.id] ? { background: pillar.color } : {}} />
                  </div>
                ))}
                {pillar.id === 'eval' && (
                  <div className="eval-note">No points — grounds everything else.</div>
                )}
              </div>
            )}
          </div>
        )
      })}

      <div className="bottom-action">
        <div className="grade-badge" style={{
          color: grade.color,
          background: grade.color + '22',
          border: `1px solid ${grade.color}55`
        }}>{grade.label}</div>
        <div className="save-indicator">
          <div className={`save-dot ${saved ? 'show' : ''}`} />
          {saving ? 'Saving...' : saved ? 'Saved' : ''}
        </div>
      </div>

      <div className="history-wrap">
        <div className="history-title">Last 7 days</div>
        <div className="history-dots">
          {last7.map(day => {
            const g = day.pts !== null ? getGrade(day.pts) : null
            return (
              <div key={day.date} className={`h-dot ${day.date === today ? 'today' : ''}`}
                style={{ background: g ? g.color + '22' : 'var(--card)', color: g ? g.color : 'var(--dim)' }}>
                {day.pts !== null ? day.pts : '·'}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()
}

function getLast7(history, today) {
  const result = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const entry = history.find(h => h.date === key)
    result.push({ date: key, pts: entry ? scoreFromChecked(entry.checked) : null })
  }
  return result
}
