import type { Onboarding, Profile } from './profile'
import type { Domain } from '../types'

// Practice "memory" layer — persists an in-progress daily session so a student
// who runs out of time or gets interrupted can close the tab and pick up exactly
// where they left off next time. Prototype-scoped: one active session in
// localStorage, cleared the moment a day is completed. This is what makes the
// 40-min/day loop forgiving instead of all-or-nothing.

// One practice question's committed state (mirrors Practice's Rec).
export interface PracticeRec {
  phase: 'answering' | 'hint' | 'resolved'
  firstWrong: number | null
  lastPick: number | null
  correctOnFirst: boolean
  timeSec: number
}

export interface SavedSession {
  onb: Onboarding
  profile: Profile
  day: number
  focusDomain: Domain // which category this day's set covers (student-chosen)
  idx: number
  records: Record<number, PracticeRec>
  streak: number
  total: number // questions in the day's set — to show "N of M left"
  savedAt: number // epoch ms, for "paused earlier today" copy if needed
}

const KEY = 'kira-act-session-v1'

export function loadSession(): SavedSession | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as SavedSession
    // Minimal shape guard — a corrupt/old blob resets rather than crashes.
    if (!s || !s.profile || !s.onb || typeof s.idx !== 'number') return null
    return s
  } catch {
    return null
  }
}

export function saveSession(s: SavedSession): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    // Private mode / storage full — degrade to no-persistence, never throw.
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

// How many questions the student has already committed (reached 'resolved').
export function resolvedCount(s: SavedSession): number {
  return Object.values(s.records).filter((r) => r.phase === 'resolved').length
}
