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
    heading: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    body: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
  },
  colors: {
    brand: {
      50: '#F3F0FF', 100: '#E4DEFF', 200: '#D0C5FF', 300: '#B8A6FF',
      400: '#A185FF', 500: '#8964FF', 600: '#6D44E6', 700: '#5229B3',
      800: '#381680', 900: '#200A4D',
    },
    accent: {
      400: '#31C48D',
      500: '#2DB67F',
    },
    slate: {
      50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
      400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
      800: '#1e293b', 900: '#0f172a',
    },
    success: { 50: '#F0FFF4', 500: '#38A169' },
    warning: { 50: '#FFFAF0', 500: '#D69E2E' },
    error: { 50: '#FFF5F5', 500: '#C53030' },
  },
  shadows: {
    'lg': '0 10px 15px -3px rgba(15, 23, 42, 0.07), 0 4px 6px -2px rgba(15, 23, 42, 0.04)',
    'xl': '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.03)',
    '2xl': '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
    'glow-green': '0 0 20px 0px rgba(49, 196, 141, 0.5)',
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