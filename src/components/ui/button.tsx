import { TouchableOpacity } from 'react-native';
import React from 'react';
import { cva } from 'class-variance-authority';

type ButtonProps = React.ComponentPropsWithoutRef<typeof TouchableOpacity> & {
  variant:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'ghost'
    | 'link'
    | 'outline';
  size: 'default' | 'sm' | 'lg' | 'icon' | 'controlled';
};

export const buttonVariants = cva(
  'inline-flex items-center justify-center  font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
        controlled: '',
      },
      defaultVariants: {
        variant: 'default',
        size: 'sm',
      },
    },
  }
);

export default function Button({
  className,
  variant,
  size,
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      {...rest}
      className={buttonVariants({ className, variant, size })}
    />
  );
}
