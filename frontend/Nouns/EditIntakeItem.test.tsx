import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { noop } from "lodash-es";
import { IntakeItem, IntakeItemType } from "./CreateEditIntakeForm";
import { EditIntakeItem } from "./EditIntakeItem";

const basicFieldsResponse = [
  {
    id: 4,
    nounId: 2,
    type: "",
    columnName: "",
    friendlyName: "First Name",
    activeStatus: true,
    createdAt: "2021-10-17T19:20:08.572Z",
    updatedAt: "2021-10-17T19:20:08.572Z",
  },
  {
    id: 5,
    nounId: 2,
    type: "",
    columnName: "",
    friendlyName: "Last Name",
    activeStatus: true,
    createdAt: "2021-10-17T19:20:08.572Z",
    updatedAt: "2021-10-17T19:20:08.572Z",
  },
];

describe("<EditTextField />", () => {
  it("renders the correct form for text fields", async () => {
    const intakeItem: IntakeItem = createIntakeItem();
    const w = render(
      <EditIntakeItem
        close={noop}
        intakeItem={intakeItem}
        fields={basicFieldsResponse}
      />
    );
    expect(w.getByLabelText("Placeholder Text")).toBeInTheDocument();
    expect(w.getByLabelText("Required")).toBeInTheDocument();
    expect(w.getByRole("dialog")).toBeInTheDocument();
  });
});

function createIntakeItem(): IntakeItem {
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
