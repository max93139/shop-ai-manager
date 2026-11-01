/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-soft': 'var(--surface-soft)',
        'surface-sunken': 'var(--surface-sunken)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        text: 'var(--text)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-soft': 'var(--accent-soft)',
        'accent-line': 'var(--accent-line)',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['var(--font-display)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      spacing: {
        '4.5': '1.125rem',
      },
      boxShadow: {
        '2xs': '0 1px 2px rgba(28, 27, 25, 0.03)',
        xs: '0 1px 2px rgba(28, 27, 25, 0.05)',
        sm: '0 2px 4px rgba(28, 27, 25, 0.04)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glass: 'inset 0 1px 1px rgba(255, 255, 255, 0.95), 0 8px 32px rgba(28, 27, 25, 0.08)',
        'glass-bevel': 'inset 0 1px 1px rgba(255, 255, 255, 0.95)',
        'glass-hover': 'inset 0 1px 1px rgba(255, 255, 255, 1), 0 12px 40px rgba(28, 27, 25, 0.12)',
      },
    },
  },
  plugins: [],
};
