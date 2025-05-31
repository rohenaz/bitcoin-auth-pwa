/**
 * Layout Component Demos
 */

import React from 'react';
import { 
  AuthLayout,
  CenteredLayout,
  LoadingLayout,
  ErrorLayout,
  SuccessLayout,
  LoginForm
} from 'bitcoin-auth-ui';
import type { ComponentDemo } from './index';

export const layoutDemos: Array<[string, ComponentDemo]> = [
  [
    'auth-layout',
    {
      id: 'auth-layout',
      render: () => (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white" style={{ height: '300px' }}>
          <div className="h-full flex flex-col">
            <div className="text-center py-4 bg-gray-50 border-b">
              <h1 className="text-xl font-semibold">AuthLayout Demo</h1>
            </div>
            <div className="flex-1 p-8 text-center">
              <h2 className="text-lg mb-4">Full-page authentication layout</h2>
              <p className="text-gray-600">Contains header, main content, and footer areas</p>
            </div>
            <div className="text-center py-2 bg-gray-50 border-t text-sm text-gray-600">
              © AuthLayout Footer
            </div>
          </div>
        </div>
      )
    }
  ],
  [
    'centered-layout',
    {
      id: 'centered-layout',
      render: () => (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-900" style={{ height: '250px' }}>
          <div className="h-full flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-white text-center">
              <h2 className="text-lg mb-3">CenteredLayout Demo</h2>
              <p className="text-gray-300 text-sm">Content perfectly centered with dark theme</p>
            </div>
          </div>
        </div>
      )
    }
  ],
  [
    'loading-layout',
    {
      id: 'loading-layout',
      render: () => (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white" style={{ height: '200px' }}>
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin text-2xl mb-3">⟳</div>
              <p className="text-gray-600">LoadingLayout Demo</p>
              <p className="text-sm text-gray-500">Full-screen loading state</p>
            </div>
          </div>
        </div>
      )
    }
  ],
  [
    'error-layout',
    {
      id: 'error-layout',
      render: () => (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white" style={{ height: '250px' }}>
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-2xl mb-3">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">ErrorLayout Demo</h3>
              <p className="text-gray-600 text-sm mb-3">Full-screen error display</p>
              <button
                onClick={() => console.log('Retry clicked')}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )
    }
  ],
  [
    'success-layout',
    {
      id: 'success-layout',
      render: () => (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white" style={{ height: '250px' }}>
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-green-500 text-2xl mb-3">✅</div>
              <h3 className="text-lg font-semibold mb-2">SuccessLayout Demo</h3>
              <p className="text-gray-600 text-sm mb-3">Full-screen success state</p>
              <button
                onClick={() => console.log('Continue clicked')}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )
    }
  ]
];