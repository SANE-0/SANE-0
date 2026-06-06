import React, { useState, useEffect } from 'react'
import { supabase, getGrade } from '../lib/supabase.js'

function initials(name = '') { return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '??' }

function calcStreak(sortedScores) {
  if (!sortedScores.length) return 0
  const today = new Date().toISOString().slice(0,10)
  let streak = 0, expected = today
  for (const s of sortedScores) {
    if (s.date === expected) {
      streak++
      const d = new Date(expected + 'T12:00:00'); d.setDate(d.getDate() - 1)
      expected = d.toISOString().slice(0,10)
    } else break
  }
  return streak
}

export default function CoachPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy]   = useState('recent')

  useEffect(() => { load() }, [])

  async function load() {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7)
    const { data: profiles } = await supabase.from('profiles').select('id, name, email').eq('role', 'member')
    if (!profiles) { setLoading(false); return }
    const { data: scores } = await supabase.from('scores')
      .select('user_id, date, total_score, sleep_score, activity_score, nutrition_score')
      .gte('date', cutoff.toISOString().slice(0,10)).order('date', { ascending: false })
    const today = new Date().toISOString().slice(0,10)
    const memberData = profiles.map(p => {
      const myScores   = (scores || []).filter(s => s.user_id === p.id).sort((a,b) => b.date.localeCompare(a.date))
      const avg7       = myScores.length ? Math.round(myScores.reduce((a,s) => a + (s.total_score||0), 0) / myScores.length) : null
      const loggedToday = myScores.some(s => s.date === today)
      return { ...p, avg7, loggedToday, streak: calcStreak(myScores), weekScores: myScores }
    })
    setMembers(memberData)
    setLoading(false)
  }

  const sorted = [...members].sort((a, b) => {
    if (sortBy === 'score')  return (b.avg7||0) - (a.avg7||0)
    if (sortBy === 'streak') return b.streak - a.streak
    return (b.loggedToday ? 1 : 0) - (a.loggedToday ? 1 : 0)
  })

  const loggedCount = members.filter(m => m.loggedToday).length
  const avgScore    = members.filter(m => m.avg7 !== null).length
    ? Math.round(members.filter(m => m.avg7).reduce((a,m) => a + m.avg7, 0) / members.filter(m => m.avg7).length)
    : 0
  const highStreak  = members.length ? Math.max(...members.map(m => m.streak)) : 0

  return (
    <div>
      <div className="top-bar"><h1>Coach View</h1><div className="subtitle">Member overview · last 7 days</div></div>
      <div style={{ display: 'flex', gap: 10, padding: '16px 16px 0' }}>
        {[['Members', members.length, '#fff'], ['Today', loggedCount, 'var(--nutrition)'], ['Avg', avgScore||'—', 'var(--sleep)'], ['Streak', `${highStreak}d`, 'var(--gold)']].map(([l,v,c]) => (
          <div key={l} className="dash-stat" style={{ flex: 1, padding: '12px 10px' }}>
            <div className="dash-stat-label" style={{ fontSize: 10 }}>{l}</div>
            <div className="dash-stat-value" style={{ color: c, fontSize: 22 }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="tabs" style={{ marginTop: 16 }}>
        {['recent','score','streak'].map(s => (
          <div key={s} className={`tab ${sortBy===s?'active':''}`} onClick={() => setSortBy(s)}>
            {s==='recent'?'Activity':s==='score'?'Score':'Streak'}
          </div>
        ))}
      </div>
      {loading && <div style={{ color: 'var(--muted)', fontSize: 14, padding: '24px 20px' }}>Loading...</div>}
      {sorted.map(member => {
        const grade = member.avg7 !== null ? getGrade(member.avg7) : null
        const ac    = grade ? grade.color : 'var(--muted)'
        return (
          <div key={member.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            <div className="lb-avatar" style={{ background: ac+'22', color: ac }}>{initials(member.name)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize:14, fontWeight:500, display:'flex', alignItems:'center', gap:8 }}>
                {member.name}
                {member.loggedToday && <span style={{ fontSize:9, background:'var(--nutrition)', color:'#000', borderRadius:4, padding:'1px 5px', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1 }}>TODAY</span>}
              </div>
              <div style={{ fontSize:11, color:'var(--muted)', fontFamily:"'Barlow Condensed',sans-serif", marginTop:2 }}>
                {member.streak > 0 ? `${member.streak}d streak` : 'No streak'} · {member.weekScores.length} logs
              </div>
              <div style={{ display:'flex', gap:3, marginTop:6 }}>
                {member.weekScores.slice(0,7).reverse().map((s,i) => {
                  const g = getGrade(s.total_score||0)
                  return <div key={i} style={{ width:20, height:20, borderRadius:4, background:g.color+'33', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:g.color, fontFamily:"'Bebas Neue',sans-serif" }}>{s.total_score||0}</div>
                })}
              </div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              {member.avg7 !== null
                ? <><div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, color:grade?.color }}>{member.avg7}</div><div style={{ fontSize:9, color:'var(--muted)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:0.5 }}>7D AVG</div></>
                : <div style={{ fontSize:13, color:'var(--dim)' }}>—</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
