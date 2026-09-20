import { useState } from 'react'
import type { Onboarding, Profile } from './lib/profile'
import { loadSession, clearSession } from './lib/session'
import OnboardingScreen from './screens/Onboarding'
import DiagnosticScreen from './screens/Diagnostic'
import PlanScreen from './screens/Plan'
import PracticeScreen from './screens/Practice'
import DailyCompleteScreen from './screens/DailyComplete'
import Day7Screen from './screens/Day7'

export type Step = 'onboarding' | 'diagnostic' | 'plan' | 'practice' | 'daily' | 'day7'

const DEFAULT_ONB: Onboarding = { target: 28, current: 22, weeks: 10, dailyMin: 40, takingScience: false, takingWriting: false }

export default function App() {
  // Memory: a saved unfinished session drops the student back on their plan
  // (their "home"), where a resume card waits — instead of restarting onboarding.
  const resumed = loadSession()
  const canResume = !!(resumed && resumed.profile)

  const [step, setStep] = useState<Step>(canResume ? 'plan' : 'onboarding')
  const [onb, setOnb] = useState<Onboarding>(resumed?.onb ?? DEFAULT_ONB)
  const [profile, setProfile] = useState<Profile | null>(resumed?.profile ?? null)
  const [day, setDay] = useState(resumed?.day ?? 1)

  return (
    <>
      {step === 'onboarding' && (
        <OnboardingScreen
          initial={onb}
          onStart={(next) => {
            setOnb(next)
            setStep('diagnostic')
          }}
        />
      )}

      {step === 'diagnostic' && (
        <DiagnosticScreen
          onb={onb}
          onDone={(p) => {
            setProfile(p)
            setStep('plan')
          }}
        />
      )}

      {step === 'plan' && profile && (
        <PlanScreen onb={onb} profile={profile} day={day} onStartPractice={() => setStep('practice')} />
      )}

      {step === 'practice' && profile && (
        <PracticeScreen
          onb={onb}
          profile={profile}
          day={day}
          onDone={() => setStep(day >= 7 ? 'day7' : 'daily')}
          onViewReport={() => setStep('plan')}
          onExit={() => setStep('plan')}
        />
      )}

      {step === 'daily' && profile && (
        <DailyCompleteScreen
          onb={onb}
          profile={profile}
          day={day}
          onDoneForToday={() => setStep('plan')}
          onContinue={() => {
            if (day >= 6) {
              setDay(7)
              setStep('day7')
            } else {
              setDay((d) => d + 1)
              setStep('practice')
            }
          }}
        />
      )}

      {step === 'day7' && profile && (
        <Day7Screen
          onb={onb}
          profile={profile}
          onRestart={() => {
            clearSession()
            setProfile(null)
            setDay(1)
            setStep('onboarding')
          }}
          onPractice={() => setStep('practice')}
        />
      )}
    </>
  )
}
