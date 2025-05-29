import type { Meta, StoryObj } from '@storybook/react';
import OAuthProviders from './OAuthProviders';

const meta = {
  title: 'Auth/OAuthProviders',
  component: OAuthProviders,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onProviderClick: { action: 'provider-clicked' },
  },
} satisfies Meta<typeof OAuthProviders>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignIn: Story = {
  args: {
    action: 'signin',
  },
};

export const Link: Story = {
  args: {
    action: 'link',
  },
};

export const WithLinkedProviders: Story = {
  args: {
    action: 'link',
    linkedProviders: ['google'],
  },
};

export const AllLinked: Story = {
  args: {
    action: 'link',
    linkedProviders: ['google', 'github'],
  },
};

export const Disabled: Story = {
  args: {
    action: 'signin',
    disabled: true,
  },
};

export const CustomCallback: Story = {
  args: {
    action: 'signin',
    callbackUrl: '/dashboard/profile',
  },
};