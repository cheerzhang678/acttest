import { Flame, CalendarClock, RotateCcw, ArrowRight, Check } from 'lucide-react'
import { SKILL_LABEL } from '../types'
import type { Onboarding, Profile } from '../lib/profile'
import { AppShell, TwoCol, Card, Pill, PrimaryButton } from '../components/ui'

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
    <AppShell
      headerRight={
        <Pill tone="warn">
          <Flame size={13} /> {day}-day streak
        </Pill>
      }
    >
      <div className="animate-fade-up">
        <h1 className="text-[26px] font-bold text-ink leading-tight">Day {day} done</h1>
        <p className="text-[14px] text-ink-muted mt-1">Loop closed for today — here's what's waiting tomorrow.</p>
      </div>

      <div className="mt-6">
        <TwoCol
          left={
            <div className="rounded-3xl bg-success-soft p-6 text-center">
              <div className="text-[13px] font-semibold text-success">Today's set</div>
              <div className="mt-1 text-[48px] leading-none font-bold text-ink tabular-nums">
                {correct}<span className="text-[24px] text-ink-muted">/{total}</span>
              </div>
              <p className="mt-3 text-[14px] text-ink">Nice — {focusLabel} is getting sharper.</p>
            </div>
          }
          right={
            <div className="space-y-4">
              {/* spaced-repetition queue = tomorrow's return trigger */}
              <Card>
                <div className="flex items-center gap-2 text-accent font-bold text-[15px]">
                  <RotateCcw size={17} /> Waiting for you tomorrow
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-[34px] leading-none font-bold text-ink tabular-nums">{dueTomorrow}</span>
                  <p className="text-[14px] text-ink-muted leading-snug">
                    cards come back tomorrow — the ones you missed, timed to hit right before you'd forget.
                  </p>
                </div>
              </Card>

              {/* exam countdown */}
              <div className="flex items-center gap-2 text-[13px] text-ink-muted">
                <CalendarClock size={15} className="text-warn" />
                <span className="font-semibold text-ink">{daysToTest} days</span> to test day. Small reps add up.
              </div>

              <div className="flex items-center gap-2 text-[13px] text-ink-muted">
                <Check size={15} className="text-success" /> Tomorrow's {onb.dailyMin} min is already planned. Zero decisions.
              </div>

              <div className="space-y-2 pt-1">
                <PrimaryButton onClick={onContinue}>
                  {day >= 6 ? 'Jump to day 7' : 'See tomorrow'} <ArrowRight size={16} className="inline ml-1 -mt-0.5" />
                </PrimaryButton>
                <p className="text-center text-[12px] text-ink-muted">Come back tomorrow to keep the streak alive.</p>
              </div>
            </div>
          }
        />
      </div>
    </AppShell>
  )
}
