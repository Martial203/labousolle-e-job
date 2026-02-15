 /** @type {import('tailwindcss').Config} */

import PrimeUI from 'tailwindcss-primeui';

export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "primary": "#0F70B7",
        "secondary": "#FFFFFF",
        "light-blue": "#F0F9FD",
        "gray": "#9199A3",
        "light-gray": "#F1F2F4",
        "input-border": "#ACACAC",
        "input-background": "#F0F1F2",
        "divide-color": "#9199A360",
        "muted-icon-background": "#E7F0FA",
      }
    },
  },
  plugins: [PrimeUI],
}
