import { ViewIntakeItemProps } from "./ViewIntakeItem";
import { FormField } from "../../Styleguide/FormField";
import { FormFieldLabel } from "../../Styleguide/FormFieldLabel";
import { IntakeFieldItem } from "../CreateEditIntakeForm";
import { Input } from "../../Styleguide/Input";

export function ViewIntakeField(props: ViewIntakeItemProps) {
  const fieldItem = props.intakeItem as IntakeFieldItem;
  return (
    <FormField className="pointer-events-none mt-3">
      <FormFieldLabel htmlFor={`intake-item-${fieldItem.id}`}>
        {fieldItem.question.label}
      </FormFieldLabel>
      <Input
        id={`intake-item-${fieldItem.id}`}
        placeholder={fieldItem.question.placeholderText}
        required={fieldItem.question.required}
        disabled
      />
    </FormField>
  );
}
