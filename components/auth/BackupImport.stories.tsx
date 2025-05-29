import type { Meta, StoryObj } from '@storybook/react';
import BackupImport from './BackupImport';

const meta = {
  title: 'Auth/BackupImport',
  component: BackupImport,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onImport: { action: 'file-imported' },
  },
} satisfies Meta<typeof BackupImport>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onImport: () => console.log('File imported'),
  },
};

export const Disabled: Story = {
  args: {
    onImport: () => console.log('File imported'),
    disabled: true,
  },
};

export const CustomClass: Story = {
  args: {
    onImport: () => console.log('File imported'),
    className: 'mt-8',
  },
};