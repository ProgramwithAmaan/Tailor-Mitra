// @type {import('tailwindcss').Config}
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#f8fcff',
        header: '#0f172a',
        primary: '#2563eb',
        success: '#0f766e',
        text: '#0f172a',
        // Keep existing colors for compatibility
        secondary: '#60a5fa',
        accent: '#dbeafe',
        dark: '#0f172a',
        light: '#f8fcff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}