/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        primary: token('primary'),
        secondary: token('secondary'),
        accent: token('accent'),
        warm: token('warm'),
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Nunito', 'Noto Sans Devanagari', 'Noto Sans Gurmukhi', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgb(var(--shadow) / 0.25)',
        lift: '0 18px 40px -16px rgb(var(--shadow) / 0.35)',
      },
      backgroundImage: {
        'pastel-hero': 'linear-gradient(135deg, rgb(var(--primary)) 0%, rgb(var(--secondary)) 50%, rgb(var(--accent)) 100%)',
        'pastel-warm': 'linear-gradient(135deg, rgb(var(--warm)) 0%, rgb(var(--primary)) 100%)',
      },
    },
  },
  plugins: [],
};
