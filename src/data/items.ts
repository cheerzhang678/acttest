import type { DiagItem, PracticeItem } from '../types'

// ---------------------------------------------------------------------------
// Diagnostic bank — a short *adaptive* diagnostic (not a full mock test).
// Items span English / Math / Reading and three difficulty tiers so the engine
// can climb or drop with the student's answers, then early-stop on confidence.
// ---------------------------------------------------------------------------

export const DIAG_ITEMS: DiagItem[] = [
  {
    id: 'd-en-1',
    domain: 'English',
    skill: 'subject-verb',
    difficulty: 2,
    prompt: 'Which choice best fits the underlined portion?',
    passage:
      "The collection of vintage cameras on the museum's east wall attract visitors from around the world.",
    underline: 'attract',
    choices: [
      { label: 'A', text: 'NO CHANGE' },
      { label: 'B', text: 'attracts' },
      { label: 'C', text: 'are attracting' },
      { label: 'D', text: 'have attracted' }
    ],
    correct: 1
  },
  {
    id: 'd-en-2',
    domain: 'English',
    skill: 'conciseness',
    difficulty: 1,
    prompt: 'Which choice is most concise?',
    passage: 'The two scientists collaborated together on the study.',
    underline: 'collaborated together',
    choices: [
      { label: 'A', text: 'NO CHANGE' },
      { label: 'B', text: 'collaborated' },
      { label: 'C', text: 'collaborated jointly together' },
      { label: 'D', text: 'collaborated together as a team' }
    ],
    correct: 1
  },
  {
    id: 'd-en-3',
    domain: 'English',
    skill: 'punctuation',
    difficulty: 3,
    prompt: 'Which choice best fits the underlined portion?',
    passage: 'After the long hike up the ridge we finally reached the summit before sunset.',
    underline: 'ridge we',
    choices: [
      { label: 'A', text: 'NO CHANGE' },
      { label: 'B', text: 'ridge, we' },
      { label: 'C', text: 'ridge; we' },
      { label: 'D', text: 'ridge: we' }
    ],
    correct: 1
  },
  {
    id: 'd-en-4',
    domain: 'English',
    skill: 'transitions',
    difficulty: 2,
    prompt: 'Which transition best fits the logic between the sentences?',
    passage:
      'The new bridge was scheduled to open in June. ____ unexpected structural problems delayed it until September.',
    underline: '____',
    choices: [
      { label: 'A', text: 'Therefore,' },
      { label: 'B', text: 'However,' },
      { label: 'C', text: 'Similarly,' },
      { label: 'D', text: 'For instance,' }
    ],
    correct: 1
  },
  {
    id: 'd-ma-1',
    domain: 'Math',
    skill: 'algebra',
    difficulty: 1,
    prompt: 'If 3x − 7 = 14, what is the value of x?',
    choices: [
      { label: 'A', text: '5' },
      { label: 'B', text: '7' },
      { label: 'C', text: '21' },
      { label: 'D', text: '3' }
    ],
    correct: 1
  },
  {
    id: 'd-ma-2',
    domain: 'Math',
    skill: 'proportions',
    difficulty: 2,
    prompt: 'A shirt priced at $40 is on sale for 25% off. What is the sale price?',
    choices: [
      { label: 'A', text: '$10' },
      { label: 'B', text: '$15' },
      { label: 'C', text: '$30' },
      { label: 'D', text: '$35' }
    ],
    correct: 2
  },
  {
    id: 'd-ma-3',
    domain: 'Math',
    skill: 'algebra',
    difficulty: 3,
    prompt: 'If x² − 5x + 6 = 0 and x > 2, what is the value of x?',
    choices: [
      { label: 'A', text: '1' },
      { label: 'B', text: '2' },
      { label: 'C', text: '3' },
      { label: 'D', text: '6' }
    ],
    correct: 2
  },
  {
    id: 'd-ma-4',
    domain: 'Math',
    skill: 'statistics',
    difficulty: 2,
    prompt:
      'The average of 5 numbers is 12. Four of them are 10, 11, 13, and 14. What is the fifth number?',
    choices: [
      { label: 'A', text: '10' },
      { label: 'B', text: '11' },
      { label: 'C', text: '12' },
      { label: 'D', text: '14' }
    ],
    correct: 2
  },
  {
    id: 'd-re-1',
    domain: 'Reading',
    skill: 'inference',
    difficulty: 2,
    prompt: "The phrase 'scattered like startled birds' most nearly suggests that Maya:",
    passage:
      'Maya had rehearsed her speech a dozen times, yet as she stepped onto the stage her prepared words scattered like startled birds. She gripped the podium, took a breath, and began — not with her script, but with the truth.',
    choices: [
      { label: 'A', text: 'forgot her speech was that day' },
      { label: 'B', text: 'suddenly lost her memorized words' },
      { label: 'C', text: 'was frightened by the audience' },
      { label: 'D', text: 'spoke more quickly than planned' }
    ],
    correct: 1
  },
  {
    id: 'd-re-2',
    domain: 'Reading',
    skill: 'main-idea',
    difficulty: 3,
    prompt: 'The passage is primarily concerned with:',
    passage:
      'For decades the reef had been mapped only from boats. Then divers began cataloging it inch by inch, and the maps they drew revealed channels and nurseries no surface survey had ever caught. The reef had not changed; our way of seeing it had.',
    choices: [
      { label: 'A', text: 'the dangers divers face while mapping reefs' },
      { label: 'B', text: 'how closer observation can transform understanding' },
      { label: 'C', text: 'why boats are poor tools for research' },
      { label: 'D', text: 'the decline of coral reefs over decades' }
    ],
    correct: 1
  }
]

