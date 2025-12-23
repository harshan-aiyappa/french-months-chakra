import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9',
      400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490',
      800: '#155e75', 900: '#164e63',
    },
    accent: {
      400: '#a78bfa', // Soft Purple
      500: '#8b5cf6', // Violet
      600: '#7c3aed',
    },
    surface: {
      light: 'rgba(255, 255, 255, 0.7)',
      dark: 'rgba(15, 23, 42, 0.6)',
      glass: 'rgba(255, 255, 255, 0.1)',
    },
    slate: {
      50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1',
      400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155',
      800: '#1E293B', 900: '#0F172A',
    },
    error: { 50: '#FEF2F2', 500: '#EF4444', 600: '#DC2626' },
    success: { 50: '#ECFDF5', 500: '#10B981', 600: '#059669' },
  },
  semanticTokens: {
    colors: {
      bg: {
        default: 'slate.50',
        _dark: 'slate.900',
      },
      card: {
        default: 'rgba(255, 255, 255, 0.85)',
        _dark: 'rgba(30, 41, 59, 0.7)',
      },
      text: {
        default: 'slate.800',
        _dark: 'slate.100',
      },
      textMuted: {
        default: 'slate.500',
        _dark: 'slate.400',
      },
      border: {
        default: 'rgba(255, 255, 255, 0.6)',
        _dark: 'rgba(255, 255, 255, 0.08)',
      },
      correctBg: {
        default: 'success.500',
        _dark: 'success.500',
      },
      errorBg: {
        default: 'error.500',
        _dark: 'error.500',
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: 'bg',
        color: 'text',
        backdropFilter: 'blur(20px)', // Subtle global blur potential
      },
    }),
  },
  shadows: {
    'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)', // Enhanced glass shadow
    'glow': '0 0 15px rgba(6, 182, 212, 0.5)',
    'glow-success': '0 0 20px rgba(16, 185, 129, 0.6)',
    'glow-error': '0 0 20px rgba(239, 68, 68, 0.6)',
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: '2xl',
        fontWeight: 'bold',
        transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.400' : undefined,
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          _active: {
            transform: 'translateY(0)',
          },
        }),
        glass: {
          bg: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'text',
          _hover: {
            bg: 'rgba(255, 255, 255, 0.25)',
            boxShadow: 'glass',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        bg: 'card',
        backdropFilter: 'blur(16px)',
        borderRadius: '3xl',
        border: '1px solid',
        borderColor: 'border',
        boxShadow: 'glass',
      },
    },
    Alert: {
      baseStyle: {
        borderRadius: '2xl',
      },
    },
  },
});

export default theme;
