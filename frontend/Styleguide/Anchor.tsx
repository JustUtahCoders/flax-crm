import { AnchorHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { buttonClasses, ButtonKind } from "./Button";

export function Anchor(props: AnchorProps) {
  const { kind, className, children, ...otherProps } = props;

  // Use react-router (no page reload) when "to" prop is passed
  // Use <a> (with page reload) when "href" prop is passed
  const useReactRouter = !Boolean(props.href);

  if (useReactRouter) {
    return (
      <Link className={buttonClasses(kind, className)} {...otherProps}>
        {children}
      </Link>
    );
  } else {
    return (
      <a className={buttonClasses(kind, className)} {...otherProps}>
        {children}
      </a>
    );
  }
}

export interface AnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  kind: ButtonKind;
  to?: string;
}

// export enum AnchorKind {
//   primary = "primary",
//   secondary = "secondary",
//   transparent = "transparent"
// }

// const allKindClasses = {
//   [AnchorKind.primary]: "bg-primary text-white",
//   [AnchorKind.secondary]: "text-gray-500 border-gray-500 border hover:text-gray-500",
//   [AnchorKind.transparent]: "text-primary hover:text-primary"
// }
