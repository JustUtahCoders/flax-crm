import { hydrate } from "react-dom";
import * as React from "react";
import { App, AppProps } from "./App";
import "semantic-ui-css/semantic.min.css";
import "tailwindcss/tailwind.css";

const rootProps = JSON.parse(
  (document.querySelector("script#root-props") as HTMLElement)
    .textContent as string
) as AppProps;

hydrate(<App {...rootProps} />, document.documentElement);
