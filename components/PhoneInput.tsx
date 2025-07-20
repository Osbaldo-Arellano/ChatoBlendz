import { forwardRef } from 'react';
import { InputMask, type InputMaskProps } from '@react-input/mask';
import { TextField } from '@mui/material';

// Wrap InputMask in a forwardRef to pass to MUI
const PhoneInput = forwardRef<HTMLInputElement, InputMaskProps>((props, ref) => {
  return (
    <InputMask
      {...props}
      ref={ref}
      mask="(###) ###-####"
      replacement={{ '#': /\d/ }}
    />
  );
});

// Usage inside your component
export default function PhoneNumberField({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <TextField
      label="Phone Number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="(555) 555-5555"
      InputProps={{
        inputComponent: PhoneInput as any, // MUI expects component in inputComponent
      }}
      fullWidth
    />
  );
}
