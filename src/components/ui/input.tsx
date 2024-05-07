import * as React from 'react';

import { cn } from '@/lib/utils';
import { TextInput, TextInputProps } from 'react-native';
import { Controller } from 'react-hook-form';

export interface InputProps extends TextInputProps {
  control: any;
  name: string;
  error?: string;
  label?: string;
}

const Input: React.FC<InputProps> = ({
  className,
  name,
  error,
  control,
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          value={value}
          onChangeText={onChange}
          autoCapitalize='none'
          editable
          onBlur={onBlur}
          className={cn(
            'flex h-13 w-full rounded-md border border-input bg-background px-3 py-2 text-lg  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-rose-500',
            className
          )}
          {...props}
        />
      )}
    />
  );
};
Input.displayName = 'Input';

export { Input };
