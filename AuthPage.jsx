import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const PILLARS = [
  {
    id: 'sleep', label: 'Sleep', color: '#5BA4CF',
    items: [
      { id: 's1', label: 'Duration',   sub: '7–9 hrs last night',       pts: 4 },
      { id: 's2', label: 'Regularity', sub: '7–9 hrs night before',     pts: 3 },
      { id: 's3', label: 'Schedule',   sub: 'Same sleep/wake time',      pts: 2 },
      { id: 's4', label: 'Quality',    sub: 'Woke up feeling rested',    pts: 1 },
    ]
  },
  {
    id: 'activity', label: 'Activity', color: '#E63946',
    items: [
      { id: 'a1', label: 'Daily Activity',    sub: '8,000+ steps today',         pts: 4 },
      { id: 'a2', label: 'Strength Training', sub: 'Today or yesterday',         pts: 3 },
      { id: 'a3', label: 'Cardio',            sub: '30+ min elevated HR',        pts: 2 },
      { id: 'a4', label: 'Fun',               sub: 'Enjoyed physical activity',  pts: 1 },
    ]
  },
  {
    id: 'nutrition', label: 'Nutrition', color: '#52B788',
    items: [
      { id: 'n1', label: 'Calorie Balance', sub: 'Within 5% of target',             pts: 4 },
      { id: 'n2', label: 'Macros',          sub: 'Hit protein target',              pts: 3 },
      { id: 'n3', label: 'Quality',         sub: '80%+ whole/minimally processed',  pts: 2 },
      { id: 'n4', label: 'Timing',          sub: 'Same meal times as yesterday',    pts: 1 },
    ]
  },
  {
    id: 'eval', label: 'Evaluation', color: '#888888',
    items: [
      { id: 'e1', label: 'Honesty',        sub: 'Truthful with yourself today',   pts: 0 },
      { id: 'e2', label: 'Responsibility', sub: 'Owned your outcomes',            pts: 0 },
      { id: 'e3', label: 'Accountability', sub: 'Kept your commitments',          pts: 0 },
      { id: 'e4', label: 'Feeling',        sub: "Emotions didn't drive actions",  pts: 0 },
    ]
  }
]

export const GRADES = [
  { min: 27, label: 'Elite',      color: '#F4A261' },
  { min: 23, label: 'Strong',     color: '#52B788' },
  { min: 18, label: 'Solid',      color: '#5BA4CF' },
  { min: 12, label: 'Building',   color: '#aaa'    },
  { min: 0,  label: 'Needs Work', color: '#E63946' },
]

export function getGrade(score) {
  return GRADES.find(g => score >= g.min) || GRADES[GRADES.length - 1]
}

export function scoreFromChecked(checked) {
  let total = 0
  PILLARS.forEach(p => p.items.forEach(item => {
    if (checked[item.id]) total += item.pts
  }))
  return total
}

export function pillarScore(pillarId, checked) {
  const p = PILLARS.find(p => p.id === pillarId)
  if (!p) return 0
  return p.items.reduce((sum, item) => sum + (checked[item.id] ? item.pts : 0), 0)
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
