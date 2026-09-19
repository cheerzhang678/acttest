import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f6f7fb',
        surface: '#ffffff',
        'surface-2': '#f1f3f9',
        border: '#e6e8f0',
        ink: '#141a2e',
        'ink-muted': '#6b7385',
        accent: '#4f46e5',
        'accent-soft': '#eef0ff',
        success: '#0f9d78',
        'success-soft': '#e6f6f0',
        warn: '#d9822b',
        'warn-soft': '#fbf0e2',
        danger: '#e0483d',
        'danger-soft': '#fdeceb'
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 3px rgba(20,26,46,0.06), 0 8px 24px rgba(20,26,46,0.06)',
        phone: '0 24px 60px rgba(20,26,46,0.18)'
      }
    }
  },
  plugins: []
} satisfies Config
