import { always } from "kremling";

export function TextArea(props: TextAreaProps) {
  const { className, children, ...otherProps } = props;

  return (
    <textarea
      className={always(className as string)
        .always("border border-gray-300 rounded px-2.5 py-1.5")
        .toString()}
      onChange={(evt) => evt.target.value}
      {...otherProps}
    >
      {children}
    </textarea>
  );
}

export interface TextAreaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {}
