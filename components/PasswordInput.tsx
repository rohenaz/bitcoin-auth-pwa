'use client';

import type React from 'react';
import { Text, Flex } from '@radix-ui/themes';
import * as PasswordToggleField from '@radix-ui/react-password-toggle-field';
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons';

export interface PasswordInputProps {
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
  autoFocus?: boolean;
  className?: string;
  size?: '1' | '2' | '3';
  id?: string;
  onVisibilityChange?: (visible: boolean) => void;
  defaultVisible?: boolean;
}

export function PasswordInput({
  label,
  value,
  onChange,
  placeholder = 'Enter password',
  disabled = false,
  required = false,
  minLength,
  showHint = false,
  hintText = 'Password must be at least 8 characters',
  autoComplete = 'current-password',
  hasError = false,
  autoFocus = false,
  className = '',
  size = '2',
  id,
  onVisibilityChange,
  defaultVisible = false,
}: PasswordInputProps) {
  const inputId = id || 'password-input';

  return (
    <Flex direction="column" gap="2" className={className}>
      {label && (
        <Text as="label" htmlFor={inputId} size="2" weight="medium">
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </Text>
      )}
      
      <PasswordToggleField.Root
        defaultVisible={defaultVisible}
        onVisiblityChange={onVisibilityChange}
      >
        <div className={`rt-TextFieldRoot ${hasError ? 'rt-variant-surface rt-high-contrast' : ''}`} data-size={size}>
          <PasswordToggleField.Input
            id={inputId}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            minLength={minLength}
            className="rt-TextFieldInput"
            style={{
              paddingRight: '40px', // Make room for the toggle button
            }}
          />
          <PasswordToggleField.Toggle className="rt-TextFieldToggle">
            <PasswordToggleField.Icon
              visible={<EyeOpenIcon />}
              hidden={<EyeClosedIcon />}
            />
          </PasswordToggleField.Toggle>
        </div>
      </PasswordToggleField.Root>

      {showHint && hintText && (
        <Text size="1" color={hasError ? 'red' : 'gray'}>
          {hintText}
        </Text>
      )}
    </Flex>
  );
} 