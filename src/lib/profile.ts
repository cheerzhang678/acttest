import type { Domain, Skill } from '../types'
import { DIAG_ITEMS } from '../data/items'
import { SKILL_DOMAIN } from '../types'

export interface Onboarding {
  target: number
  current: number
  weeks: number
  dailyMin: number
}

export interface DomainStat {
  correct: number
  total: number
  estScore: number // estimated 1–36 sub-score
}

export interface Profile {
  answered: number
  byDomain: Record<Domain, DomainStat>
  weakSkills: Skill[] // ranked, weakest first
  strongSkills: Skill[] // answered correctly — used for mastery-aware feedback
  focusSkill: Skill // the single skill today's session centers on
  estComposite: number
  confidence: number // 0–100, how dialed-in the report is
}

const DOMAINS: Domain[] = ['English', 'Math', 'Reading']

// Keep the plan focused on English when the diagnostic is inconclusive.
const FALLBACK_WEAK: Skill[] = ['rhetoric-add-delete', 'punctuation', 'subject-verb']

// Warm-start prior: the student's self-reported current score seeds the adaptive
// engine's starting difficulty, so we need fewer questions to converge.
export function warmStartDifficulty(current: number): 1 | 2 | 3 {
  if (current <= 19) return 1
  if (current >= 27) return 3
  return 2
}

// How dialed-in the report is after n answered questions. Monotonic, capped —
// 5 questions ≈ 80%, 8 ≈ 95% (capped 94). Used to set student expectations at
// the early-stop decision point.
export function reportConfidence(n: number): number {
  if (n <= 0) return 45
  return Math.min(94, 55 + n * 5)
}

// Turn diagnostic answers into a defensible profile.
export function buildProfile(onb: Onboarding, answers: Record<string, boolean>): Profile {
  const byDomain: Record<Domain, DomainStat> = {
    English: { correct: 0, total: 0, estScore: 0 },
    Math: { correct: 0, total: 0, estScore: 0 },
    Reading: { correct: 0, total: 0, estScore: 0 }
  }
  const missedSkills: Skill[] = []
  const strongSkills: Skill[] = []

  for (const item of DIAG_ITEMS) {
    if (!(item.id in answers)) continue
    const stat = byDomain[item.domain]
    stat.total += 1
    if (answers[item.id]) {
      stat.correct += 1
      strongSkills.push(item.skill)
    } else {
      missedSkills.push(item.skill)
    }
  }

  // Estimate each domain sub-score around the stated baseline, nudged by
  // observed accuracy. Bounded to the ACT 1–36 scale. (Measurement layer:
  // deliberately smooth so the number doesn't visibly "jump".)
  for (const d of DOMAINS) {
    const s = byDomain[d]
    const acc = s.total ? s.correct / s.total : 0.5
    s.estScore = clampScore(Math.round(onb.current - 3 + acc * 8))
  }

  const freq = new Map<Skill, number>()
  for (const sk of missedSkills) freq.set(sk, (freq.get(sk) ?? 0) + 1)
  const weakSkills = [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([sk]) => sk)
  for (const f of FALLBACK_WEAK) {
    if (weakSkills.length >= 3) break
    if (!weakSkills.includes(f)) weakSkills.push(f)
  }

  const focusSkill =
    weakSkills.find((sk) => SKILL_DOMAIN[sk] === 'English') ?? weakSkills[0] ?? 'subject-verb'

  const answered = Object.values(byDomain).reduce((n, s) => n + s.total, 0)
  const estComposite = clampScore(
    Math.round((byDomain.English.estScore + byDomain.Math.estScore + byDomain.Reading.estScore) / 3)
  )

  return {
    answered,
    byDomain,
    weakSkills: weakSkills.slice(0, 3),
    strongSkills: [...new Set(strongSkills)],
    focusSkill,
    estComposite,
    confidence: reportConfidence(answered)
  }
}

function clampScore(n: number): number {
  return Math.max(1, Math.min(36, n))
}
