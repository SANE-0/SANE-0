import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase.js'

import AuthPage    from './pages/AuthPage.jsx'
import LogPage     from './pages/LogPage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import LeaderPage  from './pages/LeaderPage.jsx'
import CoachPage   from './pages/CoachPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

function NavBar({ isCoach }) {
  return (
    <nav className="nav-bar">
      <NavLink to="/log"         className={({ isActive }) => isActive ? 'active' : ''}>
        <span className="nav-icon">◈</span>Today
      </NavLink>
      <NavLink to="/history"     className={({ isActive }) => isActive ? 'active' : ''}>
        <span className="nav-icon">◫</span>History
      </NavLink>
      <NavLink to="/leaderboard" className={({ isActive }) => isActive ? 'active' : ''}>
        <span className="nav-icon">△</span>Board
      </NavLink>
      {isCoach && (
        <NavLink to="/coach" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="nav-icon">⬡</span>Coach
        </NavLink>
      )}
      <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
        <span className="nav-icon">○</span>Profile
      </NavLink>
    </nav>
  )
}

export default function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">SANE</div>
      </div>
    )
  }

  if (!session) return <AuthPage />

  const isCoach = profile?.role === 'coach'

  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="page">
          <Routes>
            <Route path="/"            element={<Navigate to="/log" replace />} />
            <Route path="/log"         element={<LogPage session={session} profile={profile} />} />
            <Route path="/history"     element={<HistoryPage session={session} />} />
            <Route path="/leaderboard" element={<LeaderPage session={session} />} />
            <Route path="/coach"       element={isCoach ? <CoachPage /> : <Navigate to="/log" replace />} />
            <Route path="/profile"     element={<ProfilePage session={session} profile={profile} setProfile={setProfile} />} />
          </Routes>
        </div>
        <NavBar isCoach={isCoach} />
      </div>
    </BrowserRouter>
  )
}
