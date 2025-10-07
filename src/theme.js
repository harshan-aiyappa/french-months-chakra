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
    success: { 50: '#F0FFF4', 200: '#9AE6B4', 500: '#38A169' },
    warning: { 50: '#FFFAF0', 200: '#FBD38D', 500: '#D69E2E' },
    error: { 50: '#FFF5F5', 200: '#FEB2B2', 500: '#C53030' },
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
      variants: {
        solid: (props) => {
          if (props.colorScheme === 'brand') {
            return {
              bg: 'brand.500', color: 'white',
              _hover: { bg: 'brand.600', boxShadow: 'xl', transform: 'translateY(-2px)' },
              _active: { bg: 'brand.700', transform: 'translateY(0)' },
            };
          }
          return {};
        },
        ghost: (props) => {
          if (props.colorScheme === 'brand') {
            return { color: 'brand.600', _hover: { bg: 'brand.50' } };
          }
          return {};
        },
      },
    },


    Heading: {
      baseStyle: {
        color: 'slate.800',
        fontWeight: 'bold',
      },
    },
    Text: {
      baseStyle: {
        color: 'slate.700',
      },
    },
    Progress: {
      baseStyle: {
        track: {
          bg: 'slate.200',
        },
      },
    },
    Container: {
      baseStyle: {
        bg: 'white',
        borderRadius: '2xl',
        boxShadow: 'xl',
        border: '1px',
        borderColor: 'slate.200',
      },
    },
    Alert: {
      variants: {
        glass: (props) => {
          const { status } = props;
          const isDark = props.colorMode === 'dark';
          const bg = isDark
            ? status === 'success' ? 'rgba(49, 151, 105, 0.8)' :
              status === 'error' ? 'rgba(197, 48, 48, 0.8)' :
                status === 'warning' ? 'rgba(180, 131, 28, 0.8)' :
                  'rgba(43, 108, 176, 0.8)'
            : status === 'success' ? 'rgba(76, 175, 80, 0.8)' :
              status === 'error' ? 'rgba(229, 62, 62, 0.8)' :
                status === 'warning' ? 'rgba(237, 137, 54, 0.8)' :
                  'rgba(49, 130, 206, 0.8)';

          return {
            container: {
              backdropFilter: 'blur(10px)',
              bg: bg,
              color: 'white',
              borderRadius: 'xl',
              boxShadow: 'lg',
              border: '1px solid',
              borderColor: 'whiteAlpha.300',
              p: 4,
            },
            icon: {
              color: 'white',
            },
            title: {
              fontWeight: 'bold',
            },
            description: {
              fontSize: 'sm',
            },
          };
        },
      },
    },
  },
});

export default theme;