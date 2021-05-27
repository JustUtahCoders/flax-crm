import * as React from "react";
import { Button } from "semantic-ui-react";

export function App() {
  const [text, setText] = React.useState<string | null>(null);

  React.useEffect(() => {
    setText("Hydrated");
  });

  return (
    <>
      <head>
        <link rel="stylesheet" href="http://localhost:7700/main.css"></link>
      </head>
      <body>
        <div>{text || "Hello world"}</div>
        <Button>Semantic button</Button>
        <script src="http://localhost:7700/flax.js"></script>
      </body>
    </>
  );
}
