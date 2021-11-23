import { IntakeItem, IntakeItemType } from "../CreateEditIntakeForm";
import { ViewIntakeField } from "./ViewIntakeField";
import { ViewIntakeParagraph } from "./ViewIntakeParagraph";
import { ViewIntakeHeader } from "./ViewIntakeHeader";

export function ViewIntakeItem(props: ViewIntakeItemProps) {
  const ViewItem = getViewItemComponent(props.intakeItem);

  return <ViewItem {...props} />;
}

function getViewItemComponent(
  intakeItem: IntakeItem
): React.FunctionComponent<ViewIntakeItemProps> {
  switch (intakeItem.type) {
    case IntakeItemType.Field:
      return ViewIntakeField;
    case IntakeItemType.Paragraph:
      return ViewIntakeParagraph;
    case IntakeItemType.Header:
      return ViewIntakeHeader;
    default:
      throw Error(
        `ViewIntakeItem not implemented for intake items with type '${intakeItem.type}'`
      );
  }
}

export interface ViewIntakeItemProps {
  intakeItem: IntakeItem;
  nestingLevel: number;
}
