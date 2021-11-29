import { FormEvent, useState } from "react";
import { FormField } from "../../Styleguide/FormField";
import { FormFieldLabel } from "../../Styleguide/FormFieldLabel";
import { TextArea } from "../../Styleguide/TextArea";
import { IntakeItemType, IntakeHeaderItem } from "../CreateEditIntakeForm";
import { EditItemProps } from "../EditIntakeItem";
import { ModalActions } from "../../Styleguide/Modal";
import { Button, ButtonKind } from "../../Styleguide/Button";
import { Input } from "../../Styleguide/Input";

export function EditIntakeHeader(props: EditItemProps) {
  const intakeItem = props.intakeItem as IntakeHeaderItem;
  const [textContent, setTextContent] = useState(intakeItem?.textContent ?? "");

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {props.children}
      <FormField>
        <FormFieldLabel htmlFor="header-label">Header text</FormFieldLabel>
        <Input
          type="text"
          id="header-label"
          value={textContent}
          onChange={(evt) => setTextContent(evt.target.value)}
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
    const intakeItem: IntakeHeaderItem = {
      id: props.intakeItem?.id ?? -1,
      type: IntakeItemType.Header,
      textContent,
    };

    props.save(intakeItem);
  }
}
