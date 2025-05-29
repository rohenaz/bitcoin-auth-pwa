# Authentication Configuration System

This directory contains centralized configuration for all authentication-related features in the Bitcoin Auth PWA.

## Structure

- `auth-messages.ts` - All user-facing text and error messages
- `auth.config.ts` - Time durations, validation rules, API endpoints, and feature settings
- `auth-styles.ts` - UI component styling and theme configuration
- `index.ts` - Main export file combining all configurations

## Usage

### Importing Configuration

```typescript
// Import everything
import { authConfig } from '@/lib/config';

// Import specific configurations
import { AUTH_MESSAGES, AUTH_TIME_CONFIG, PASSWORD_CONFIG } from '@/lib/config';

// Import style helpers
import { authStyles, AUTH_STYLES } from '@/lib/config/auth-styles';
```

### Using Messages

```typescript
import { AUTH_MESSAGES, getMessage } from '@/lib/config';

// Direct access
const title = AUTH_MESSAGES.titles.welcomeBack;
const error = AUTH_MESSAGES.errors.incorrectPassword;

// With interpolation
const message = getMessage('success', 'oauthTransferred', { provider: 'Google' });
// Returns: "Successfully transferred Google link"
```

### Using Styles

```typescript
import { authStyles, AUTH_STYLES } from '@/lib/config/auth-styles';

// Get dynamic button classes
const buttonClass = authStyles.getButtonClasses('primary', 'loading');

// Get input classes with error state
const inputClass = authStyles.getInputClasses(hasError, isDisabled);

// Direct style access
const labelClass = AUTH_STYLES.form.label;
```

### Using Configuration Values

```typescript
import { PASSWORD_CONFIG, AUTH_TIME_CONFIG } from '@/lib/config';

// Password validation
const { isValid, message } = PASSWORD_CONFIG.validate(password);

// Time values
const tokenTTL = AUTH_TIME_CONFIG.authTokenValidity; // 10 minutes in ms
```

## Customization

### Changing Messages

Edit `auth-messages.ts` to update any user-facing text:

```typescript
export const AUTH_MESSAGES = {
  errors: {
    incorrectPassword: 'Your custom error message',
    // ...
  }
};
```

### Modifying Styles

Edit `auth-styles.ts` to change component appearance:

```typescript
export const AUTH_STYLES = {
  button: {
    primary: {
      default: 'your-custom-classes',
      // ...
    }
  }
};
```

### Adjusting Configuration

Edit `auth.config.ts` to change behavior:

```typescript
export const PASSWORD_CONFIG = {
  minLength: 12, // Increase minimum password length
  // ...
};
```

## Environment Variables

Some configurations can be overridden by environment variables:

- `BAP_API_URL` - Override BAP API endpoint
- `PORT` - Development server port
- `NODE_ENV` - Controls error verbosity and debug features

## Adding New Configuration

1. Add the configuration to the appropriate file:
   - Messages → `auth-messages.ts`
   - Behavior/Rules → `auth.config.ts`
   - Styling → `auth-styles.ts`

2. Export from the main `index.ts` if needed

3. Update TypeScript types

4. Document the new configuration here

## Benefits

1. **Centralization** - All configuration in one place
2. **Type Safety** - Full TypeScript support
3. **Consistency** - Shared values across components
4. **Customization** - Easy to modify without touching component code
5. **Internationalization Ready** - Messages can be easily swapped
6. **Theming** - Styles can be changed globally

## Best Practices

1. Always use configuration values instead of hardcoding
2. Group related configurations together
3. Provide sensible defaults
4. Document any non-obvious configuration
5. Consider environment-specific overrides
6. Keep configuration close to where it's used

## Migration Guide

When updating existing components:

1. Replace hardcoded strings with `AUTH_MESSAGES`
2. Replace inline styles with `AUTH_STYLES`
3. Replace magic numbers with config constants
4. Test thoroughly - configuration changes affect the entire auth flow