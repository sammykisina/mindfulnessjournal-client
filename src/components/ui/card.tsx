import { cn } from '@/lib/utils';
import React from 'react';
import { Text, TextProps, View, ViewProps } from 'react-native';

/**
 * TYPES
 */
export interface CardProps extends ViewProps {}
export interface CardHeaderProps extends ViewProps {}
export interface CardTitleProps extends TextProps {}
export interface CardDescriptionProps extends TextProps {}
export interface CardContentProps extends ViewProps {}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => (
  <View
    className={cn(
      'h-fit rounded-lg border-0 bg-card text-card-foreground shadow-md',
      className
    )}
    {...props}
  >
    {children}
  </View>
);

Card.displayName = 'Card';

const CardHeader: React.FC<CardHeaderProps> = ({
  className,
  children,
  ...props
}) => (
  <View className={cn('flex flex-col space-y-1.5 p-2', className)} {...props}>
    {children}
  </View>
);
CardHeader.displayName = 'CardHeader';

const CardTitle: React.FC<CardTitleProps> = ({
  className,
  children,
  ...props
}) => (
  <Text
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  >
    {children}
  </Text>
);
CardTitle.displayName = 'CardTitle';

const CardDescription: React.FC<CardDescriptionProps> = ({
  className,
  children,
  ...props
}) => (
  <Text className={cn('text-sm text-muted-foreground', className)} {...props}>
    {children}
  </Text>
);
CardDescription.displayName = 'CardDescription';

const CardContent: React.FC<CardContentProps> = ({
  className,
  children,
  ...props
}) => (
  <View className={cn('pt-0', className)} {...props}>
    {children}
  </View>
);
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
