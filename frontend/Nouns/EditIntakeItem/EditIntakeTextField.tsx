import { ModalActions } from "../../Styleguide/Modal";
import { FormEvent, useState } from "react";
import { FormField } from "../../Styleguide/FormField";
import { FormFieldLabel } from "../../Styleguide/FormFieldLabel";
import { Input } from "../../Styleguide/Input";
import { IntakeFieldItem, IntakeItemType } from "../CreateEditIntakeForm";
import { EditItemProps } from "../EditIntakeItem";
import { Toggle } from "../../Styleguide/Toggle";
import { Button, ButtonKind } from "../../Styleguide/Button";
import { Field } from "../../../backend/DB/models/field";
import { Select } from "../../Styleguide/Select";

export function EditIntakeTextField(props: EditItemProps) {
  const intakeItem = props.intakeItem as IntakeFieldItem;
  const [label, setLabel] = useState(intakeItem?.question.label ?? "");
  const [required, setRequired] = useState(
    intakeItem?.question.required ?? true
  );
  const [placeholder, setPlaceholder] = useState(
    intakeItem?.question.placeholderText ?? ""
  );
  const [fieldId, setFieldId] = useState<number | null>(intakeItem?.field.id);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {props.children}
      <FormField>
        <FormFieldLabel htmlFor="input-field">Field</FormFieldLabel>
        <Select
          required
          id="input-field"
          value={fieldId || ""}
          onChange={(evt) => setFieldId(Number(evt.target.value))}
        >
          <option disabled value="">
            Choose field
          </option>
          {props.fields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.friendlyName}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField>
        <FormFieldLabel htmlFor="input-label">Label Text</FormFieldLabel>
        <Input
          id="input-label"
          type="text"
          value={label}
          onChange={(evt) => setLabel(evt.target.value)}
        />
      </FormField>
      <FormField>
        <FormFieldLabel htmlFor="input-placeholder">
          Placeholder Text
        </FormFieldLabel>
        <Input
          id="input-placeholder"
          type="text"
          value={placeholder}
          onChange={(evt) => setPlaceholder(evt.target.value)}
        />
      </FormField>
      <FormField>
        <FormFieldLabel htmlFor="input-required">Required</FormFieldLabel>
        <Toggle
          id="input-required"
          checked={required}
          onChange={(evt) => setRequired(evt.target.checked)}
        />
      </FormField>
      <ModalActions>
        <Button type="button" kind={ButtonKind.secondary} onClick={props.close}>
          Cancel
        </Button>
        <Button type="submit" kind={ButtonKind.primary}>
          Save
        </Button>
      </ModalActions>
    </form>
  );

  function handleSubmit(evt: FormEvent<HTMLFormElement>): void {
    evt.preventDefault();
    const intakeItem: IntakeFieldItem = {
      id: props.intakeItem?.id ?? -1,
      field: (props.intakeItem as IntakeFieldItem)?.field ?? emptyTextField,
      type: IntakeItemType.Field,
      question: {
        label,
        placeholderText: placeholder,
        required,
      },
    };
    props.save(intakeItem);
  }
}

const emptyTextField: Field = {
  activeStatus: true,
  columnName: "",
  friendlyName: "",
  id: -1,
  nounId: -1,
  type: "text",
  createdAt: new Date().toString(),
  updatedAt: new Date().toString(),
};
