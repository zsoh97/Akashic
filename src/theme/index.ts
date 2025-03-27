import { extendTheme } from '@chakra-ui/react';
import { colors, semanticColors, palette } from './colors';

// Custom component styles using semantic colors
const components = {
  Button: {
    variants: {
      solid: {
        bg: semanticColors.button.primary,
        color: 'white',
        _hover: {
          bg: semanticColors.button.primaryHover,
        },
        _active: {
          bg: semanticColors.button.primaryActive,
        },
      },
      outline: {
        borderColor: semanticColors.button.primary,
        color: semanticColors.button.primary,
        _hover: {
          bg: semanticColors.button.ghostHover,
        },
      },
      ghost: {
        color: semanticColors.button.ghost,
        _hover: {
          bg: semanticColors.button.ghostHover,
        },
      },
    },
  },
  Heading: {
    baseStyle: {
      color: semanticColors.text.primary,
    },
  },
  Link: {
    baseStyle: {
      color: semanticColors.text.link,
      _hover: {
        color: semanticColors.text.linkHover,
        textDecoration: 'none',
      },
    },
  },
  Tag: {
    variants: {
      subtle: {
        bg: palette.primary[100],
        color: palette.primary[800],
      },
    },
  },
  Badge: {
    variants: {
      solid: {
        bg: semanticColors.badge.bg,
        color: semanticColors.badge.text,
      },
    },
  },
};

// Global styles
const styles = {
  global: {
    body: {
      bg: semanticColors.bg.main,
      color: semanticColors.text.primary,
    },
  },
};

// Default properties
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Create the theme
const theme = extendTheme({
  colors,
  components,
  styles,
  config,
});

export default theme; 