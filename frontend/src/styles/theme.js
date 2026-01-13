import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC',
      400: '#818CF8', 500: '#594ce6', 600: '#4F46E5', 700: '#4338CA',
      800: '#3730A3', 900: '#312E81',
    },
    accent: {
      glow: '#7c72ff',
    },
    success: { 50: '#ECFDF5', 500: '#10B981', 600: '#059669' }, // Emerald 500/600
    slate: {
      50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1',
      400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155',
      800: '#1E293B', 900: '#0F172A',
    },
  },
  semanticTokens: {
    colors: {
      bg: {
        default: '#f6f6f8',
        _dark: '#131121', // background-dark from user design
      },
      card: {
        default: 'whiteAlpha.600',
        _dark: 'whiteAlpha.50',
      },
      glassBorder: {
        default: 'whiteAlpha.300',
        _dark: 'whiteAlpha.100',
      },
      text: {
        default: 'slate.900',
        _dark: 'white',
      },
      textMuted: {
        default: 'slate.500',
        _dark: 'whiteAlpha.600',
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: 'bg',
        color: 'text',
        fontFamily: 'Inter, sans-serif',
      },
      // Utility class for glassmorphism to be used in Chakra 'sx' or 'css' props
      '.glass-card': {
        bg: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(16px)',
        border: '1px solid',
        borderColor: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.4)',
        boxShadow: props.colorMode === 'dark' ? '0 8px 32px 0 rgba(0, 0, 0, 0.1)' : '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
      },
      '.glass-nav': {
        bg: props.colorMode === 'dark' ? 'rgba(13, 12, 22, 0.7)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(30px)',
        borderRight: '1px solid',
        borderColor: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      },
      '.glass-panel': {
        bg: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid',
        borderColor: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
      }
    }),
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'xl',
        fontWeight: 'bold',
      },
      variants: {
        solid: (props) => ({
          bgGradient: props.colorScheme === 'brand' ? 'linear(to-r, brand.500, #7c72ff)' : undefined,
          _hover: {
            bgGradient: props.colorScheme === 'brand' ? 'linear(to-r, brand.600, brand.500)' : undefined,
            opacity: 0.9,
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            transform: 'translateY(0)',
          }
        }),
      }
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'whiteAlpha.50',
            border: '1px solid',
            borderColor: 'whiteAlpha.100',
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px #594ce6',
              bg: 'whiteAlpha.100',
            },
            _hover: {
              bg: 'whiteAlpha.100',
            }
          }
        }
      },
      defaultProps: {
        variant: 'filled',
      }
    }
  },
});

export default theme;