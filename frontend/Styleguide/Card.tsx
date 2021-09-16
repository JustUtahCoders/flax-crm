import { always } from "kremling";
import { HTMLProps } from "react";

export function Card(props: CardProps) {
  const { className, children, ...otherProps } = props;

  return (
    <div
      className={always(className as string)
        .always("border border-gray-300 rounded py-2.5 px-3.5 bg-white")
        .toString()}
      {...otherProps}
    >
      {children}
    </div>
  );
}

export interface CardProps extends HTMLProps<HTMLDivElement> {}
