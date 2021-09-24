import { Modal } from "./Modal";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

describe(`<Modal />`, () => {
  let close;

  beforeEach(() => {
    close = jest.fn();
  });

  it("Renders a modal screen and dialog", async () => {
    const w = render(<Modal title="Sample Header" close={close} />);
    const header = await w.findByText("Sample Header");
    expect(header).toBeInTheDocument();
    const dialog = document.querySelector<HTMLDialogElement>("dialog");
    expect(dialog).toBeInTheDocument();
    // @ts-ignore
    expect(dialog.open).toBe(true);
    expect(dialog.contains(header)).toBe(true);
  });

  it("calls props.close() when the close button is clicked", async () => {
    const w = render(<Modal title="Sample Header" close={close} />);
    expect(close).not.toHaveBeenCalled();
    fireEvent(
      await w.findByText("\u2716"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(close).toHaveBeenCalled();
  });
});
