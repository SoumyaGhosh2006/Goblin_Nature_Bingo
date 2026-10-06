/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clash of Clans tactile woodland palette
        timber: {
          light: '#6A4325',
          DEFAULT: '#4A2E18',
          dark: '#2A1708',
        },
        parchment: {
          light: '#FAF2DC',
          DEFAULT: '#F5E8C7',
          dark: '#DFCE9F',
        },
        gold: {
          light: '#FED053',
          DEFAULT: '#FDB813',
          dark: '#B87B00',
        },
        action: {
          light: '#6FDE18',
          DEFAULT: '#58CC02',
          dark: '#2F7E00',
        },
        goblin: {
          light: '#94BA45',
          DEFAULT: '#7DA333',
          dark: '#4C651E',
        },
        wax: {
          light: '#F06A6A',
          DEFAULT: '#E54B4B',
          dark: '#941E1E',
        },
        forest: {
          dark: '#102418',
          DEFAULT: '#1A3826',
          light: '#264D36',
        }
      },
      boxShadow: {
        // Physical 3D bottom bevels (Supercell tactile depth)
        'bevel-timber': '0 4px 0 #2A1708',
        'bevel-green': '0 4px 0 #2F7E00',
        'bevel-gold': '0 4px 0 #B87B00',
        'bevel-wax': '0 4px 0 #941E1E',
        'parchment-slab': '0 6px 0 #DFCE9F, 0 10px 20px rgba(0,0,0,0.3)',
      }
    },
  },
  plugins: [],
}
