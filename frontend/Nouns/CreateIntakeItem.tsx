import { SelectHTMLAttributes, useState } from "react";
import { Field } from "../../backend/DB/models/field";
import { FormFieldLabel } from "../Styleguide/FormFieldLabel";
import { Modal } from "../Styleguide/Modal";
import { Select } from "../Styleguide/Select";
import { IntakeItem, IntakeItemType } from "./CreateEditIntakeForm";
import { EditIntakeTextField } from "./EditIntakeItem/EditIntakeTextField";
import { EditIntakeParagraph } from "./EditIntakeItem/EditIntakeParagraph";

export function CreateIntakeItem(props: CreateIntakeItemProps) {
  const [intakeItemType, setIntakeItemType] = useState<IntakeItemType>(
    IntakeItemType.Field
  );
  const Create = getCreateComponent(intakeItemType);

  return (
    <Modal close={props.close} title="Create Intake Item">
      <Create
        intakeItemType={intakeItemType}
        setIntakeItemType={setIntakeItemType}
        close={props.close}
        doCreate={props.addNewItem}
        fields={props.fields}
      />
    </Modal>
  );
}

function getCreateComponent(
  intakeItemType: IntakeItemType
): React.FunctionComponent<CreateItemProps> {
  switch (intakeItemType) {
    case IntakeItemType.Field:
      return CreateFieldItem;
    case IntakeItemType.Paragraph:
      return CreateParagraphItem;
    default:
      throw Error(
        `No create component implemented for intake item type ${intakeItemType}`
      );
  }
}

function CreateFieldItem(props: CreateItemProps) {
  return (
    <EditIntakeTextField
      close={props.close}
      intakeItem={null}
      save={props.doCreate}
      fields={props.fields}
    >
      <IntakeItemTypeSelect
        value={props.intakeItemType}
        setIntakeItemType={props.setIntakeItemType}
      />
    </EditIntakeTextField>
  );
}

function CreateParagraphItem(props: CreateItemProps) {
  return (
    <EditIntakeParagraph
      close={props.close}
      intakeItem={null}
      save={props.doCreate}
      fields={props.fields}
    >
      <IntakeItemTypeSelect
        value={props.intakeItemType}
        setIntakeItemType={props.setIntakeItemType}
      />
    </EditIntakeParagraph>
  );
}

function IntakeItemTypeSelect(props: IntakeItemTypeSelectProps) {
  return (
    <>
      <FormFieldLabel htmlFor="intake-item-type-select">
        Intake Item Type
      </FormFieldLabel>
      <Select
        id="intake-item-type-select"
        value={props.value}
        onChange={(evt) =>
          props.setIntakeItemType(evt.target.value as IntakeItemType)
        }
      >
        {Object.keys(IntakeItemType).map((intakeItemType) => (
          <option key={intakeItemType} value={intakeItemType}>
            {intakeItemType}
          </option>
        ))}
      </Select>
    </>
  );
}

interface IntakeItemTypeSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  setIntakeItemType(newType: IntakeItemType): any;
}

interface CreateItemProps {
  intakeItemType: IntakeItemType;
  setIntakeItemType(newType: IntakeItemType): any;
  close(): any;
  doCreate(intakeItem: IntakeItem): any;
  fields: Field[];
}

interface CreateIntakeItemProps {
  close(): any;
  addNewItem(intakeItem: IntakeItem): any;
  fields: Field[];
}
