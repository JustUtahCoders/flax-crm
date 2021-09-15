import { HTMLProps } from "react";
import { always } from "kremling";

export function FormFieldLabel(props: FormFieldLabelProps) {
  const { className, children, ...otherProps } = props;

  return (
    <label
      className={always(className as string)
        .always("text-coolGray-700 mb-1 text-sm")
        .toString()}
      {...otherProps}
    >
      {children}
    </label>
  );
}

export interface FormFieldLabelProps extends HTMLProps<HTMLLabelElement> {}
