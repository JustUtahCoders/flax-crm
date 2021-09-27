import { FormEvent, useState } from "react";
import { FormField } from "../Styleguide/FormField";
import { FormFieldLabel } from "../Styleguide/FormFieldLabel";
import { Input } from "../Styleguide/Input";
import { Modal, ModalActions } from "../Styleguide/Modal";
import {
  IntakeFieldItem,
  IntakeItem,
  IntakeItemType,
} from "./CreateEditIntakeForm";
import { Toggle } from "../Styleguide/Toggle";
import { Button, ButtonKind } from "../Styleguide/Button";

export function EditIntakeItem(props: EditIntakeItemProps) {
  const Edit = getEditComponent(props.intakeItem);

  return (
    <Modal
      title={`Edit ${props.intakeItem.field.friendlyName}`}
      close={props.close}
    >
      <Edit intakeItem={props.intakeItem} close={props.close} />
    </Modal>
  );
}

function getEditComponent(
  intakeItem: IntakeItem
): React.FunctionComponent<EditItemProps> {
  switch (intakeItem.type) {
    case IntakeItemType.Field:
      switch ((intakeItem as IntakeFieldItem).field.type) {
        case "text":
          return EditTextField;
        default:
          throw Error(
            `Unknown intakeItem.field.type '${
              (intakeItem as IntakeFieldItem).field.type
            }' - edit component not implemented`
          );
      }
    default:
      throw Error(
        `Unknown intakeItem.type '${intakeItem.type}' - edit component not implemented`
      );
  }
}

function EditTextField(props: EditItemProps) {
  const intakeItem = props.intakeItem as IntakeFieldItem;
  const [label, setLabel] = useState(intakeItem.question.label);
  const [required, setRequired] = useState(intakeItem.question.required);
  const [placeholder, setPlaceholder] = useState(
    intakeItem.question.placeholderText
  );
  const [activeStatus, setActiveStatus] = useState(
    intakeItem.field.activeStatus
  );
  const [friendlyName, setFriendlyName] = useState(
    intakeItem.field.friendlyName
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField>
        <FormFieldLabel htmlFor="input-friendly-name">
          Friendly Name
        </FormFieldLabel>
        <Input
          id="input-friendly-name"
          type="text"
          value={friendlyName}
          onChange={(evt) => setFriendlyName(evt.target.value)}
        />
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
      <FormField>
        <FormFieldLabel htmlFor="input-active">Disable Field</FormFieldLabel>
        <Toggle
          id="input-active"
          checked={!activeStatus}
          onChange={(evt) => setActiveStatus(!evt.target.checked)}
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
  }
}

interface EditItemProps {
  intakeItem: IntakeFieldItem;
  close(): any;
}

interface EditIntakeItemProps {
  intakeItem: IntakeItem;
  close(): any;
}
