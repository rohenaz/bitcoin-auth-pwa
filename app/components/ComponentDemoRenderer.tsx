/**
 * Component Demo Renderer
 * Renders component demos from the modular registry
 */

import React from 'react';
import { renderComponentDemo } from './component-demos';

interface ComponentDemoRendererProps {
  componentId: string;
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}

export function ComponentDemoRenderer({ 
  componentId, 
  onSuccess, 
  onError 
}: ComponentDemoRendererProps) {
  try {
    return (
      <div className="component-demo-container">
        {renderComponentDemo(componentId, { onSuccess, onError })}
      </div>
    );
  } catch (error) {
    console.error(`Error rendering demo for ${componentId}:`, error);
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error rendering component demo</p>
        <p className="text-gray-500 text-sm mt-2">{String(error)}</p>
      </div>
    );
  }
}