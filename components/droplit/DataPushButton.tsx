'use client';

import React, { useState } from 'react';
import { Button, Flex, Text, Card, Select, TextArea, Badge, Code } from '@radix-ui/themes';
import { CheckIcon } from '@radix-ui/react-icons';
import { useBitcoinAuth } from 'bigblocks';
import { Sparkles } from 'lucide-react';

interface DataTemplate {
  id: string;
  name: string;
  description: string;
  protocol: string;
  category: 'social' | 'market' | 'identity' | 'protocol';
  example: string[];
}

export interface DataPushButtonProps {
  onSuccess?: (result: { txid: string; data: string[]; template: string }) => void;
  onError?: (error: Error) => void;
  template?: DataTemplate;
  buttonText?: string;
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  size?: '1' | '2' | '3' | '4';
  showTemplateSelector?: boolean;
  showPreview?: boolean;
  className?: string;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray';
  requireAuth?: boolean;
}

// Bitcoin protocol templates for droplit data transactions
const dataTemplates: DataTemplate[] = [
  {
    id: 'social-post',
    name: 'Social Post',
    description: 'Create a social media post on Bitcoin',
    protocol: 'B_SOCIAL',
    category: 'social',
    example: ['B_SOCIAL', 'POST', 'Hello Bitcoin world! 🚀', new Date().toISOString()]
  },
  {
    id: 'social-like',
    name: 'Social Like',
    description: 'Like or react to a post',
    protocol: 'B_SOCIAL',
    category: 'social', 
    example: ['B_SOCIAL', 'LIKE', '4a5e1e4b...afdeda33b', '❤️']
  },
  {
    id: 'market-listing',
    name: 'Market Listing',
    description: 'Create a marketplace listing',
    protocol: 'B_MARKET',
    category: 'market',
    example: ['B_MARKET', 'LIST', 'ordinal', '1000000', 'BSV', 'Rare digital art']
  },
  {
    id: 'identity-claim',
    name: 'Identity Claim',
    description: 'Attest to identity information',
    protocol: 'B_ID', 
    category: 'identity',
    example: ['B_ID', 'ATTEST', 'email', 'user@example.com', 'sig_placeholder']
  }
];

export function DataPushButton({
  onSuccess,
  onError,
  template,
  buttonText = 'Push Data',
  variant = 'solid',
  size = '2',
  showTemplateSelector = true,
  showPreview = true,
  className = '',
  color = 'orange',
  requireAuth = false,
}: DataPushButtonProps) {
  const defaultTemplate: DataTemplate = {
    id: 'bsocial',
    name: 'bSocial Post',
    description: 'Social media post on Bitcoin',
    protocol: 'bsocial',
    category: 'social',
    example: [
      'OP_FALSE',
      'OP_RETURN',
      'bsocial',
      JSON.stringify({
        action: 'post',
        content: 'Hello Bitcoin!',
        timestamp: Date.now()
      })
    ]
  };

  const [selectedTemplate, setSelectedTemplate] = useState<DataTemplate>(
    template || dataTemplates[0] || defaultTemplate
  );
  const [customContent, setCustomContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pushCount, setPushCount] = useState(0);
  const [isAuthenticated] = useState(true); // Demo: assume authenticated

  const handlePushData = async () => {
    if (requireAuth && !isAuthenticated) {
      onError?.(new Error('Authentication required'));
      return;
    }

    setIsLoading(true);

    try {
      // Simulate droplit data push (no BSV cost)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Build data array with custom content if provided
      const dataArray = [...selectedTemplate.example];
      if (customContent && dataArray.length > 2) {
        dataArray[2] = customContent; // Replace content field
      }
      
      const newCount = pushCount + 1;
      setPushCount(newCount);
      
      const result = {
        txid: `droplit-tx-${Date.now()}-${newCount}`,
        data: dataArray,
        template: selectedTemplate.id
      };
      
      onSuccess?.(result);
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  if (requireAuth && !isAuthenticated) {
    return (
      <Card>
        <Flex align="center" gap="2">
          <Text size="2" color="gray">
            🔐 Authentication required for droplit data transactions
          </Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Flex direction="column" gap="3" className={className}>
      {showTemplateSelector && (
        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">Protocol Template</Text>
          <Select.Root
            value={selectedTemplate.id}
            onValueChange={(value) => {
              const foundTemplate = dataTemplates.find(t => t.id === value);
              if (foundTemplate) setSelectedTemplate(foundTemplate);
            }}
          >
            <Select.Trigger />
            <Select.Content>
              {dataTemplates.map((template) => (
                <Select.Item key={template.id} value={template.id}>
                  <Flex direction="column" gap="1">
                    <Text size="2" weight="medium">{template.name}</Text>
                    <Text size="1" color="gray">{template.description}</Text>
                  </Flex>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
      )}

      <Flex direction="column" gap="2">
        <Text size="2" weight="medium">Custom Content (Optional)</Text>
        <TextArea
          value={customContent}
          onChange={(e) => setCustomContent(e.target.value)}
          placeholder={`Enter custom content for ${selectedTemplate.name.toLowerCase()}...`}
          rows={2}
        />
      </Flex>

      {showPreview && (
        <Flex direction="column" gap="2">
          <Text size="2" weight="medium">Data Preview</Text>
          <Card variant="surface">
            <Code size="1">
              {JSON.stringify(
                selectedTemplate.example.map((item, index) => 
                  index === 2 && customContent ? customContent : item
                ),
                null,
                2
              )}
            </Code>
          </Card>
        </Flex>
      )}

      <Button
        onClick={handlePushData}
        disabled={isLoading}
        variant={variant}
        size={size}
        color={color}
        loading={isLoading}
      >
        {isLoading ? 'Pushing to Droplit...' : buttonText}
      </Button>

      {pushCount > 0 && (
        <Flex align="center" gap="2">
          <CheckIcon color="green" />
          <Badge color="green" size="1">
            Data pushed {pushCount} time{pushCount !== 1 ? 's' : ''}
          </Badge>
        </Flex>
      )}

      <Text size="1" color="gray">
        💧 Droplit: Data transactions with no BSV costs
      </Text>
    </Flex>
  );
} 