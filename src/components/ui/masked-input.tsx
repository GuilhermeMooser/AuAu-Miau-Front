import React from 'react';
import InputMask from 'react-input-mask';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, className, disabled, ...props }, ref) => {
    return (
      <InputMask mask={mask} disabled={disabled} {...props}>
        {(inputProps: any) => (
          <Input
            {...inputProps}
            ref={ref}
            disabled={disabled}
            className={cn(className)}
          />
        )}
      </InputMask>
    );
  }
);

MaskedInput.displayName = "MaskedInput";