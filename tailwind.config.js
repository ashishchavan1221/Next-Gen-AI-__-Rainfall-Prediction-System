/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darker: 'rgba(6, 8, 10, 0.6)',
        cardbg: 'rgba(18, 22, 31, 0.6)',
        cardborder: 'rgba(255, 255, 255, 0.05)',
        primary: '#3B82F6',
        accent: '#8B5CF6',
        success: '#10B981',
        info: '#06B6D4',
        warning: '#F59E0B',
        danger: '#EF4444',
        'primary-subtle': 'rgba(59, 130, 246, 0.1)',
        'success-subtle': 'rgba(16, 185, 129, 0.1)',
        'info-subtle': 'rgba(6, 182, 212, 0.1)',
        'warning-subtle': 'rgba(245, 158, 11, 0.1)',
        'danger-subtle': 'rgba(239, 68, 68, 0.1)',
        secondary: '#1E293B',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
