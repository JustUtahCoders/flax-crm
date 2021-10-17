import { HTMLProps } from "react";
import { Button, ButtonKind } from "./Button";

export function Modal(props: ModalProps) {
  return (
    <>
      {/* modal screen / overlay */}
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"></div>
      {/* dialog / content */}
      <dialog
        className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white divide-y divide-gray-200"
        open
      >
        <header className="flex items-center justify-between mb-2">
          <h1 className="text-xl">{props.title}</h1>
          <Button
            kind={ButtonKind.transparent}
            onClick={props.close}
            className="hover:bg-gray-200"
          >
            {"\u2716"}
          </Button>
        </header>
        <div className="pt-5">{props.children}</div>
      </dialog>
    </>
  );
}

export function ModalActions(props: ModalActionsProps) {
  return <div className="flex justify-end gap-3">{props.children}</div>;
}

interface ModalActionsProps {
  children?: React.ReactNode;
}

export interface ModalProps extends HTMLProps<HTMLDialogElement> {
  title: string;
  close(): any;
}
