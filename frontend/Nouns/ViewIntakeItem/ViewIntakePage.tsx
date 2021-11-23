import { IntakeViewMode, ViewIntakeItemProps } from "./ViewIntakeItem";

export function ViewIntakePage(props: ViewIntakeItemProps) {
  const useDottedLineSeparator = props.viewMode === IntakeViewMode.createEdit;

  if (useDottedLineSeparator) {
    return (
      <div className="my-4">
        <div className="flex justify-center text-gray-300">Page Break</div>
        <hr className="border-dashed mt-.5" />
      </div>
    );
  } else {
    // TODO: Implement pages for when you're filling out the form
    // They should probably have Next Page / Previous Page buttons
    return null;
  }
}
