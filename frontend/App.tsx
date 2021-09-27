import { StaticRouter, Route, Redirect } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { CreateNoun } from "./Nouns/CreateNoun";
import { QueryClient, QueryClientProvider } from "react-query";
import { Login } from "./Auth/Login";
import { CreateEditIntakeForm } from "./Nouns/CreateEditIntakeForm";

const queryClient = new QueryClient();

export function App(props: AppProps) {
  const inBrowser = typeof window !== "undefined";

  const Router = inBrowser ? BrowserRouter : StaticRouter;

  return (
    <QueryClientProvider client={queryClient}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap"
          rel="stylesheet"
        ></link>
        <meta
          name="google-signin-client_id"
          content="437751451243-do7cqgls9rooar4q430cr57nu24cgb5n.apps.googleusercontent.com"
        ></meta>
        <script
          type="application/json"
          id="root-props"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(props) }}
        />
        {props.cssFiles.map((cssFile) => (
          <link
            key={cssFile}
            rel="stylesheet"
            href={`${props.assetBase}/${cssFile}`}
          ></link>
        ))}
      </head>
      <body>
        {/* @ts-ignore */}
        <Router context={props.routerContext} location={props.reqUrl}>
          <Route path="/create-noun" component={CreateNoun} />
          <Route path="/login" component={Login} />
          <Route
            path="/create-intake-form/:nounId"
            component={CreateEditIntakeForm}
          />
        </Router>
        {props.jsFiles.map((jsFile) => (
          <script key={jsFile} src={`${props.assetBase}/${jsFile}`}></script>
        ))}
      </body>
    </QueryClientProvider>
  );
}

export interface RouterContext {
  url?: string;
}

export interface AppProps {
  routerContext: RouterContext;
  reqUrl: string;
  assetBase: string;
  jsFiles: string[];
  cssFiles: string[];
}
