import { IntakeParagraphItem } from "../CreateEditIntakeForm";
import { ViewIntakeItemProps } from "./ViewIntakeItem";

export function ViewIntakeParagraph(props: ViewIntakeItemProps) {
  const paragraphItem = props.intakeItem as IntakeParagraphItem;

  return <p className="my-3.5">{paragraphItem.textContent}</p>;
}
