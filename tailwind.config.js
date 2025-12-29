 /** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "primary": "#0F70B7",
        "secondary": "#FFFFFF",
        "light-blue": "#F0F9FD",
        "gray": "#9199A3",
        "input-border": "#ACACAC",
        "muted-icon-background": "#E7F0FA",
      }
    },
  },
  plugins: [],
}
