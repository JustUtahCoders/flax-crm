import { always, maybe } from "kremling";
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
  classic = "classic",
  icon = "icon",
}

export function buttonClasses(kind: ButtonKind, extraClassName: string = "") {
  const kindClasses = buttonKindClasses[kind] || "";
  return always(kindClasses)
    .always(extraClassName)
    .maybe(styledButtonClasses, styledButtonKinds.includes(kind))
    .toString();
}

const styledButtonClasses = `flex items-center justify-center cursor-pointer py-2.5 px-5 rounded font-medium`;

const styledButtonKinds = [ButtonKind.primary, ButtonKind.secondary];

const buttonKindClasses = {
  [ButtonKind.primary]: "bg-primary text-white",
  [ButtonKind.secondary]:
    "text-gray-500 border-gray-500 border hover:text-gray-500",
  [ButtonKind.transparent]: "text-primary hover:text-primary",
  [ButtonKind.classic]:
    "text-primary underline hover:text-primary hover:underline",
  [ButtonKind.icon]:
    "text-primary hover:bg-gray-200 flex justify-items-center align-items-center p-2 rounded",
};
