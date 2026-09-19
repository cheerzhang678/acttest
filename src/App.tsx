import { useState } from 'react'
import type { Onboarding, Profile } from './lib/profile'
import { PhoneShell } from './components/ui'
import OnboardingScreen from './screens/Onboarding'
import DiagnosticScreen from './screens/Diagnostic'
import PlanScreen from './screens/Plan'
import PracticeScreen from './screens/Practice'
import DailyCompleteScreen from './screens/DailyComplete'
import Day7Screen from './screens/Day7'

export type Step = 'onboarding' | 'diagnostic' | 'plan' | 'practice' | 'daily' | 'day7'

const DEFAULT_ONB: Onboarding = { target: 28, current: 22, weeks: 10, dailyMin: 40 }

export default function App() {
  const [step, setStep] = useState<Step>('onboarding')
  const [onb, setOnb] = useState<Onboarding>(DEFAULT_ONB)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [day, setDay] = useState(1)

  return (
    <PhoneShell>
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
        <PlanScreen onb={onb} profile={profile} onStartPractice={() => setStep('practice')} />
      )}

      {step === 'practice' && profile && (
        <PracticeScreen
          profile={profile}
          onDone={() => setStep(day >= 7 ? 'day7' : 'daily')}
        />
      )}

      {step === 'daily' && profile && (
        <DailyCompleteScreen
          onb={onb}
          profile={profile}
          day={day}
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
            setProfile(null)
            setDay(1)
            setStep('onboarding')
          }}
          onPractice={() => setStep('practice')}
        />
      )}
    </PhoneShell>
  )
}
