// Domain & skill taxonomy for the ACT prep prototype.
// Kept small but real: the diagnostic and practice items are tagged so the
// Plan screen can turn answers into a defensible strength/gap profile.

// Composite is English + Math + Reading only. Science is an optional section
// scored separately, so it lives outside CoreDomain to keep it out of the
// Composite math while still being a real practice domain (with its own pace).
export type CoreDomain = 'English' | 'Math' | 'Reading'
export type Domain = CoreDomain | 'Science'

export type Skill =
  | 'subject-verb'
  | 'punctuation'
  | 'conciseness'
  | 'transitions'
  | 'rhetoric-add-delete'
  | 'rhetoric-transition'
  | 'algebra'
  | 'proportions'
  | 'statistics'
  | 'inference'
  | 'main-idea'
  | 'data-representation'

// Short, student-facing skill names (English UI).
export const SKILL_LABEL: Record<Skill, string> = {
  'subject-verb': 'Subject–Verb Agreement',
  punctuation: 'Punctuation',
  conciseness: 'Conciseness',
  transitions: 'Transitions',
  'rhetoric-add-delete': 'Add / Delete a Sentence',
  'rhetoric-transition': 'Best Opener / Transition',
  algebra: 'Algebra',
  proportions: 'Percents & Ratios',
  statistics: 'Averages & Stats',
  inference: 'Inference',
  'main-idea': 'Main Idea',
  'data-representation': 'Reading Data & Graphs'
}

export const SKILL_DOMAIN: Record<Skill, Domain> = {
  'subject-verb': 'English',
  punctuation: 'English',
  conciseness: 'English',
  transitions: 'English',
  'rhetoric-add-delete': 'English',
  'rhetoric-transition': 'English',
  algebra: 'Math',
  proportions: 'Math',
  statistics: 'Math',
  inference: 'Reading',
  'main-idea': 'Reading',
  'data-representation': 'Science'
}

export interface Choice {
  label: string // A / B / C / D
  text: string
}

// A diagnostic item: lightweight, used for adaptive early-stop profiling.
// Diagnostics only cover the Composite (English / Math / Reading).
export interface DiagItem {
  id: string
  domain: CoreDomain
  skill: Skill
  difficulty: 1 | 2 | 3
  prompt: string
  passage?: string
  underline?: string // for English: the underlined portion being revised
  choices: Choice[]
  correct: number // index into choices
}

// grammar = objective, one defensible answer → AI can speak with confidence.
// rhetoric = Production of Writing, judgment-based → AI must stay restrained.
// science = objective data interpretation → AI speaks with confidence (like grammar).
export type ItemKind = 'grammar' | 'rhetoric' | 'science'

// A small data table for Science items — the "figure" a data passage asks about.
export interface DataTable {
  caption?: string
  headers: string[]
  rows: string[][]
}

// A practice item: richer, drives the layered-feedback "key moment".
export interface PracticeItem {
  id: string
  kind: ItemKind
  domain: Domain
  skill: Skill
  difficulty: 1 | 2 | 3
  passage: string
  underline: string
  prompt: string
  choices: Choice[]
  correct: number
  distractorTrap: number // the tempting wrong answer we expect
  table?: DataTable // Science items: the data figure the question reads from
  // Layered feedback content — the heart of "when to say more, when to shut up":
  hint: string // shown after 1st wrong attempt; guides, does NOT reveal
  ruleTitle: string // the concept name
  explanation: string // shown only after struggle; rule + why
  takeaway: string // one transferable line
  confirm: string // light praise when correct — deliberately short
  // Rhetoric-only: force the AI to be restrained + auditable.
  goalQuestion?: string // reflective prompt shown first ("what is this paragraph doing?")
  aiCaveat?: string // uncertainty flag: "AI-assisted — flag it if this feels off"
}
