import { Field } from "../../backend/DB/models/field";
import { Modal } from "../Styleguide/Modal";
import {
  IntakeFieldItem,
  IntakeItem,
  IntakeItemType,
  IntakeSectionItem,
} from "./CreateEditIntakeForm";
import { EditIntakeTextField } from "./EditIntakeField/EditIntakeTextField";

export function EditIntakeItem(props: EditIntakeItemProps) {
  const Edit = getEditComponent(props.intakeItem);
  const friendlyName = getFriendlyName(props.intakeItem);

  return (
    <Modal title={`Edit ${friendlyName}`} close={props.close}>
      <Edit
        intakeItem={props.intakeItem}
        close={props.close}
        save={save}
        fields={props.fields}
      />
    </Modal>
  );

  function save() {}
}

function getFriendlyName(intakeItem: IntakeItem): string {
  switch (intakeItem.type) {
    case IntakeItemType.Field:
      return (intakeItem as IntakeFieldItem).field.friendlyName;
    default:
      return intakeItem.type;
  }
}

function getEditComponent(
  intakeItem: IntakeItem
): React.FunctionComponent<EditItemProps> {
  switch (intakeItem.type) {
    case IntakeItemType.Field:
      switch ((intakeItem as IntakeFieldItem).field.type) {
        case "text":
          return EditIntakeTextField;
        default:
          throw Error(
            `Unknown intakeItem.field.type '${
              (intakeItem as IntakeFieldItem).field.type
            }' - edit component not implemented`
          );
      }
    case IntakeItemType.Section:
      return EditSectionItem;
  }
}

function EditSectionItem(props: EditItemProps) {
  const intakeItem = props.intakeItem as IntakeSectionItem;
  return <div>Editing Section</div>;
}

export interface EditItemProps {
  intakeItem: IntakeItem | null;
  fields: Field[];
  close(): any;
  children?: React.ReactNode;
  save(intakeItem: IntakeItem): any;
}

interface EditIntakeItemProps {
  intakeItem: IntakeItem;
  fields: Field[];
  close(): any;
}
