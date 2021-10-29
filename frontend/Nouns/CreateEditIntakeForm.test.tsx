import { CreateEditIntakeForm, IntakeItemType } from "./CreateEditIntakeForm";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import "@testing-library/jest-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Route } from "react-router-dom";

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
const basicIntakeItemsResponse = [
  {
    type: IntakeItemType.Field,
    field: {
      createdAt: Date.now().toString(),
      id: 1,
      activeStatus: true,
      columnName: "givenName",
      friendlyName: "First Name",
      nounId: 10,
      type: "text",
      updatedAt: Date.now().toString(),
    },
    id: 1,
    question: {
      label: "First Name",
      placeholderText: "Jane",
      required: true,
    },
  },
  {
    type: IntakeItemType.Field,
    field: {
      createdAt: Date.now().toString(),
      id: 2,
      activeStatus: true,
      columnName: "surname",
      friendlyName: "Last Name",
      nounId: 10,
      type: "text",
      updatedAt: Date.now().toString(),
    },
    id: 2,
    question: {
      label: "Last Name",
      placeholderText: "Doe",
      required: true,
    },
  },
];

describe(`<CreateEditIntakeForm />`, () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    queryClient.setQueryData(`fields-1`, basicFieldsResponse);
    queryClient.setQueryData(`intake-form-1`, basicIntakeItemsResponse);
  });

  it(`renders some labeled inputs for fields`, async () => {
    const w = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/create-intake-form/1"]}>
          <Route
            path="/create-intake-form/:nounId"
            component={CreateEditIntakeForm}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(w.getByLabelText(`First Name`)).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(w.getByLabelText(`Last Name`)).toBeInTheDocument()
    );
  });

  it(`Opens an edit modal when you click on one of the fields`, async () => {
    const w = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/create-intake-form/1"]}>
          <Route
            path="/create-intake-form/:nounId"
            component={CreateEditIntakeForm}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const firstNameInput = await w.findByLabelText(`First Name`);

    expect(w.queryByRole("dialog")).not.toBeInTheDocument();
    expect(w.queryByText("Edit First Name")).not.toBeInTheDocument();

    fireEvent(
      firstNameInput,
      new MouseEvent("click", {
        bubbles: true,
      })
    );

    expect(w.queryByRole("dialog")).toBeInTheDocument();
    expect(w.queryByText("Edit First Name")).toBeInTheDocument();
  });
});
