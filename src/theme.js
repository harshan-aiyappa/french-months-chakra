import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'slate.50',
      },
    },
  },
  fonts: {
    heading: `"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    body: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
  },
  colors: {
    brand: {
      50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC',
      400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA',
      800: '#3730A3', 900: '#312E81',
    },
    accent: {
      400: '#10B981',
      500: '#059669',
    },
    slate: {
      50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1',
      400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155',
      800: '#1E293B', 900: '#0F172A',
    },
    success: { 50: '#ECFDF5', 500: '#10B981' },
    warning: { 50: '#FFFBEB', 500: '#F59E0B' },
    error: { 50: '#FEF2F2', 500: '#EF4444' },
  },
  shadows: {
    'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    'none': 'none',
    'dark-lg': 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px',
    'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    'glow-green': '0 0 20px 0px rgba(16, 185, 129, 0.5)',
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'xl',
        fontWeight: 'semibold',
      },
    },
    Alert: {
      baseStyle: {
        borderRadius: 'xl',
      },
      variants: {
        subtle: (props) => {
          const { status } = props;
          if (status === 'success') { return { container: { bg: 'success.50', color: 'success.500' } }; }
          if (status === 'warning') { return { container: { bg: 'warning.50', color: 'warning.500' } }; }
          if (status === 'error') { return { container: { bg: 'error.50', color: 'error.500' } }; }
          return { container: { bg: 'blue.50', color: 'blue.500' } };
        },
      },
    },
  },
});

export default theme;