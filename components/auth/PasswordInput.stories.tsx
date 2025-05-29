import type { Meta, StoryObj } from '@storybook/react';
import PasswordInput from './PasswordInput';

const meta = {
  title: 'Auth/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    placeholder: 'Enter your password',
    onChange: () => {},
  },
};

export const WithValue: Story = {
  args: {
    value: 'mypassword123',
    placeholder: 'Enter your password',
    onChange: () => {},
  },
};

export const WithHint: Story = {
  args: {
    value: '',
    placeholder: 'Create a strong password',
    showHint: true,
    autoComplete: 'new-password',
    onChange: () => {},
  },
};

export const CustomHint: Story = {
  args: {
    value: '',
    placeholder: 'Create a secure password',
    showHint: true,
    hintText: 'Use a mix of letters, numbers, and symbols',
    minLength: 12,
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    value: 'disabled-input',
    disabled: true,
    onChange: () => {},
  },
};

export const DifferentLabels: Story = {
  args: {
    value: '',
    label: 'Encryption Password',
    placeholder: 'Secure your Bitcoin keys',
    showHint: true,
    hintText: 'This password encrypts your Bitcoin wallet',
    onChange: () => {},
  },
};