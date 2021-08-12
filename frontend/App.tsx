import { StaticRouter, Route, Redirect } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { CreateNoun } from "./Nouns/CreateNoun";
import { QueryClient, QueryClientProvider } from "react-query";
import { Login } from "./Auth/Login";
import { CreateEditIntakeForm } from "./Nouns/CreateEditIntakeForm";

const queryClient = new QueryClient();

export function App(props) {
  const inBrowser = typeof window !== "undefined";

  const Router = inBrowser ? BrowserRouter : StaticRouter;

  return (
    <QueryClientProvider client={queryClient}>
      <head>
        <link rel="stylesheet" href="http://localhost:7700/main.css"></link>
      </head>
      <body>
        <Router context={props.routerContext} location={props.reqUrl}>
          <Route path="/create-noun" component={CreateNoun} />
          <Route
            path="/create-intake-form/:nounId"
            component={CreateEditIntakeForm}
          />
          <Route path="/login" component={Login} />
        </Router>
        <script src="http://localhost:7700/flax.js"></script>
      </body>
    </QueryClientProvider>
  );
}

export interface RouterContext {
  url?: string;
}
