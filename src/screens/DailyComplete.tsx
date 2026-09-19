import { Flame, CalendarClock, RotateCcw, ArrowRight, Check } from 'lucide-react'
import { SKILL_LABEL } from '../types'
import type { Onboarding, Profile } from '../lib/profile'
import { Pill, PrimaryButton } from '../components/ui'

// Days 1–6 recap (2.4). This is the *routine* end-of-session screen — smaller
// than the day-7 milestone. Its job is the return trigger: close the loop today,
// and give tomorrow a concrete reason to open the app (a spaced-repetition queue
// of today's misses). Streak + exam countdown keep the stakes visible.
export default function DailyCompleteScreen({
  onb,
  profile,
  day,
  onContinue
}: {
  onb: Onboarding
  profile: Profile
  day: number
  onContinue: () => void
}) {
  const daysToTest = onb.weeks * 7 - day
  const focusLabel = SKILL_LABEL[profile.focusSkill]
  // Demo values — in the real app these come from the session just finished.
  const correct = 4
  const total = 5
  const dueTomorrow = total - correct + 1 // today's misses re-queued + 1 spaced card

  return (
    <div className="flex flex-col h-full px-6 pt-6 pb-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-bold text-ink">Day {day} done</span>
        <Pill tone="warn">
          <Flame size={13} /> {day}-day streak
        </Pill>
      </div>

      <div className="mt-6 rounded-3xl bg-success-soft p-5 text-center">
        <div className="text-[13px] font-semibold text-success">Today's set</div>
        <div className="mt-1 text-[40px] leading-none font-bold text-ink tabular-nums">
          {correct}<span className="text-[22px] text-ink-muted">/{total}</span>
        </div>
        <p className="mt-2 text-[14px] text-ink">Nice — {focusLabel} is getting sharper.</p>
      </div>

      {/* spaced-repetition queue = tomorrow's return trigger */}
      <div className="mt-5 rounded-3xl bg-surface border border-border p-5 shadow-card">
        <div className="flex items-center gap-2 text-accent font-bold text-[15px]">
          <RotateCcw size={17} /> Waiting for you tomorrow
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-[34px] leading-none font-bold text-ink tabular-nums">{dueTomorrow}</span>
          <p className="text-[14px] text-ink-muted leading-snug">
            cards come back tomorrow — the ones you missed, timed to hit right before you'd forget.
          </p>
        </div>
      </div>

      {/* exam countdown */}
      <div className="mt-4 flex items-center gap-2 text-[13px] text-ink-muted">
        <CalendarClock size={15} className="text-warn" />
        <span className="font-semibold text-ink">{daysToTest} days</span> to test day. Small reps add up.
      </div>

      <div className="mt-5 flex items-center gap-2 text-[13px] text-ink-muted">
        <Check size={15} className="text-success" /> Tomorrow's 40 min is already planned. Zero decisions.
      </div>

      <div className="flex-1 min-h-4" />

      <div className="space-y-2">
        <PrimaryButton onClick={onContinue}>
          {day >= 6 ? 'Jump to day 7' : 'See tomorrow'} <ArrowRight size={16} className="inline ml-1 -mt-0.5" />
        </PrimaryButton>
        <p className="text-center text-[12px] text-ink-muted">Come back tomorrow to keep the streak alive.</p>
      </div>
    </div>
  )
}
