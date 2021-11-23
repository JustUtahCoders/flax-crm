import { ViewIntakeItemProps } from "./ViewIntakeItem";
import { IntakeHeaderItem } from "../CreateEditIntakeForm";
import { createElement } from "react";

export function ViewIntakeHeader(props: ViewIntakeItemProps) {
  const headerItem = props.intakeItem as IntakeHeaderItem;

  // nestingLevel is zero based, but there is no <h0> element,
  // so we add 1 to the nestingLevel. We can't go beyond <h6>
  // since that's not supported by browsers
  const headerLevel = Math.min(props.nestingLevel + 1, 6);

  // use createElement directly since jsx does not support providing
  // a dynamic react element type
  return createElement(
    `h${headerLevel}`,
    { className: getFontSizeClass() },
    headerItem.textContent
  );

  function getFontSizeClass() {
    switch (props.nestingLevel) {
      case 0:
        return "text-4xl";
      case 1:
        return "text-3xl";
      case 2:
        return "text-2xl";
      case 3:
        return "text-xl";
      case 4:
        return "text-lg";
      default:
        return "text-base";
    }
  }
}
