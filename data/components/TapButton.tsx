'use client';

import React, { useState } from 'react';
import { Button, Flex, Text, Badge } from '@radix-ui/themes';
import { CheckIcon } from '@radix-ui/react-icons';

export interface TapButtonProps {
  onSuccess?: (result: { message: string; timestamp: string; tapCount: number }) => void;
  onError?: (error: Error) => void;
  buttonText?: string;
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  size?: '1' | '2' | '3' | '4';
  disabled?: boolean;
  className?: string;
  showTapCount?: boolean;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray';
}

export function TapButton({
  onSuccess,
  onError,
  buttonText = 'Tap for Demo Access',
  variant = 'solid',
  size = '2',
  disabled = false,
  className = '',
  showTapCount = true,
  color = 'blue',
}: TapButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const handleTap = async () => {
    setIsLoading(true);
    
    try {
      // Simulate auth validation and droplit access
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCount = tapCount + 1;
      setTapCount(newCount);
      
      const result = {
        message: `Demo access granted! Tap #${newCount}`,
        timestamp: new Date().toISOString(),
        tapCount: newCount
      };
      
      onSuccess?.(result);
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex direction="column" gap="2" className={className}>
      <Button
        onClick={handleTap}
        disabled={isLoading || disabled}
        variant={variant}
        size={size}
        color={color}
        loading={isLoading}
      >
        {isLoading ? 'Processing...' : buttonText}
      </Button>
      
      {showTapCount && tapCount > 0 && (
        <Flex align="center" gap="2">
          <CheckIcon color="green" />
          <Badge color="green" size="1">
            Access granted {tapCount} time{tapCount !== 1 ? 's' : ''}
          </Badge>
        </Flex>
      )}
      
      {tapCount > 0 && (
        <Text size="1" color="gray">
          💡 Demo: No actual BSV required for data transactions
        </Text>
      )}
    </Flex>
  );
} 