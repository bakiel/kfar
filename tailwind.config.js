/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // KFAR Brand Colors
        'kfar': {
          'leaf': '#478c0b',      // Primary brand green
          'sun': '#f6af0d',       // Premium gold  
          'flame': '#c23c09',     // Energy red
          'cream': '#fef9ef',     // Background
          'soil': '#3a3a1d',      // Text/grounding
          'mint': '#cfe7c1',      // Fresh accents
        },
        // Currency themes
        'currency': {
          'ils': '#0066cc',       // Israel blue
          'usd': '#228b22',       // Dollar green
          'eur': '#003399',       // Euro blue
          'gbp': '#800080',       // Pound purple
        }
      },
      fontFamily: {
        'hebrew': ['David', 'Arial Hebrew', 'sans-serif'],
        'english': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
