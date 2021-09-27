import { CreateEditIntakeForm } from "./CreateEditIntakeForm";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Route } from "react-router-dom";

describe(`<CreateEditIntakeForm />`, () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it(`renders some labeled inputs for fields`, async () => {
    const w = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/create-intake-form/1"]}>
          <Route
            path="/create-intake-form/:id"
            component={CreateEditIntakeForm}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await w.findByLabelText(`First Name`)).toBeInTheDocument();
    expect(await w.findByLabelText(`Last Name`)).toBeInTheDocument();
  });

  it(`Opens an edit modal when you click on one of the fields`, async () => {
    const w = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/create-intake-form/1"]}>
          <Route
            path="/create-intake-form/:id"
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
