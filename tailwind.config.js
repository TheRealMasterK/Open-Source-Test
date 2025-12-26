/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Font Family - Poppins
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },

      // Colors - QicTrader Design System
      colors: {
        // Brand Colors
        brand: {
          blue: '#00A3F6',
          'blue-light': '#38BDF8',
          'blue-dark': '#0284C7',
          orange: '#F97316',
          'orange-light': '#FB923C',
          'orange-dark': '#EA580C',
          green: '#10B981',
          'green-dark': '#059669',
          red: '#EF4444',
          'red-dark': '#DC2626',
        },

        // Trade Action Colors
        buy: {
          DEFAULT: 'var(--buy)',
          bg: 'var(--buy-bg)',
        },
        sell: {
          DEFAULT: 'var(--sell)',
          bg: 'var(--sell-bg)',
        },

        // Semantic Colors
        success: {
          DEFAULT: 'var(--success)',
          bg: 'var(--success-bg)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          bg: 'var(--warning-bg)',
        },
        error: {
          DEFAULT: 'var(--error)',
          bg: 'var(--error-bg)',
        },
        info: {
          DEFAULT: 'var(--info)',
          bg: 'var(--info-bg)',
        },

        // Crypto Colors
        crypto: {
          usdt: 'var(--crypto-usdt)',
          btc: 'var(--crypto-btc)',
          eth: 'var(--crypto-eth)',
          zar: 'var(--crypto-zar)',
        },

        // Theme Colors (using CSS variables for dynamic theming)
        background: 'var(--background)',
        'background-secondary': 'var(--background-secondary)',
        'background-gray': 'var(--background-gray)',
        'background-gray-light': 'var(--background-gray-light)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
          elevated: 'var(--card-elevated)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          dark: 'var(--primary-dark)',
          light: 'var(--primary-light)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
        },
        border: 'var(--border)',
        'border-subtle': 'var(--border-subtle)',
        input: 'var(--input)',
        'input-bg': 'var(--input-bg)',
        'input-border': 'var(--input-border)',
        ring: 'var(--ring)',
        surface: {
          DEFAULT: 'var(--surface)',
          hover: 'var(--surface-hover)',
          dark: 'var(--surface-dark)',
        },

        // Text colors
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-placeholder': 'var(--text-placeholder)',

        // Component specific
        'nav-bg': 'var(--nav-bg)',
        'tab-bar-bg': 'var(--tab-bar-bg)',
        'avatar-bg': 'var(--avatar-bg)',
        'avatar-text': 'var(--avatar-text)',
        'badge-bg': 'var(--badge-bg)',
        'badge-text': 'var(--badge-text)',
        overlay: 'var(--overlay)',

        // Chart Colors
        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)',
        },
      },

      // Border Radius - QicTrader Design
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },

      // Spacing - 4px base unit
      spacing: {
        0.5: '2px',
        1.5: '6px',
        2.5: '10px',
        3.5: '14px',
        4.5: '18px',
        5.5: '22px',
        13: '52px',
        15: '60px',
        18: '72px',
        22: '88px',
      },

      // Font Sizes
      fontSize: {
        xxs: ['10px', { lineHeight: '14px' }],
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '52px' }],
      },

      // Box Shadows
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-dark': '0 4px 12px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
