'use client';

import { useState } from 'react';
import { Eye, Code, ExternalLink } from 'lucide-react';
import { ComponentPreviewModal } from './ComponentPreviewModal';

interface ComponentGridItem {
  name: string;
  title: string;
  component: React.ReactNode;
  description?: string;
  requiresFunding?: boolean;
  promptPath?: string;
}

interface ComponentGridProps {
  components: ComponentGridItem[];
  category: string;
}

export function ComponentGrid({ components, category }: ComponentGridProps) {
  const [selectedComponent, setSelectedComponent] = useState<ComponentGridItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePreview = (component: ComponentGridItem) => {
    setSelectedComponent(component);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {components.map((item) => (
          <div
            key={item.name}
            className="group relative border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            {/* Component Preview Area */}
            <div className="relative h-48 bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  onClick={() => handlePreview(item)}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg flex items-center gap-2 font-medium transform scale-90 group-hover:scale-100 transition-transform"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>
              
              {/* Component Preview */}
              <div className="w-full max-w-sm pointer-events-none opacity-75 scale-90">
                {item.component}
              </div>

              {/* Funding Badge */}
              {item.requiresFunding && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                  💰 Requires Funding
                </div>
              )}
            </div>

            {/* Component Info */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {item.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePreview(item)}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                  >
                    <Code className="w-3 h-3" />
                    View Code
                  </button>
                </div>
                
                <button
                  onClick={() => handlePreview(item)}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedComponent && (
        <ComponentPreviewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedComponent(null);
          }}
          componentName={selectedComponent.name}
          componentTitle={selectedComponent.title}
          promptPath={selectedComponent.promptPath}
        >
          <div className="min-h-[400px] flex items-center justify-center">
            {selectedComponent.component}
          </div>
        </ComponentPreviewModal>
      )}
    </>
  );
}