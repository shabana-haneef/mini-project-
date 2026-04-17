/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dark-bg': '#020617',
                'accent-primary': '#38BDF8',
                'accent-secondary': '#C084FC',
                'glass': 'rgba(255, 255, 255, 0.05)',
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                glow: {
                    'from': { boxShadow: '0 0 20px -5px #38BDF8' },
                    'to': { boxShadow: '0 0 40px 5px #C084FC' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
