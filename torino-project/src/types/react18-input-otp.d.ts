declare module 'react18-input-otp' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface OtpInputProps {
    value: string;
    onChange: (otp: string) => void;
    numInputs: number;
    separator?: ReactNode;
    isInputNum?: boolean;
    shouldAutoFocus?: boolean;
    isDisabled?: boolean;
    hasErrored?: boolean;
    containerStyle?: CSSProperties | string;
    inputStyle?: CSSProperties | string;
    focusStyle?: CSSProperties | string;
    errorStyle?: CSSProperties | string;
  }

  const OtpInput: ComponentType<OtpInputProps>;
  export default OtpInput;
}
