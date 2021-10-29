import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TextArea } from "./TextArea";

describe("<TextArea />", () => {
  it("properly sets the text area value", async () => {
    const w = render(<TextArea aria-label="ta" value="test"></TextArea>);

    const textAreaEl = w.getByLabelText("ta") as HTMLTextAreaElement;
    expect(textAreaEl).toBeInTheDocument();
    expect(textAreaEl.value).toBe("test");
  });

  it("lets you add your own classes to the text area", async () => {
    const w = render(
      <TextArea aria-label="ta" value="test" className="cyanyoshi"></TextArea>
    );

    const textAreaEl = w.getByLabelText("ta") as HTMLTextAreaElement;
    expect(textAreaEl).toBeInTheDocument();
    expect(textAreaEl.classList.contains("cyanyoshi")).toBe(true);
    // styleguide classes should also be present
    expect(textAreaEl.className).not.toBe("cyanyoshi");
  });
});
