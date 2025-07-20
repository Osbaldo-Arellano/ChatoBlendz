'use client';

import { InputMask } from '@react-input/mask';
import { forwardRef } from 'react';
import { TextField } from '@mui/material';

const PhoneInput = forwardRef<HTMLInputElement, any>((props, ref) => {
  return (
    <InputMask
      mask="(___) ___-____"
      replacement={{ _: /\d/ }}
      {...props}
      component={TextField}
      inputRef={ref}
    />
  );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
