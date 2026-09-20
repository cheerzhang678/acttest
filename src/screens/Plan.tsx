import { Target, CheckCircle2, Clock, ArrowRight, CalendarClock, RefreshCw, RotateCcw, FlaskConical, PenLine } from 'lucide-react'
import type { ReactNode } from 'react'
import type { CoreDomain, Domain, Skill } from '../types'
import { SKILL_LABEL, SKILL_DOMAIN } from '../types'
import type { Onboarding, Profile } from '../lib/profile'
import { leversFor } from '../lib/profile'
import { loadSession, resolvedCount } from '../lib/session'
import { AppShell, TwoCol, Card, Meter, Pill, PrimaryButton, IconChip, DOMAIN_CHIP } from '../components/ui'

const DOMAINS: CoreDomain[] = ['English', 'Math', 'Reading']

// Screen 3 — the personalized plan. It answers the implicit question: "where's
// my time going, and why these things?" Everything traces to the diagnostic:
// the gap, the ranked weak skills, today's concrete minutes. On desktop it reads
// left = the profile (gap + strengths/gaps), right = what to do about it today.
export default function PlanScreen({
  onb,
  profile,
  day = 1,
  focusDomain,
  recommended,
  onPickFocus,
  onStartPractice
}: {
  onb: Onboarding
  profile: Profile
  day?: number
  focusDomain: Domain
  recommended: Domain
  onPickFocus: (d: Domain) => void
  onStartPractice: () => void
}) {
  const gap = Math.max(0, onb.target - profile.estComposite)
  const weakest = [...DOMAINS].sort((a, b) => profile.byDomain[a].estScore - profile.byDomain[b].estScore)[0]
  const days = onb.weeks * 7

  // The categories the student can pick from today — core three, plus Science
  // if they opted into it. They're free to work any of these on any day.
  const focusChoices: Domain[] = onb.takingScience ? ['English', 'Math', 'Reading', 'Science'] : DOMAINS

  // Resume hook: only when the paused set matches BOTH the day and the picked
  // category (switching category starts fresh, so the resume card hides).
  const saved = loadSession()
  const done = saved && saved.day === day && saved.focusDomain === focusDomain ? resolvedCount(saved) : 0
  const resumeLeft = done > 0 ? saved!.total - done : 0
  const resuming = resumeLeft > 0

  // Today's levers follow the category the student picked — Math levers for
  // Math, Reading for Reading — not a fixed English list. The lead drill in the
  // "Today" block is that category's top lever.
  const levers = leversFor(profile, focusDomain)
  const leadFocusLabel = levers[0] ? SKILL_LABEL[levers[0]] : focusDomain

  return (
    <AppShell
      headerRight={
        <Pill tone="warn">
          <CalendarClock size={13} /> {days} days to test
        </Pill>
      }
    >
      <div className="animate-fade-up">
        <h1 className="text-[26px] font-display font-semibold text-ink leading-tight">Your plan's ready</h1>
        <p className="text-[14px] text-ink-muted mt-1">
          Built from the {profile.answered} questions you just answered.
        </p>
      </div>

      <div className="mt-6">
        <TwoCol
          left={
            <div className="space-y-6">
              {/* score gap — measurement layer, kept stable on purpose */}
              <div className="rounded-3xl bg-ink text-white p-6 shadow-card">
                <div className="flex items-center gap-2 text-[13px] text-white/70 font-medium">
                  <Target size={15} /> Estimated now → goal
                </div>
                <div className="mt-3 flex items-end gap-4">
                  <span className="text-[48px] leading-none font-bold tabular-nums">{profile.estComposite}</span>
                  <ArrowRight size={24} className="mb-2 text-white/50" />
                  <span className="text-[48px] leading-none font-bold tabular-nums text-accent-soft">{onb.target}</span>
                  <span className="mb-2 ml-auto text-[14px] text-white/70">+{gap} to go</span>
                </div>
                {/* living-profile note (P1#6 + Student-Atlas framing) */}
                <div className="mt-4 flex items-start gap-2 text-[12px] text-white/60 leading-relaxed">
                  <RefreshCw size={13} className="mt-0.5 shrink-0 text-accent-soft" />
                  <span>Updates as you practice — it sharpens, it won't jump around.</span>
                </div>
              </div>

              {/* domain profile */}
              <Card>
                <h2 className="text-[15px] font-bold text-ink mb-3">Strengths &amp; gaps</h2>
                <div className="space-y-3">
                  {DOMAINS.map((d) => (
                    <div key={d}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[14px] font-medium text-ink flex items-center gap-2">
                          {d}
                          {d === weakest && <Pill tone="warn">focus here</Pill>}
                        </span>
                        <span className="text-[13px] font-semibold text-ink-muted tabular-nums">{profile.byDomain[d].estScore}</span>
                      </div>
                      <Meter
                        value={(profile.byDomain[d].estScore / 36) * 100}
                        tone={d === weakest ? 'warn' : 'accent'}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          }
          right={
            <div className="space-y-6">
              {/* category picker — the student steers each day's focus; the plan
                  recommends their weakest area but never locks them into it */}
              <Card>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-[15px] font-bold text-ink">Work on today</h2>
                  <span className="text-[12px] text-ink-muted">You pick · plan adapts</span>
                </div>
                <p className="text-[12px] text-ink-muted leading-relaxed mb-3">
                  Recommended: <span className="font-semibold text-ink">{recommended}</span> — your biggest gap. But any day is yours to steer.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {focusChoices.map((d) => {
                    const { icon: Icon } = DOMAIN_CHIP[d]
                    const active = d === focusDomain
                    return (
                      <button
                        key={d}
                        onClick={() => onPickFocus(d)}
                        aria-pressed={active}
                        className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-left transition active:scale-[0.98] ${
                          active ? 'border-accent bg-accent-soft' : 'border-border bg-surface hover:border-accent/40'
                        }`}
                      >
                        <Icon size={17} className={active ? 'text-accent' : 'text-ink-muted'} />
                        <span className={`text-[14px] font-semibold ${active ? 'text-accent' : 'text-ink'}`}>{d}</span>
                        {d === recommended && (
                          <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-accent">rec</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </Card>

              {/* resume card — the "memory" payoff: paused earlier today? one tap back in */}
              {resuming && (
                <div className="rounded-3xl bg-accent-soft p-5 animate-pop">
                  <div className="flex items-center gap-2 text-accent font-bold text-[15px]">
                    <RotateCcw size={17} /> Pick up where you left off
                  </div>
                  <p className="mt-2 text-[14px] text-ink leading-relaxed">
                    You paused Day {day} {focusDomain} with <span className="font-semibold">{resumeLeft}</span> of {saved!.total} questions left. We saved your spot — nothing lost.
                  </p>
                </div>
              )}

              {/* ranked weak skills — scoped to today's chosen category */}
              <div>
                <h2 className="text-[15px] font-bold text-ink mb-3">
                  Your biggest {focusDomain} levers
                </h2>
                <div className="space-y-2">
                  {levers.map((sk, i) => (
                    <WeakRow key={sk} skill={sk} estGain={gainFor(i, gap)} />
                  ))}
                </div>
              </div>

              {/* today's minutes */}
              <div className="rounded-3xl bg-accent-soft p-5">
                <div className="flex items-center gap-2 text-accent font-bold text-[15px]">
                  <Clock size={17} /> Today · {onb.dailyMin} min · {focusDomain}
                </div>
                <ul className="mt-3 space-y-2.5">
                  <TodoLine minutes={Math.round(onb.dailyMin * 0.6)} text={`${leadFocusLabel} — drills + AI coaching`} lead />
                  <TodoLine minutes={Math.round(onb.dailyMin * 0.25)} text="Mixed review of yesterday's misses" />
                  <TodoLine minutes={onb.dailyMin - Math.round(onb.dailyMin * 0.6) - Math.round(onb.dailyMin * 0.25)} text="Timed mini-set to check your pace" />
                </ul>
              </div>

              <PrimaryButton onClick={onStartPractice}>
                {resuming ? `Resume today · ${resumeLeft} left` : `Start today · ${leadFocusLabel}`}
              </PrimaryButton>

              {/* optional sections the student opted into at onboarding */}
              {(onb.takingScience || onb.takingWriting) && (
                <Card>
                  <div className="text-[13px] font-semibold text-ink-muted mb-2">Also on your plan</div>
                  <div className="space-y-2">
                    {onb.takingScience && (
                      <OptionalRow
                        icon={<FlaskConical size={16} />}
                        label="Science"
                        detail="1 timed data-passage set / week · scored separately"
                      />
                    )}
                    {onb.takingWriting && (
                      <OptionalRow
                        icon={<PenLine size={16} />}
                        label="Writing"
                        detail="1 essay / week with rubric feedback"
                      />
                    )}
                  </div>
                  <p className="mt-2 text-[12px] text-ink-muted leading-relaxed">
                    Won't affect your Composite. Core time stays on English, Math &amp; Reading.
                  </p>
                </Card>
              )}
            </div>
          }
        />
      </div>
    </AppShell>
  )
}

function WeakRow({ skill, estGain }: { skill: Skill; estGain: number }) {
  const { icon, tone } = DOMAIN_CHIP[SKILL_DOMAIN[skill]]
  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface border border-border px-4 py-3 shadow-card">
      <div className="flex items-center gap-3">
        <IconChip icon={icon} tone={tone} size={38} />
        <div>
          <div className="text-[14px] font-semibold text-ink">{SKILL_LABEL[skill]}</div>
          <div className="text-[12px] text-ink-muted">{SKILL_DOMAIN[skill]}</div>
        </div>
      </div>
      <Pill tone="success">~+{estGain} pts</Pill>
    </div>
  )
}

function OptionalRow({ icon, label, detail }: { icon: ReactNode; label: string; detail: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-accent mt-0.5">{icon}</span>
      <div>
        <div className="text-[14px] font-semibold text-ink">{label}</div>
        <div className="text-[12px] text-ink-muted leading-snug">{detail}</div>
      </div>
    </div>
  )
}

function TodoLine({ minutes, text, lead }: { minutes: number; text: string; lead?: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      <CheckCircle2 size={17} className={lead ? 'text-accent mt-0.5' : 'text-ink-muted/50 mt-0.5'} />
      <span className="text-[14px] text-ink leading-snug">
        <span className="font-semibold tabular-nums">{minutes}′</span> · {text}
      </span>
    </li>
  )
}

// Distribute the score gap across the top weak skills — biggest lever first.
function gainFor(rank: number, gap: number): number {
  const weights = [0.5, 0.3, 0.2]
  return Math.max(1, Math.round(gap * (weights[rank] ?? 0.2)))
}
