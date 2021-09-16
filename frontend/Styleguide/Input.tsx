import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { always } from "kremling";

export function Input(props: InputProps) {
  const { className, children, ...otherProps } = props;

  return (
    <input
      className={always(className as string)
        .always("border border-gray-300 rounded py-2.5 px-3.5")
        .toString()}
      {...otherProps}
    >
      {children}
    </input>
  );
}

export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}
