import { HTMLProps } from "react";
import { always } from "kremling";

export function FormField(props: FormFieldProps) {
  const {
    className,
    children,
    orientiation = FormFieldOrientation.vertical,
    ...otherProps
  } = props;

  return (
    <div
      className={always(className as string)
        .always("flex")
        .toggle(
          "flex-col",
          "flex-row",
          orientiation === FormFieldOrientation.vertical
        )
        .toString()}
      {...otherProps}
    >
      {children}
    </div>
  );
}

export enum FormFieldOrientation {
  vertical = "vertical",
}

export interface FormFieldProps extends HTMLProps<HTMLDivElement> {
  orientiation?: FormFieldOrientation.vertical;
}