// ---------------------------------------------------------------------------
// Practice bank — the daily-practice set (key moment #2).
// Grammar items: objective → the AI can explain with confidence.
// Rhetoric items (Production of Writing): judgment-based → the AI stays
// restrained: it reflects the goal back, cites the passage instead of asserting,
// and flags its own uncertainty. This is the contrast the design turns on.
// ---------------------------------------------------------------------------

export const PRACTICE_ITEMS: PracticeItem[] = [
  {
    id: 'p-en-1',
    kind: 'grammar',
    domain: 'English',
    skill: 'subject-verb',
    difficulty: 2,
    passage:
      "The collection of vintage cameras on the museum's east wall attract visitors from around the world every year.",
    underline: 'attract',
    prompt: 'Which choice best fits the underlined portion?',
    choices: [
      { label: 'A', text: 'NO CHANGE' },
      { label: 'B', text: 'attracts' },
      { label: 'C', text: 'are attracting' },
      { label: 'D', text: 'were attracting' }
    ],
    correct: 1,
    distractorTrap: 0,
    hint: "Quick — what's the actual subject here? Is it the collection, or the cameras?",
    ruleTitle: 'Subject–Verb Agreement',
    explanation:
      'The subject is "the collection" (singular). "of vintage cameras" just describes it — it\'s not the subject. Singular subject → singular verb → attracts.',
    takeaway: "Don't let the words between the subject and verb fool you. Strip them out, find the real subject.",
    confirm: 'Yep — "collection" is singular, so "attracts."'
  },
  {
    id: 'p-en-2',
    kind: 'grammar',
    domain: 'English',
    skill: 'conciseness',
    difficulty: 1,
    passage: 'The two engineers collaborated together on a bridge that spanned the widest part of the river.',
    underline: 'collaborated together',
    prompt: 'Which choice is most concise?',
    choices: [
      { label: 'A', text: 'NO CHANGE' },
      { label: 'B', text: 'collaborated' },
      { label: 'C', text: 'collaborated together jointly' },
      { label: 'D', text: 'worked together in collaboration' }
    ],
    correct: 1,
    distractorTrap: 0,
    hint: 'What does "collaborate" already mean? Is "together" adding anything?',
    ruleTitle: 'Cut the Redundancy',
    explanation:
      '"Collaborate" already means working together. Adding "together" or "jointly" just repeats it. When the meaning is the same, ACT wants the shortest option.',
    takeaway: 'Spot the repeats — collaborate together, return back, past history — and cut the extra word.',
    confirm: 'Nice — "collaborate" already means together, so just "collaborated."'
  },
  {
    id: 'p-en-3',
    kind: 'grammar',
    domain: 'English',
    skill: 'punctuation',
    difficulty: 3,
    passage: 'After the long hike up the ridge we finally reached the summit just before sunset.',
    underline: 'ridge we',
    prompt: 'Which choice best fits the underlined portion?',
    choices: [
      { label: 'A', text: 'NO CHANGE' },
      { label: 'B', text: 'ridge, we' },
      { label: 'C', text: 'ridge; we' },
      { label: 'D', text: 'ridge — we' }
    ],
    correct: 1,
    distractorTrap: 2,
    hint: 'Can "After the long hike up the ridge" stand alone as a sentence? What goes between it and the main part?',
    ruleTitle: 'Comma After an Intro Phrase',
    explanation:
      '"After the long hike up the ridge" is an intro phrase, not a full sentence, so it takes a comma before the main clause. A semicolon only joins two things that could each stand alone — the first half here can\'t.',
    takeaway: 'Semicolons join two complete sentences. Intro phrases just take a comma.',
    confirm: 'Right — intro phrase gets a comma; semicolons need two full sentences.'
  },
  {
    id: 'p-en-4',
    kind: 'rhetoric',
    domain: 'English',
    skill: 'rhetoric-transition',
    difficulty: 2,
    passage:
      'Some communities plant flowers for decoration. The community garden began with a single raised bed behind the library. Within three years it had grown to forty plots, tended by families from every corner of the neighborhood.',
    underline: 'Some communities plant flowers for decoration.',
    prompt: 'Which choice most effectively opens the paragraph?',
    choices: [
      { label: 'A', text: 'NO CHANGE' },
      { label: 'B', text: "What starts small doesn't always stay small." },
      { label: 'C', text: 'The library was originally built in 1962.' },
      { label: 'D', text: 'Gardening can be exhausting in the summer heat.' }
    ],
    correct: 1,
    distractorTrap: 0,
    goalQuestion: 'Before you pick — what story is this paragraph actually telling? (one bed → forty plots)',
    hint: 'Which opener sets up where the paragraph goes, not just something garden-ish?',
    ruleTitle: 'The opener sets up the paragraph',
    explanation:
      'The paragraph traces one bed growing into forty plots — a small-to-big arc. B previews exactly that. A and D are true, but they don\'t set up where the paragraph goes; C is off-topic.',
    takeaway: "For 'best opener' questions, match the sentence to what the paragraph goes on to do — not just the topic.",
    aiCaveat: 'Rhetoric questions are judgment calls, so I\'ll walk you through the reasoning from the passage instead of just declaring an answer. Read it differently? Flag it.',
    confirm: 'Good call — B sets up the small-to-big arc the paragraph delivers.'
  },
  {
    id: 'p-en-5',
    kind: 'rhetoric',
    domain: 'English',
    skill: 'rhetoric-add-delete',
    difficulty: 3,
    passage:
      'The team spent months testing the new rover on desert terrain. The engineers also enjoyed camping on the weekends. The trials exposed a flaw in the wheels that could have doomed the mission.',
    underline: 'The engineers also enjoyed camping on the weekends.',
    prompt: 'The writer is considering deleting the underlined sentence. Should it be kept or deleted, and why?',
    choices: [
      { label: 'A', text: 'Kept — it adds a relatable personal detail about the team.' },
      { label: 'B', text: 'Kept — it explains why the team chose the desert.' },
      { label: 'C', text: 'Deleted — it pulls focus from the paragraph\'s point about the rover trials.' },
      { label: 'D', text: 'Deleted — camping is never mentioned again in the essay.' }
    ],
    correct: 2,
    distractorTrap: 3,
    goalQuestion: 'First: what is this paragraph focused on? (the rover trials and the flaw they found)',
    hint: 'Does the sentence serve that focus or wander off it? And check the *reason* in each option carefully.',
    ruleTitle: 'Add/Delete = does it serve the focus',
    explanation:
      'The paragraph is about the rover trials and the flaw they exposed. A weekend-camping detail wanders off, so it should go — that\'s C. D deletes it too, but for the wrong reason: "never mentioned again" isn\'t why it\'s irrelevant. On ACT the reason has to be right too.',
    takeaway: "Add/Delete isn't about whether a fact is true — it's whether it serves the paragraph's job. Pick the right conclusion AND the right reason.",
    aiCaveat: 'Judgment call again — here\'s how I read the paragraph\'s focus. Push back if you see it another way.',
    confirm: 'Exactly — off-topic detail, and C nails the reason (focus), not just "never mentioned again."'
  },
  // Science data-passage item. Only shown when the student opts into Science at
  // onboarding (it's an optional section, scored separately from the Composite).
  // Data interpretation is objective — one defensible answer — so the AI coaches
  // with confidence, like a grammar item (kind: 'science' behaves like grammar;
  // no rhetoric restraint). The figure is a real table the question reads from.
  {
    id: 'p-sci-1',
    kind: 'science',
    domain: 'Science',
    skill: 'data-representation',
    difficulty: 2,
    passage:
      'Students measured how much of a salt dissolves in 100 g of water at several temperatures. Their results are shown in Table 1.',
    underline: '',
    table: {
      caption: 'Table 1 — Solubility of the salt vs. water temperature',
      headers: ['Temperature (°C)', 'Solubility (g per 100 g water)'],
      rows: [
        ['10', '20'],
        ['20', '32'],
        ['30', '46'],
        ['40', '64'],
        ['50', '86']
      ]
    },
    prompt:
      'Based on Table 1, the solubility of the salt at 25 °C would most likely be closest to:',
    choices: [
      { label: 'A', text: '20 g' },
      { label: 'B', text: '32 g' },
      { label: 'C', text: '39 g' },
      { label: 'D', text: '64 g' }
    ],
    correct: 2,
    distractorTrap: 1,
    hint: '25 °C falls between two rows in the table. What are the solubility values just below and just above it?',
    ruleTitle: 'Interpolate between data points',
    explanation:
      'The table jumps from 32 g at 20 °C to 46 g at 30 °C. 25 °C sits halfway between those rows, so the value is about halfway between them — roughly 39 g. B (32) just copies the 20 °C row, but solubility keeps climbing as temperature rises.',
    takeaway: "When a value lands between two rows, estimate between them — don't just grab the nearest row.",
    confirm: 'Right — 25 °C is between 20° and 30°, so solubility is about 39 g.'
  },
  // --- Math practice items. Objective computation → the AI coaches with
  //     confidence (kind: 'math' behaves like grammar; no rhetoric restraint). ---
  {
    id: 'p-ma-1',
    kind: 'math',
    domain: 'Math',
    skill: 'algebra',
    difficulty: 1,
    passage: '',
    underline: '',
    prompt: 'If 3x − 7 = 14, what is the value of x?',
    choices: [
      { label: 'A', text: '3' },
      { label: 'B', text: '7' },
      { label: 'C', text: '21' },
      { label: 'D', text: '9' }
    ],
    correct: 1,
    distractorTrap: 3,
    hint: "What's the first move to get x by itself — deal with the −7 or the ×3 first?",
    ruleTitle: 'Undo operations in reverse',
    explanation:
      'Add 7 to both sides first: 3x = 21. Then divide by 3: x = 7. D (9) comes from dividing 14 by 3 and rounding — but you have to undo the −7 before the ×3.',
    takeaway: 'Isolate the variable by undoing operations in reverse order: addition/subtraction first, then multiplication/division.',
    confirm: 'Yep — add 7, then divide by 3: x = 7.'
  },
  {
    id: 'p-ma-2',
    kind: 'math',
    domain: 'Math',
    skill: 'proportions',
    difficulty: 2,
    passage: '',
    underline: '',
    prompt: 'A jacket priced at $40 is on sale for 25% off. What is the sale price?',
    choices: [
      { label: 'A', text: '$10' },
      { label: 'B', text: '$15' },
      { label: 'C', text: '$30' },
      { label: 'D', text: '$35' }
    ],
    correct: 2,
    distractorTrap: 0,
    hint: '25% off means you pay what fraction of the original? Find that, not just the discount.',
    ruleTitle: 'Percent off = pay the rest',
    explanation:
      "25% of $40 is $10 — but that's the discount, not the price. A (10) stops there. You pay the other 75%: $40 − $10 = $30, or 0.75 × 40 = $30.",
    takeaway: 'For "% off," either subtract the discount or multiply by (100 − %). The answer is what you pay, not what you save.',
    confirm: 'Right — 25% off $40 is a $10 discount, so you pay $30.'
  },
  // --- Reading practice items. One defensible answer grounded in the passage →
  //     the AI coaches with confidence, citing the line (kind: 'reading'). ---
  {
    id: 'p-re-1',
    kind: 'reading',
    domain: 'Reading',
    skill: 'inference',
    difficulty: 2,
    passage:
      'Maya had rehearsed her speech a dozen times, yet as she stepped onto the stage her prepared words scattered like startled birds. She gripped the podium, took a breath, and began — not with her script, but with the truth.',
    underline: '',
    prompt: "The phrase 'scattered like startled birds' most nearly suggests that Maya:",
    choices: [
      { label: 'A', text: 'forgot her speech was that day' },
      { label: 'B', text: 'suddenly lost her memorized words' },
      { label: 'C', text: 'was frightened by the audience' },
      { label: 'D', text: 'spoke more quickly than planned' }
    ],
    correct: 1,
    distractorTrap: 2,
    hint: "The birds are her 'prepared words.' What happens to words that scatter the moment she's on stage?",
    ruleTitle: 'Read the image, then map it back',
    explanation:
      'The metaphor describes her "prepared words" — so it\'s about the words, not her feelings. Words that "scatter like startled birds" vanish suddenly: she lost her memorized lines (B). C is tempting because the stage is scary, but the image is about the words, not fear.',
    takeaway: "For figurative-language questions, pin down what the image refers to, then translate the image literally — don't jump to the mood.",
    confirm: 'Exactly — the image is about her words vanishing, so B.'
  },
  {
    id: 'p-re-2',
    kind: 'reading',
    domain: 'Reading',
    skill: 'main-idea',
    difficulty: 3,
    passage:
      'For decades the reef had been mapped only from boats. Then divers began cataloging it inch by inch, and the maps they drew revealed channels and nurseries no surface survey had ever caught. The reef had not changed; our way of seeing it had.',
    underline: '',
    prompt: 'The passage is primarily concerned with:',
    choices: [
      { label: 'A', text: 'the dangers divers face while mapping reefs' },
      { label: 'B', text: 'how closer observation can transform understanding' },
      { label: 'C', text: 'why boats are poor tools for research' },
      { label: 'D', text: 'the decline of coral reefs over decades' }
    ],
    correct: 1,
    distractorTrap: 2,
    hint: 'The last line is the giveaway: "The reef had not changed; our way of seeing it had." What\'s that about?',
    ruleTitle: 'Main idea = the whole arc, not one detail',
    explanation:
      'The closing line states the point outright: what changed was how we see, not the reef. That\'s B. C (boats are poor tools) is just one detail on the way there; the passage isn\'t about boats, it\'s about observation changing understanding.',
    takeaway: 'Main-idea answers cover the whole passage. If a choice only fits one sentence, it\'s a detail, not the main idea.',
    confirm: "Right — the last line says it: our way of seeing changed, not the reef."
  }
]

