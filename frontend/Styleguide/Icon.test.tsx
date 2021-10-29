import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Icon, IconVariant } from "./Icon";

describe("<Icon />", () => {
  it(`always renders a <title>`, () => {
    Object.keys(IconVariant).forEach((iconVariant) => {
      const w = render(<Icon variant={IconVariant.close} />);

      expect(w.baseElement.querySelector("title")).toBeInTheDocument();

      w.rerender(<Icon variant={IconVariant.close} alt="Donkey Kong" />);

      expect(w.queryByTitle("Donkey Kong")).toBeInTheDocument();
    });
  });
});
