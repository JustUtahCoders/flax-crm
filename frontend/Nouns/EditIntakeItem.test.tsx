import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { noop } from "lodash-es";
import { IntakeItemType } from "./CreateEditIntakeForm";
import { EditIntakeItem } from "./EditIntakeItem";

describe("<EditTextField />", () => {
  it("renders the correct form for text fields", async () => {
    const intakeItem = createIntakeItem();
    const w = render(<EditIntakeItem close={noop} intakeItem={intakeItem} />);
    expect(w.getByLabelText("Friendly Name")).toBeInTheDocument();
    expect(w.getByLabelText("Friendly Name")).toBeInTheDocument();
    expect(w.getByLabelText("Placeholder Text")).toBeInTheDocument();
    expect(w.getByLabelText("Required")).toBeInTheDocument();
    expect(w.getByLabelText("Disable Field")).toBeInTheDocument();
    expect(w.getByRole("dialog")).toBeInTheDocument();
  });
});

function createIntakeItem() {
  return {
    id: 1,
    field: {
      activeStatus: true,
      columnName: "",
      friendlyName: "First Name",
      id: 1,
      nounId: 1,
      type: "text",
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    },
    type: IntakeItemType.Field,
    question: {
      label: "First Name",
      placeholderText: "Jane",
      required: true,
    },
  };
}
