import { hydrate } from "react-dom";
import * as React from "react";
import { App } from "./App";
import "semantic-ui-css/semantic.min.css";

hydrate(<App />, document.documentElement);
