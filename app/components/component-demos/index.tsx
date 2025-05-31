/**
 * Component Demo Registry
 * Maps component IDs to their demo implementations
 */

import { authFlowDemos } from './auth-flows';
import { coreDemos } from './core-components';
import { marketDemos } from './market-components';
import { socialDemos } from './social-components';
import { walletDemos } from './wallet-components';
import { oauthWalletDemos } from './oauth-wallet-components';
import { deviceBackupDemos } from './device-backup-components';
import { uiPrimitiveDemos } from './ui-primitive-components';
import { layoutDemos } from './layout-components';
import { hookDemos } from './hook-demos';
import { bapDemos } from './bap-components';
import { developerToolDemos } from './developer-tools';

export type ComponentDemoProps = {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  [key: string]: unknown;
};

export type ComponentDemo = {
  id: string;
  render: (props: ComponentDemoProps) => React.ReactNode;
};

// Combine all demos into a single registry
export const componentDemoRegistry = new Map<string, ComponentDemo>([
  ...authFlowDemos,
  ...coreDemos,
  ...marketDemos,
  ...socialDemos,
  ...walletDemos,
  ...oauthWalletDemos,
  ...deviceBackupDemos,
  ...uiPrimitiveDemos,
  ...layoutDemos,
  ...hookDemos,
  ...bapDemos,
  ...developerToolDemos,
]);

// Helper function to render a component demo
export function renderComponentDemo(
  componentId: string, 
  props: ComponentDemoProps = {}
): React.ReactNode {
  const demo = componentDemoRegistry.get(componentId);
  if (!demo) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Demo not implemented for: {componentId}</p>
      </div>
    );
  }
  return demo.render(props);
}