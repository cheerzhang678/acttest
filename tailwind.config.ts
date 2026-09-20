import type { Config } from 'tailwindcss'

// Palette + type aligned to Kira's ACTUAL product UI (teacher/student app), not
// the marketing site. The app is a cool lavender-white canvas with a dark violet
// icon rail, violet brand accent, tinted rounded-square icon chips, and pill
// controls. Matching the real shell is what avoids the "割裂感" of a bolt-on.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f7f6fd', // cool lavender-white canvas (Kira app)
        surface: '#ffffff',
        'surface-2': '#f2f1fa', // subtle lavender fill
        border: '#eae8f4', // light lavender-gray hairline
        ink: '#1b1836', // near-black with a violet cast (Kira app text)
        'ink-muted': '#6f6a86', // muted violet-gray
        accent: '#775cff', // Kira violet
        'accent-soft': '#efeaff', // light violet tint
        rail: '#1f1147', // dark violet nav rail
        'rail-icon': '#a79fce', // idle rail icon
        success: '#0f9d78',
        'success-soft': '#e4f7ef',
        warn: '#d9822b',
        'warn-soft': '#fdf3dc',
        danger: '#e0483d',
        'danger-soft': '#fdecec',
        // Tinted icon-chip / pop accents — mirror the app's tool-card icons.
        chip: {
          pink: '#ffe6fb',
          'pink-ink': '#d434bd',
          blue: '#e7f0ff',
          'blue-ink': '#3b6ef5',
          mint: '#e2f8ef',
          'mint-ink': '#0f9d78'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        display: ['"Funnel Display"', 'Inter', 'ui-sans-serif', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(31,17,71,0.04), 0 10px 30px rgba(31,17,71,0.06)',
        rail: '0 8px 24px rgba(31,17,71,0.10)'
      }
    }
  },
  plugins: []
} satisfies Config
