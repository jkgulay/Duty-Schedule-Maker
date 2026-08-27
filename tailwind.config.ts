import type { Config } from 'tailwindcss';

/**
 * Design tokens live here, never as arbitrary values scattered in JSX.
 *
 * NOTE: shift-type colors are deliberately NOT tokens. They are
 * user-configured data (`shift_types.color_hex`) and are applied as the one
 * permitted inline style in the app.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Placeholder hospital brand palette — replace with real values.
        brand: {
          DEFAULT: '#1d4ed8',
          dark: '#1e3a8a',
          light: '#dbeafe',
        },
        // Fixed document colors from the official layout.
        'title-month': '#c00000',
        'title-ward': '#0000ff',
      },
      fontFamily: {
        document: ['Calibri', 'Carlito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
