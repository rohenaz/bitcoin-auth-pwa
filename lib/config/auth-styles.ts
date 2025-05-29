/**
 * Authentication component style configuration
 * Centralized styling for consistent UI across auth components
 */

export const AUTH_STYLES = {
  // Layout styles
  layout: {
    container: 'min-h-screen bg-black text-white flex items-center justify-center px-4',
    maxWidth: 'max-w-md w-full',
    spacing: 'space-y-8',
    header: 'text-center',
    title: 'text-3xl font-bold mb-2',
    subtitle: 'text-gray-400',
  },
  
  // Form styles
  form: {
    container: 'space-y-4',
    fieldGroup: 'space-y-2',
    label: 'block text-sm font-medium mb-2',
    helperText: 'text-xs text-gray-500 mt-1',
    errorText: 'text-xs text-red-400 mt-1',
  },
  
  // Input styles
  input: {
    base: 'w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all',
    error: 'border-red-500 focus:ring-red-500',
    disabled: 'opacity-50 cursor-not-allowed',
    placeholder: 'placeholder-gray-500',
  },
  
  // Button styles
  button: {
    base: 'w-full py-3 px-4 rounded-lg font-medium transition-colors',
    primary: {
      default: 'bg-blue-600 hover:bg-blue-700 text-white',
      disabled: 'bg-gray-800 text-gray-600 cursor-not-allowed',
      loading: 'bg-blue-600 text-white cursor-wait',
    },
    secondary: {
      default: 'bg-gray-800 hover:bg-gray-700 text-white',
      disabled: 'bg-gray-900 text-gray-600 cursor-not-allowed',
      loading: 'bg-gray-800 text-white cursor-wait',
    },
    outline: {
      default: 'border border-gray-700 hover:border-gray-600 text-white',
      disabled: 'border-gray-800 text-gray-600 cursor-not-allowed',
      loading: 'border-gray-700 text-white cursor-wait',
    },
    text: {
      default: 'text-blue-500 hover:text-blue-400',
      disabled: 'text-gray-600 cursor-not-allowed',
      loading: 'text-blue-500 cursor-wait',
    },
  },
  
  // Card/Panel styles
  card: {
    base: 'rounded-lg p-4',
    error: 'bg-red-900/20 border border-red-900 text-red-400',
    warning: 'bg-amber-900/20 border border-amber-900',
    info: 'bg-blue-900/20 border border-blue-900 text-blue-400',
    success: 'bg-green-900/20 border border-green-900 text-green-400',
    default: 'bg-gray-900 border border-gray-800',
  },
  
  // Icon styles
  icon: {
    size: {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8',
    },
    color: {
      default: 'text-gray-400',
      primary: 'text-blue-500',
      success: 'text-green-500',
      warning: 'text-amber-500',
      error: 'text-red-500',
    },
  },
  
  // Loading states
  loading: {
    spinner: 'animate-spin rounded-full border-b-2 border-white',
    spinnerSizes: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
    overlay: 'absolute inset-0 bg-black/50 flex items-center justify-center z-50',
    inline: 'inline-block ml-2',
  },
  
  // Transitions
  transition: {
    default: 'transition-all duration-200',
    fast: 'transition-all duration-100',
    slow: 'transition-all duration-300',
    colors: 'transition-colors duration-200',
    opacity: 'transition-opacity duration-200',
    transform: 'transition-transform duration-200',
  },
  
  // Spacing scale
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
  
  // Border radius scale
  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  
  // Text styles
  text: {
    primary: 'text-white',
    secondary: 'text-gray-500',
    muted: 'text-gray-400',
    danger: 'text-red-400',
    success: 'text-green-400',
    warning: 'text-amber-400',
    info: 'text-blue-400',
  },
  
  // Shadow scale
  shadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  
  // Focus styles
  focus: {
    ring: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black',
    outline: 'focus:outline-none',
    within: 'focus-within:ring-2 focus-within:ring-blue-500',
  },
  
  // Animation keyframes
  animations: {
    fadeIn: 'animate-fadeIn',
    fadeOut: 'animate-fadeOut',
    slideIn: 'animate-slideIn',
    slideOut: 'animate-slideOut',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
  },
} as const;

