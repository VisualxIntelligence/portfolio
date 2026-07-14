/** Editorial Precision design tokens — see ahmed-albadri-portfolio-spec.md §2.1–2.3, §3.1 */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      paper: {
        DEFAULT: '#F7F4EF',
        2: '#EFEAE2',
      },
      ink: {
        DEFAULT: '#1A1815',
        2: '#4A4540',
      },
      bronze: {
        300: '#C89B72',
        500: '#A9744A',
        700: '#7E5334',
      },
      line: '#DDD5C9',
      neutral: {
        50: '#FBFAF7',
        100: '#F7F4EF',
        200: '#EFEAE2',
        300: '#DDD5C9',
        400: '#B7AFA3',
        500: '#8C857A',
        600: '#4A4540',
        700: '#2B2723',
        800: '#1A1815',
      },
      success: '#3F6C51',
      warn: '#B08A3E',
      error: '#9C3D2E',
      info: '#3E5F7E',
    },
    fontFamily: {
      display: ['"Space Grotesk"', 'sans-serif'],
      body: ['Inter', 'sans-serif'],
      ar: ['"IBM Plex Sans Arabic"', 'sans-serif'],
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
    },
    fontSize: {
      // px / rem / line-height per spec §2.2
      xs: ['0.75rem', { lineHeight: '1.4' }],
      sm: ['0.875rem', { lineHeight: '1.5' }],
      base: ['1rem', { lineHeight: '1.6' }],
      lg: ['1.125rem', { lineHeight: '1.6' }],
      xl: ['1.375rem', { lineHeight: '1.4' }],
      '2xl': ['1.75rem', { lineHeight: '1.3' }],
      '3xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      '4xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      '5xl': ['4rem', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
    },
    spacing: {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      6: '1.5rem',
      8: '2rem',
      12: '3rem',
      16: '4rem',
      24: '6rem',
      32: '8rem',
      px: '1px',
    },
    borderRadius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '16px',
      full: '9999px',
    },
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      maxWidth: {
        container: '1200px',
        prose: '720px',
      },
      letterSpacing: {
        lockup: '0.08em', // ALL-CAPS name lockup +8%
        display: '-0.01em',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        hover: '150ms',
        reveal: '250ms',
        hero: '400ms',
      },
    },
  },
  plugins: [],
};
