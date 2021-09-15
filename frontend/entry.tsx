import { hydrate } from "react-dom";
import * as React from "react";
import { App, AppProps } from "./App";
import "tailwindcss/tailwind.css";

const rootProps = JSON.parse(
  (document.querySelector("script#root-props") as HTMLElement)
    .textContent as string
) as AppProps;

hydrate(<App {...rootProps} />, document.documentElement);
