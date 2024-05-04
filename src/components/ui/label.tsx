import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Text } from 'react-native';

const labelVariants = cva(
  'text-sm  font-interregular leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<
  React.ElementRef<typeof Text>,
  React.ComponentPropsWithoutRef<typeof Text> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <Text ref={ref} className={cn(labelVariants(), className)} {...props} />
));

export default Label;
