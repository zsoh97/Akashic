// Base color palette
export const palette = {
  // Primary brand color - Bronze
  primary: {
    50: '#f9f4e8',
    100: '#f0e6c8',
    200: '#e6d7a7',
    300: '#d9c386',
    400: '#ccaf65',
    500: '#bf9b44', // Base primary color
    600: '#a68539',
    700: '#8c6f2e',
    800: '#735a23',
    900: '#594618',
  },
  
  // Secondary color - Gold
  secondary: {
    50: '#fdf7e2',
    100: '#faefc5',
    200: '#f7e6a8',
    300: '#f4dd8b',
    400: '#f1d46e',
    500: '#eecb51', // Base secondary color
    600: '#d9b749',
    700: '#c4a341',
    800: '#af8f39',
    900: '#9a7b31',
  },
  
  // Accent color - Sepia
  accent: {
    50: '#fcf9eb',
    100: '#f8f0d2',
    200: '#f3e6b9',
    300: '#eeda9f',
    400: '#e8ce86',
    500: '#e2c26d', // Base accent color
    600: '#c9a961',
    700: '#b09055',
    800: '#977749',
    900: '#7e5e3d',
  },
  
  // Background color - Warm White
  background: {
    50: '#fefcf7',
    100: '#fdf9ee',
    200: '#fcf6e6',
    300: '#fbf3dd',
    400: '#faf0d5',
    500: '#f9edcc',
    600: '#f8eac3',
    700: '#f7e7bb',
    800: '#f6e4b2',
    900: '#f5e1aa',
  },
  
  // Neutral colors
  neutral: {
    50: '#f7f7f7',
    100: '#e3e3e3',
    200: '#c8c8c8',
    300: '#a4a4a4',
    400: '#818181',
    500: '#666666',
    600: '#515151',
    700: '#434343',
    800: '#383838',
    900: '#121212',
  },
};

// Semantic color mapping
export const semanticColors = {
  // UI Elements
  button: {
    primary: palette.primary[500],
    primaryHover: palette.primary[600],
    primaryActive: palette.primary[700],
    secondary: palette.secondary[500],
    secondaryHover: palette.secondary[600],
    secondaryActive: palette.secondary[700],
    ghost: palette.primary[600],
    ghostHover: palette.primary[50],
  },
  
  // Text
  text: {
    primary: palette.neutral[800],
    secondary: palette.neutral[600],
    accent: palette.primary[600],
    inverse: palette.background[50],
    link: palette.primary[600],
    linkHover: palette.primary[700],
  },
  
  // Backgrounds
  bg: {
    main: palette.background[50],
    card: 'white',
    sidebar: palette.background[50],
    active: palette.primary[100],
    hover: palette.background[100],
  },
  
  // Borders
  border: {
    light: palette.primary[200],
    medium: palette.primary[300],
    dark: palette.primary[400],
  },
  
  // Status
  status: {
    success: '#38A169',
    error: '#E53E3E',
    warning: palette.secondary[500],
    info: '#3182CE',
  },
  
  // Badges and Tags
  badge: {
    bg: palette.secondary[500],
    text: palette.primary[900],
  },
  
  // Shadows
  shadow: {
    bookCover: 'rgba(193, 155, 68, 0.2)',
    bookCoverDark: 'rgba(0, 0, 0, 0.4)',
  },
};

// Export named colors for backward compatibility
export const colors = {
  bronze: palette.primary,
  gold: palette.secondary,
  sepia: palette.accent,
  warmWhite: palette.background,
};

export default colors; 