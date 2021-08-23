import { StaticRouter, Route, Redirect } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { CreateNoun } from "./Nouns/CreateNoun";
import { QueryClient, QueryClientProvider } from "react-query";
import { Login } from "./Auth/Login";

const queryClient = new QueryClient();

export function App(props) {
  const inBrowser = typeof window !== "undefined";
  const assetBase =
    process.env.NODE_ENV === "production"
      ? "https://storage.googleapis.com/flax-crm-frontend/dist"
      : "http://localhost:7700";

  const Router = inBrowser ? BrowserRouter : StaticRouter;

  return (
    <QueryClientProvider client={queryClient}>
      <head>
        <link rel="stylesheet" href={`${assetBase}/main.css`}></link>
      </head>
      <body>
        <Router context={props.routerContext} location={props.reqUrl}>
          <Route path="/create-noun" component={CreateNoun} />
          <Route path="/login" component={Login} />
        </Router>
        <script src={`${assetBase}/flax.js`}></script>
      </body>
    </QueryClientProvider>
  );
}

export interface RouterContext {
  url?: string;
}
