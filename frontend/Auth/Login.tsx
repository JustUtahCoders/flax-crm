import { Button, Form } from "semantic-ui-react";

export function Login(props) {
  return (
    <Form method="post" action="/login">
      <Button type="submit">Login</Button>
    </Form>
  );
}
