import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// Define the keyframes for our animated gradient background
const keyframes = `
  @keyframes gradient-animation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      // Inject keyframes globally
      "body::before": {
        content: `""`,
        display: "none",
        animation: "gradient-animation 15s ease infinite",
      },
      body: {
        // A beautiful, subtle animated gradient for the background
        bg: mode(
          'linear-gradient(-45deg, #e0c3fc, #8ec5fc, #e0c3fc, #8ec5fc)',
          'linear-gradient(-45deg, #09203f, #537895, #09203f, #537895)'
        )(props),
        backgroundSize: '400% 400%',
        animation: 'gradient-animation 15s ease infinite',
      },
    }),
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
      400: '#00D9C0', // A vibrant teal for VAD and indicators
      500: '#00C4AD',
    },
    slate: {
      50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
      400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
      800: '#1e293b', 900: '#0f172a',
    },
  },
  shadows: {
    'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
    'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.07), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    'glow-accent': '0 0 25px 0px rgba(0, 217, 192, 0.7)',
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
    },
    // Define the style for our main container
    Container: {
      baseStyle: (props) => ({
        backdropFilter: 'blur(15px) saturate(180%)',
        bg: mode('rgba(255, 255, 255, 0.75)', 'rgba(29, 39, 53, 0.75)')(props),
        borderRadius: '2xl',
        boxShadow: 'xl',
        border: '1px solid',
        borderColor: mode('rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.1)')(props),
      }),
    },
  },
});

export default theme;