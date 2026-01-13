/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#594ce6",
                "background-light": "#f6f6f8",
                "background-dark": "#131121",
                "accent-glow": "#7c72ff",
                "vocalis-cyan": "#00f2ff",
                "vocalis-indigo": "#4f46e5",
                "vocalis-emerald": "#10b981",
                "emerald-accent": "#10b981",
                "rose-accent": "#f43f5e",
                "glass-white": "rgba(255, 255, 255, 0.05)",
                "glass-border": "rgba(255, 255, 255, 0.1)",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
}
