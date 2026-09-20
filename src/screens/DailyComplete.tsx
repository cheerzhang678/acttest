import { Flame, CalendarClock, RotateCcw, Check } from 'lucide-react'
import { SKILL_LABEL, SKILL_DOMAIN } from '../types'
import type { Onboarding, Profile } from '../lib/profile'
import { AppShell, TwoCol, Card, Pill, IconChip, DOMAIN_CHIP } from '../components/ui'

// Days 1–6 recap (2.4). This is the *routine* end-of-session screen — smaller
// than the day-7 milestone. Its job is the return trigger: close the loop today,
// and give tomorrow a concrete reason to open the app (a spaced-repetition queue
// of today's misses). Streak + exam countdown keep the stakes visible.
export default function DailyCompleteScreen({
  onb,
  profile,
  day,
  onContinue,
  onDoneForToday
}: {
  onb: Onboarding
  profile: Profile
  day: number
  onContinue: () => void
  onDoneForToday: () => void
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
        <h1 className="text-[26px] font-display font-semibold text-ink leading-tight">Day {day} done</h1>
        <p className="text-[14px] text-ink-muted mt-1">Today's loop is closed — streak saved. Tomorrow's set is waiting.</p>
      </div>

      <div className="mt-6">
        <TwoCol
          left={
            <div className="rounded-3xl bg-success-soft p-6 text-center">
              <div className="flex justify-center mb-3">
                <IconChip {...DOMAIN_CHIP[SKILL_DOMAIN[profile.focusSkill]]} size={44} />
              </div>
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
                    cards come back tomorrow — timed to hit right before you'd forget.
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

              {/* Two paths, one visual language (matches the diagnostic checkpoint):
                  accent-filled = the recommended move (spacing beats cramming),
                  outline = the eager student who wants to push on now. */}
              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  onClick={onDoneForToday}
                  className="w-full rounded-full bg-accent text-white font-semibold py-3.5 text-[15px] text-center transition active:scale-[0.98] hover:bg-accent/90"
                >
                  That's a wrap for today
                </button>
                <button
                  onClick={onContinue}
                  className="w-full rounded-full bg-transparent border border-accent text-accent font-semibold py-3.5 text-[15px] text-center transition active:scale-[0.98] hover:bg-accent-soft"
                >
                  {day >= 6 ? 'Keep going — jump to day 7 →' : "Keep going — do tomorrow's set now →"}
                </button>
                <p className="text-center text-[12px] text-ink-muted">
                  Spacing beats cramming — but if you're in flow, keep rolling.
                </p>
              </div>
            </div>
          }
        />
      </div>
    </AppShell>
  )
}
