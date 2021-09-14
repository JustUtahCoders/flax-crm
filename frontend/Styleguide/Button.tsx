import { ButtonHTMLAttributes } from "react";

export function Button(props: ButtonProps) {
  const { kind, className, children, ...otherProps } = props;

  return (
    <button className={buttonClasses(kind, className)} {...otherProps}>
      {children}
    </button>
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  kind: ButtonKind;
}

export enum ButtonKind {
  primary = "primary",
  secondary = "secondary",
  transparent = "transparent",
}

export function buttonClasses(kind: ButtonKind, extraClassName: string = "") {
  const kindClasses = buttonKindClasses[kind] || "";
  return `flex items-center justify-center cursor-pointer h-15 py-2.5 rounded font-medium flex-shrink ${kindClasses} ${extraClassName}`.trim();
}

const buttonKindClasses = {
  [ButtonKind.primary]: "bg-primary text-white",
  [ButtonKind.secondary]:
    "text-gray-500 border-gray-500 border hover:text-gray-500",
  [ButtonKind.transparent]: "text-primary hover:text-primary",
};
