import { useEffect } from "react";
import { Field } from "../../backend/DB/models/Field";
import { Modal } from "../Styleguide/Modal";
import {
  IntakeFieldItem,
  IntakeItem,
  IntakeItemType,
  IntakeSectionItem,
} from "./CreateEditIntakeForm";
import { EditIntakeParagraph } from "./EditIntakeItem/EditIntakeParagraph";
import { EditIntakeTextField } from "./EditIntakeItem/EditIntakeTextField";

export function EditIntakeItem(props: EditIntakeItemProps) {
  const Edit = getEditComponent(props.intakeItem);
  const friendlyName = getFriendlyName(props.intakeItem);

  useEffect(() => {
    if (!Edit) {
      props.close();
    }
  });

  if (Edit) {
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
  } else {
    // This intake item is not editable
    return null;
  }

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
): React.FunctionComponent<EditItemProps> | null {
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
    case IntakeItemType.Paragraph:
      return EditIntakeParagraph;
    case IntakeItemType.Section:
      return EditSectionItem;
    case IntakeItemType.Page:
      // Pages are only deletable, not editable
      return null;
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
