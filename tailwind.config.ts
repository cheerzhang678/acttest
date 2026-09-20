import type { Config } from 'tailwindcss'

// Palette + type aligned to Kira's brand (kira-learning.com): warm cream canvas,
// neutral near-black ink, violet brand color, Inter body + a display face for
// headlines. Deliberately NOT the cool indigo/system-font default — matching the
// mother platform avoids the "割裂感" of a bolt-on prototype.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#faf8f3', // warm cream canvas (Kira #fffdf0 / #f5f5f4 family)
        surface: '#ffffff',
        'surface-2': '#f3f1ea', // warm subtle fill
        border: '#e9e5db', // warm light gray, not cool #e6e8f0
        ink: '#1a1a1a', // neutral near-black (Kira), not blue-black #141a2e
        'ink-muted': '#6b6761', // warm gray
        accent: '#775cff', // Kira violet, not indigo #4f46e5
        'accent-soft': '#efeaff', // light violet tint
        success: '#0f9d78',
        'success-soft': '#e4f7ef',
        warn: '#d9822b',
        'warn-soft': '#fbf1df',
        danger: '#e0483d',
        'danger-soft': '#fdeceb',
        // Bright K-12 pops — sparingly, for celebration / streak / illustration only.
        pop: {
          yellow: '#ffdd0a',
          pink: '#ff80ef',
          orange: '#ff6a00',
          mint: '#56eaaf'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        display: ['"Funnel Display"', 'Inter', 'ui-sans-serif', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 3px rgba(26,26,26,0.05), 0 8px 24px rgba(26,26,26,0.05)',
        phone: '0 24px 60px rgba(26,26,26,0.16)'
      }
    }
  },
  plugins: []
} satisfies Config