// Helper functions for dynamic styling
export const authStyles = {
  // Get button classes based on variant and state
  getButtonClasses: (
    variant: 'primary' | 'secondary' | 'outline' | 'text' = 'primary',
    state: 'default' | 'disabled' | 'loading' = 'default'
  ): string => {
    const base = variant === 'text' ? '' : AUTH_STYLES.button.base;
    const variantStyles = AUTH_STYLES.button[variant][state];
    return `${base} ${variantStyles}`.trim();
  },
  
  // Get input classes based on state
  getInputClasses: (hasError = false, isDisabled = false): string => {
    const classes: string[] = [AUTH_STYLES.input.base];
    
    if (hasError) {
      classes.push(AUTH_STYLES.input.error);
    }
    
    if (isDisabled) {
      classes.push(AUTH_STYLES.input.disabled);
    }
    
    classes.push(AUTH_STYLES.input.placeholder);
    
    return classes.join(' ');
  },
  
  // Get card classes based on type
  getCardClasses: (type: keyof typeof AUTH_STYLES.card = 'default'): string => {
    return `${AUTH_STYLES.card.base} ${AUTH_STYLES.card[type]}`;
  },
  
  // Get icon classes based on size and color
  getIconClasses: (
    size: keyof typeof AUTH_STYLES.icon.size = 'md',
    color: keyof typeof AUTH_STYLES.icon.color = 'default'
  ): string => {
    return `${AUTH_STYLES.icon.size[size]} ${AUTH_STYLES.icon.color[color]}`;
  },
  
  // Get loading spinner classes
  getSpinnerClasses: (size: keyof typeof AUTH_STYLES.loading.spinnerSizes = 'md'): string => {
    return `${AUTH_STYLES.loading.spinner} ${AUTH_STYLES.loading.spinnerSizes[size]}`;
  },
};

// CSS custom properties for theming (can be overridden)
export const AUTH_CSS_VARS = `
  :root {
    /* Colors */
    --auth-primary: 59 130 246; /* blue-500 */
    --auth-primary-hover: 37 99 235; /* blue-600 */
    --auth-error: 239 68 68; /* red-500 */
    --auth-warning: 245 158 11; /* amber-500 */
    --auth-success: 34 197 94; /* green-500 */
    
    /* Backgrounds */
    --auth-bg-primary: 0 0 0; /* black */
    --auth-bg-secondary: 17 24 39; /* gray-900 */
    --auth-bg-tertiary: 31 41 55; /* gray-800 */
    
    /* Text */
    --auth-text-primary: 255 255 255; /* white */
    --auth-text-secondary: 156 163 175; /* gray-400 */
    --auth-text-tertiary: 107 114 128; /* gray-500 */
    
    /* Borders */
    --auth-border-primary: 31 41 55; /* gray-800 */
    --auth-border-secondary: 55 65 81; /* gray-700 */
    
    /* Spacing */
    --auth-space-unit: 0.25rem;
    
    /* Transitions */
    --auth-transition-fast: 100ms;
    --auth-transition-default: 200ms;
    --auth-transition-slow: 300ms;
  }
`;

// Export type-safe style getter
export type StyleCategory = keyof typeof AUTH_STYLES;
export type StyleSubCategory<T extends StyleCategory> = keyof typeof AUTH_STYLES[T];

export function getStyle<T extends StyleCategory>(
  category: T,
  subCategory?: StyleSubCategory<T>
): string | Record<string, string> {
  if (!subCategory) {
    return AUTH_STYLES[category] as Record<string, string>;
  }
  
  const categoryStyles = AUTH_STYLES[category] as Record<string, string>;
  return categoryStyles[subCategory as string] || '';
}