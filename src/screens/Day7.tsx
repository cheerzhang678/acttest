import { Flame, ArrowRight, Sparkles, Trophy, Star } from 'lucide-react'
import { SKILL_LABEL } from '../types'
import type { Onboarding, Profile } from '../lib/profile'
import { AppShell, TwoCol, Card, Meter, Pill, PrimaryButton, GhostButton } from '../components/ui'

// Screen 5 — the day-7 milestone. Deliberately bigger than the daily recap.
// What brings a student back at the one-week mark (where most self-study apps
// have already lost them): visible proof the score moved, mastery climbed, and
// the streak held — plus a near-breakthrough hook so stopping feels like leaving
// points on the table, and a "you made it further than most" retention nudge.
export default function Day7Screen({
  onb,
  profile,
  onRestart,
  onPractice
}: {
  onb: Onboarding
  profile: Profile
  onRestart: () => void
  onPractice: () => void
}) {
  const newScore = Math.min(onb.target, profile.estComposite + 2)
  const focusLabel = SKILL_LABEL[profile.focusSkill]
  const secondary = profile.weakSkills[1] ? SKILL_LABEL[profile.weakSkills[1]] : 'Punctuation'
  const daysToTest = onb.weeks * 7 - 7

  return (
    <AppShell
      headerRight={
        <Pill tone="warn">
          <Flame size={13} /> 7-day streak
        </Pill>
      }
    >
      <div className="animate-fade-up">
        <span className="inline-flex items-center gap-1.5 text-[15px] font-bold text-ink">
          <Sparkles size={17} className="text-accent" /> One week in
        </span>
        <h1 className="mt-4 text-[30px] font-bold text-ink leading-tight max-w-2xl">
          7 days. You've moved your ACT up 2 points.
        </h1>
      </div>

      <div className="mt-6">
        <TwoCol
          left={
            <div className="space-y-5">
              {/* retention nudge — most people don't make it here */}
              <div className="flex items-start gap-2 rounded-2xl bg-accent-soft p-4">
                <Star size={16} className="mt-0.5 shrink-0 text-accent" />
                <p className="text-[13px] text-ink leading-relaxed">
                  Most prep apps lose 4 out of 5 students before day 7. You showed up all week —
                  that consistency is what actually moves scores.
                </p>
              </div>

              {/* score movement */}
              <div className="rounded-3xl bg-ink text-white p-6 shadow-card">
                <div className="text-[13px] text-white/70 font-medium">Estimated score · day 1 → today</div>
                <div className="mt-3 flex items-end gap-3">
                  <span className="text-[42px] leading-none font-bold tabular-nums text-white/50">{profile.estComposite}</span>
                  <ArrowRight size={22} className="mb-1.5 text-white/40" />
                  <span className="text-[42px] leading-none font-bold tabular-nums text-accent-soft">{newScore}</span>
                  <span className="mb-1.5 ml-auto text-[13px] text-white/70">goal {onb.target} · {daysToTest} days left</span>
                </div>
              </div>

              {/* mastery gains */}
              <Card>
                <h2 className="text-[15px] font-bold text-ink mb-3">What you leveled up</h2>
                <MasteryRow label={focusLabel} from={45} to={72} />
                <div className="h-3" />
                <MasteryRow label={secondary} from={38} to={60} />
              </Card>
            </div>
          }
          right={
            <div className="space-y-5">
              {/* near-breakthrough hook */}
              <div className="rounded-3xl bg-warn-soft p-5">
                <div className="flex items-center gap-2 text-warn font-bold text-[15px]">
                  <Trophy size={17} /> So close
                </div>
                <p className="mt-2 text-[14px] text-ink leading-relaxed">
                  Two more days and <span className="font-bold">{secondary}</span> jumps 60% → 80%. Clear that
                  tier and English locks in another point.
                </p>
              </div>

              <div className="space-y-2">
                <PrimaryButton onClick={onPractice}>Start day 7 · {onb.dailyMin} min, already planned</PrimaryButton>
                <GhostButton onClick={onRestart}>Restart demo (back to the top)</GhostButton>
              </div>
            </div>
          }
        />
      </div>
    </AppShell>
  )
}

function MasteryRow({ label, from, to }: { label: string; from: number; to: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[14px] font-medium text-ink">{label}</span>
        <span className="text-[13px] font-semibold text-ink-muted tabular-nums">
          {from}% <span className="text-success">→ {to}%</span>
        </span>
      </div>
      <Meter value={to} tone="success" />
    </div>
  )
}
