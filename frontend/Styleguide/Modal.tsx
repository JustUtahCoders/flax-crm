import { HTMLProps } from "react";
import { Button, ButtonKind } from "./Button";

export function Modal(props: ModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"></div>
      <dialog
        className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
        open
      >
        <header className="flex items-center justify-between p-4">
          <h1>{props.title}</h1>
          <Button
            kind={ButtonKind.transparent}
            onClick={props.close}
            className="hover:bg-gray-200 px-3"
          >
            {"\u2716"}
          </Button>
        </header>
      </dialog>
    </>
  );
}

export interface ModalProps extends HTMLProps<HTMLDialogElement> {
  title: string;
  close(): any;
}
