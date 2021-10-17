import { SelectHTMLAttributes } from "react";

export function Select(props: SelectProps) {
  const { children, ...otherProps } = props;

  return <select {...otherProps}>{children}</select>;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}
