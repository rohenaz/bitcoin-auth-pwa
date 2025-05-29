import type { Meta, StoryObj } from '@storybook/react';
import WarningCard from './WarningCard';

const meta = {
  title: 'Auth/WarningCard',
  component: WarningCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WarningCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'This password cannot be recovered. If you forget it, you\'ll lose access to your Bitcoin identity.',
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Security Notice',
    message: 'Your private keys are encrypted locally and never sent to our servers.',
  },
};

export const LongMessage: Story = {
  args: {
    title: 'Backup Warning',
    message: 'Make sure to save your backup file in a secure location. This file contains your encrypted Bitcoin wallet and is the only way to recover your funds if you lose access to this device. We recommend storing multiple copies in different secure locations.',
  },
};

export const CustomIcon: Story = {
  args: {
    title: 'Success',
    message: 'Your wallet has been successfully created.',
    icon: (
      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
};