'use client';

import { PASSWORD_CONFIG } from '@/lib/config';
import { AUTH_STYLES, authStyles } from '@/lib/config/auth-styles';
import { AUTH_MESSAGES } from '@/lib/auth-messages';

interface PasswordInputProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  showHint?: boolean;
  hintText?: string;
  autoComplete?: 'current-password' | 'new-password';
  hasError?: boolean;
}

export default function PasswordInput({
  id = 'password',
  label = AUTH_MESSAGES.labels.password,
  value,
  onChange,
  placeholder = AUTH_MESSAGES.placeholders.enterPassword,
  disabled = false,
  required = true,
  minLength = PASSWORD_CONFIG.minLength,
  showHint = false,
  hintText,
  autoComplete = 'current-password',
  hasError = false,
}: PasswordInputProps) {
  return (
    <div>
      <label htmlFor={id} className={AUTH_STYLES.form.label}>
        {label}
      </label>
      <input
        id={id}
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={authStyles.getInputClasses(hasError, disabled)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        disabled={disabled}
        autoComplete={autoComplete}
      />
      {showHint && (
        <p className={AUTH_STYLES.form.helperText}>
          {hintText || AUTH_MESSAGES.validation.passwordRequirements}
        </p>
      )}
    </div>
  );
}