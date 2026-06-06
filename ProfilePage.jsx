import React, { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function ProfilePage({ session, profile, setProfile }) {
  const [name, setName]     = useState(profile?.name || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  async function saveProfile() {
    setSaving(true)
    const { data } = await supabase.from('profiles').update({ name }).eq('id', session.user.id).select().single()
    if (data) setProfile(data)
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="top-bar"><h1>Profile</h1><div className="subtitle">{session.user.email}</div></div>
      <div style={{ padding: '24px 20px' }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(244,162,97,0.15)', border:'1px solid rgba(244,162,97,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:'var(--gold)', margin:'0 auto 24px' }}>
          {(profile?.name||'?').slice(0,2).toUpperCase()}
        </div>
        <div className="form-group">
          <label className="form-label">Display Name</label>
          <input type="text" value={name} placeholder="Your name" onChange={e => setName(e.target.value)} />
        </div>
        <button className="btn-primary" style={{ marginTop:8, marginBottom:24 }} onClick={saveProfile} disabled={saving}>
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div><div style={{ fontSize:13, fontWeight:500 }}>Account type</div><div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{profile?.role||'member'}</div></div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:1, textTransform:'uppercase', background:'rgba(91,164,207,0.15)', color:'var(--sleep)', border:'1px solid rgba(91,164,207,0.3)', borderRadius:6, padding:'4px 10px' }}>{profile?.role==='coach'?'Coach':'Member'}</div>
        </div>
        <button className="btn-ghost" onClick={() => supabase.auth.signOut()} style={{ width:'100%', padding:12, marginTop:8 }}>Sign Out</button>
        <div style={{ marginTop:32, textAlign:'center', fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:3, color:'var(--dim)' }}>SANE · SLEEP · ACTIVITY · NUTRITION · EVALUATION</div>
      </div>
    </div>
  )
}
