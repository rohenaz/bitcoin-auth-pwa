import type { Meta, StoryObj } from '@storybook/react';
import ErrorDisplay from './ErrorDisplay';

const meta = {
  title: 'Auth/ErrorDisplay',
  component: ErrorDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    error: 'Something went wrong. Please try again.',
  },
};

export const NoError: Story = {
  args: {
    error: undefined,
  },
};

export const LongError: Story = {
  args: {
    error: 'Invalid backup file format. The file you selected does not appear to be a valid Bitcoin backup. Please ensure you are selecting the correct file and try again.',
  },
};

export const PasswordError: Story = {
  args: {
    error: 'Incorrect password. Please try again.',
  },
};

export const NetworkError: Story = {
  args: {
    error: 'Network error: Unable to connect to server. Please check your connection and try again.',
  },
};