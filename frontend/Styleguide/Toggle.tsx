import { Input } from "./Input";
import { noop } from "lodash";
import { ChangeEventHandler, HTMLProps } from "react";

export function Toggle(props: ToggleProps) {
  const { checked = false, onChange = noop, ...otherProps } = props;
  return (
    <Input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      {...otherProps}
    />
  );
}

interface ToggleProps extends Omit<HTMLProps<HTMLInputElement>, "onChange"> {
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
