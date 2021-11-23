import { render } from "@testing-library/react";
import { IntakeHeaderItem, IntakeItemType } from "../CreateEditIntakeForm";
import { ViewIntakeHeader } from "./ViewIntakeHeader";

describe("<ViewIntakeHeader />", () => {
  it("changes font size based on nestingLevel", () => {
    const intakeItem: IntakeHeaderItem = {
      id: 1,
      textContent: "Test Header",
      type: IntakeItemType.Header,
    };

    // h1
    const wrapper = render(
      <ViewIntakeHeader intakeItem={intakeItem} nestingLevel={0} />
    );
    expect(wrapper.getByText("Test Header").nodeName).toBe("H1");
    expect(wrapper.getByText("Test Header").className).toBe("text-4xl");

    // h2
    wrapper.rerender(
      <ViewIntakeHeader intakeItem={intakeItem} nestingLevel={1} />
    );
    expect(wrapper.getByText("Test Header").nodeName).toBe("H2");
    expect(wrapper.getByText("Test Header").className).toBe("text-3xl");

    wrapper.rerender(
      <ViewIntakeHeader intakeItem={intakeItem} nestingLevel={2} />
    );
    expect(wrapper.getByText("Test Header").nodeName).toBe("H3");
    expect(wrapper.getByText("Test Header").className).toBe("text-2xl");

    wrapper.rerender(
      <ViewIntakeHeader intakeItem={intakeItem} nestingLevel={3} />
    );
    expect(wrapper.getByText("Test Header").nodeName).toBe("H4");
    expect(wrapper.getByText("Test Header").className).toBe("text-xl");

    wrapper.rerender(
      <ViewIntakeHeader intakeItem={intakeItem} nestingLevel={4} />
    );
    expect(wrapper.getByText("Test Header").nodeName).toBe("H5");
    expect(wrapper.getByText("Test Header").className).toBe("text-lg");

    wrapper.rerender(
      <ViewIntakeHeader intakeItem={intakeItem} nestingLevel={5} />
    );
    expect(wrapper.getByText("Test Header").nodeName).toBe("H6");
    expect(wrapper.getByText("Test Header").className).toBe("text-base");
  });
});
