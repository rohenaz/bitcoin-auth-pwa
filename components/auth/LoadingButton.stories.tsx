import type { Meta, StoryObj } from '@storybook/react';
import LoadingButton from './LoadingButton';

const meta = {
  title: 'Auth/LoadingButton',
  component: LoadingButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof LoadingButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Sign In',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Cancel',
    variant: 'secondary',
  },
};

export const Loading: Story = {
  args: {
    children: 'Sign In',
    loading: true,
    loadingText: 'Signing in...',
  },
};

export const LoadingDefault: Story = {
  args: {
    children: 'Submit',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Continue',
    disabled: true,
  },
};

export const CustomLoadingText: Story = {
  args: {
    children: 'Unlock Wallet',
    loading: true,
    loadingText: 'Decrypting...',
  },
};

export const ButtonType: Story = {
  args: {
    children: 'Click Me',
    type: 'button',
  },
};