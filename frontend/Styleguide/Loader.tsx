import { VisuallyHidden } from "@reach/visually-hidden";

export function Loader(props: LoaderProps) {
  return (
    <>
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r={"1.5rem"}
          className="fill-current text-primary"
        ></circle>
      </svg>
      <VisuallyHidden>{props.description}</VisuallyHidden>
    </>
  );
}

export interface LoaderProps {
  description: string;
}
