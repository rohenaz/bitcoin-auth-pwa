import type { Meta, StoryObj } from '@storybook/react';
import AuthLayout from './AuthLayout';
import PasswordInput from './PasswordInput';
import LoadingButton from './LoadingButton';
import ErrorDisplay from './ErrorDisplay';

const meta = {
  title: 'Auth/AuthLayout',
  component: AuthLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignIn: Story = {
  args: {
    title: 'Welcome Back',
    subtitle: 'Enter your password to decrypt your wallet',
    children: (
      <div className="space-y-4">
        <ErrorDisplay error="" />
        <form className="space-y-4">
          <PasswordInput
            value=""
            onChange={() => {}}
            placeholder="Enter your password"
          />
          <LoadingButton>
            Unlock Wallet
          </LoadingButton>
        </form>
      </div>
    ),
  },
};

export const SignUp: Story = {
  args: {
    title: 'Create Your Identity',
    subtitle: 'Set up your Bitcoin wallet with a secure password',
    children: (
      <div className="space-y-4">
        <form className="space-y-4">
          <PasswordInput
            value=""
            onChange={() => {}}
            placeholder="Create a strong password"
            showHint={true}
            autoComplete="new-password"
          />
          <LoadingButton>
            Continue
          </LoadingButton>
        </form>
      </div>
    ),
  },
};

export const WithError: Story = {
  args: {
    title: 'Welcome Back',
    subtitle: 'Enter your password to decrypt your wallet',
    children: (
      <div className="space-y-4">
        <ErrorDisplay error="Incorrect password. Please try again." />
        <form className="space-y-4">
          <PasswordInput
            value=""
            onChange={() => {}}
            placeholder="Enter your password"
          />
          <LoadingButton>
            Unlock Wallet
          </LoadingButton>
        </form>
      </div>
    ),
  },
};

export const Loading: Story = {
  args: {
    title: 'Welcome Back',
    subtitle: 'Enter your password to decrypt your wallet',
    children: (
      <div className="space-y-4">
        <form className="space-y-4">
          <PasswordInput
            value="••••••••"
            onChange={() => {}}
            disabled={true}
          />
          <LoadingButton loading={true} loadingText="Unlocking...">
            Unlock Wallet
          </LoadingButton>
        </form>
      </div>
    ),
  },
};