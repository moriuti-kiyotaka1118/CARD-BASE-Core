import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// Color palette
const colors = {
  // Brand colors
  brand: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  // Gray scale
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  // Accent colors
  accent: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
};

// Typography
const fonts = {
  heading: '"Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  body: '"Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: '"Roboto Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

// Component styles
const components = {
  Button: {
    baseStyle: {
      fontWeight: '500',
      borderRadius: 'lg',
      _focus: {
        boxShadow: 'none',
      },
    },
    variants: {
      solid: (props: any) => ({
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
          _disabled: {
            bg: 'brand.500',
          },
        },
        _active: {
          bg: 'brand.700',
        },
      }),
      outline: (props: any) => ({
        border: '1px solid',
        borderColor: 'gray.200',
        _hover: {
          bg: mode('gray.50', 'gray.700')(props),
        },
        _dark: {
          borderColor: 'gray.600',
        },
      }),
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: 'lg',
        _focus: {
          borderColor: 'brand.400',
          boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)',
        },
      },
    },
  },
  Card: {
    baseStyle: (props: any) => ({
      container: {
        bg: mode('white', 'gray.800')(props),
        borderRadius: 'xl',
        boxShadow: 'sm',
        border: '1px solid',
        borderColor: mode('gray.100', 'gray.700')(props),
        transition: 'all 0.2s',
        _hover: {
          boxShadow: 'md',
          transform: 'translateY(-2px)',
        },
      },
    }),
  },
  Container: {
    baseStyle: {
      maxW: 'container.xl',
      px: { base: 4, md: 6 },
    },
  },
};

// Global styles
const styles = {
  global: (props: any) => ({
    body: {
      bg: mode('gray.50', 'gray.900')(props),
      color: mode('gray.800', 'whiteAlpha.900')(props),
      fontFeatureSettings: '"pnum" on, "lnum" on',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    'html, body': {
      minHeight: '100vh',
    },
    '#root': {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    },
  }),
};

// Theme configuration
const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

// Create the theme
const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  styles,
  shadows: {
    outline: '0 0 0 3px var(--chakra-colors-brand-100)',
  },
});

export default theme;
