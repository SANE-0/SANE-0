import React, { useState, useEffect } from 'react'
import { supabase, getGrade } from '../lib/supabase.js'

const AVATAR_COLORS = ['#5BA4CF','#E63946','#52B788','#F4A261','#888']
function initials(name = '') { return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '??' }

export default function LeaderPage({ session }) {
  const [tab, setTab]         = useState('week')
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load(tab) }, [tab])

  async function load(period) {
    setLoading(true)
    let query = supabase.from('scores').select('user_id, total_score, profiles(name)')
    if (period === 'week') {
      const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7)
      query = query.gte('date', cutoff.toISOString().slice(0,10))
    }
    const { data } = await query
    if (!data) { setLoading(false); return }
    const map = {}
    data.forEach(row => {
      const uid = row.user_id
      if (!map[uid]) map[uid] = { uid, name: row.profiles?.name || 'Unknown', total: 0, days: 0 }
      map[uid].total += row.total_score || 0
      map[uid].days++
    })
    const sorted = Object.values(map)
      .map(u => ({ ...u, avg: u.days > 0 ? Math.round(u.total / u.days) : 0 }))
      .sort((a, b) => b.total - a.total).slice(0, 20)
    setRows(sorted)
    setLoading(false)
  }

  const myId = session.user.id

  return (
    <div>
      <div className="top-bar">
        <h1>Leaderboard</h1>
        <div className="subtitle">Community rankings</div>
      </div>
      <div className="tabs">
        <div className={`tab ${tab === 'week' ? 'active' : ''}`} onClick={() => setTab('week')}>This Week</div>
        <div className={`tab ${tab === 'alltime' ? 'active' : ''}`} onClick={() => setTab('alltime')}>All Time</div>
      </div>
      {loading && <div style={{ color: 'var(--muted)', fontSize: 14, padding: '24px 20px' }}>Loading...</div>}
      {!loading && rows.length === 0 && (
        <div style={{ color: 'var(--muted)', fontSize: 14, padding: '24px 20px' }}>No scores yet — be the first.</div>
      )}
      {rows.map((row, i) => {
        const isMe  = row.uid === myId
        const grade = getGrade(row.avg)
        const rank  = i + 1
        const avatarC = AVATAR_COLORS[i % AVATAR_COLORS.length]
        return (
          <div key={row.uid} className="lb-row" style={isMe ? { background: 'rgba(244,162,97,0.06)' } : {}}>
            <div className={`lb-rank ${rank <= 3 ? 'top' : ''}`}>
              {rank === 1 ? '①' : rank === 2 ? '②' : rank === 3 ? '③' : rank}
            </div>
            <div className="lb-avatar" style={{ background: avatarC + '22', color: avatarC }}>{initials(row.name)}</div>
            <div style={{ flex: 1 }}>
              <div className="lb-name">
                {row.name} {isMe && <span style={{ fontSize: 10, color: 'var(--gold)', marginLeft: 4 }}>YOU</span>}
              </div>
              <div className="lb-meta">{row.days} day{row.days !== 1 ? 's' : ''} logged · avg {row.avg}/30</div>
            </div>
            <div>
              <div className="lb-score" style={{ color: grade.color }}>{row.total}<span>pts</span></div>
              <div style={{ fontSize: 10, textAlign: 'right', color: grade.color, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1, textTransform: 'uppercase' }}>{grade.label}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
