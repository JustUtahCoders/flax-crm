/*
[] new frontend route /login. 
[] contain a card with inputs for email, password, and a submit button.

[] When the form submits, it should make a request to the backend to login, possibly sending the password as a base64 encoded string.

[] If the backend responds with a 200, it can be assumed that a cookie was set and the user is now logged in. At that time, the user should be redirected back to the home page.
*/

// Q: We need to import React here?
import React, { useState } from "react";
import { Button, Form, Card, Input } from "semantic-ui-react";
import { RouterProps } from "react-router";
import { useMutation } from "react-query";
import { flaxFetch } from "../Utils/flaxFetch";
import { unary } from "lodash-es";

export function Login(props: RouterProps) {
  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const submitMutation = useMutation<
    LoginFormData,
    Error,
    React.FormEvent<HTMLFormElement>
  >((evt) => {
    evt.preventDefault();
    console.log("loginFormData in mutation: ", loginFormData);
    return flaxFetch(`/login`, {
      method: "POST",
      body: {
        username: loginFormData.username,
        password: loginFormData.password,
      },
    });
  });

  // When the form submits, it should make a request to the backend to login, possibly sending the password as a base64 encoded string.

  return (
    // <Form method="post" action="/login">
    //   <Button type="submit">Login</Button>
    // </Form>

    // USE FOR LOADING FORM
    //   <Form loading>
    //   <Form.Input label='Email' placeholder='joe@schmoe.com' />
    //   <Button>Submit</Button>
    // </Form>

    // Q: What does the .mutate do?
    // https://react-query.tanstack.com/guides/mutations
    <Card>
      <Form onSubmit={unary(submitMutation.mutate)}>
        {/* <Form.Group> */}
        <Form.Field>
          <label htmlFor="username">Email</label>
          <input
            id="username"
            value={loginFormData.username}
            onChange={(evt) =>
              setLoginFormData({ ...loginFormData, username: evt.target.value })
            }
            placeholder="Email"
            required
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            value={loginFormData.password}
            onChange={(evt) =>
              setLoginFormData({ ...loginFormData, password: evt.target.value })
            }
            placeholder="Password"
            required
          />
        </Form.Field>

        <Button type="submit" color="teal">
          Submit
        </Button>
        {/* </Form.Group> */}
      </Form>
    </Card>

    // <form class="ui form">
    //   <div class="field">
    //     <label>First Name</label>
    //     <input type="text" name="first-name" placeholder="First Name">
    //   </div>
    //   <div class="field">
    //     <label>Last Name</label>
    //     <input type="text" name="last-name" placeholder="Last Name">
    //   </div>
    //   <div class="field">
    //     <div class="ui checkbox">
    //       <input type="checkbox" tabindex="0" class="hidden">
    //       <label>I agree to the Terms and Conditions</label>
    //     </div>
    //   </div>
    //   <button class="ui button" type="submit">Submit</button>
    // </form>
  );
}

// Passport requires the key "username"
export interface LoginFormData {
  username: string;
  password: string;
}

/*
  CHECKBOX
    <Form.Field>
    { <Checkbox label='I agree to the Terms and Conditions' /> }
    </Form.Field>
*/

/*
  ORIGINAL CODE
  export function Login(props) {
    return (
      <Form method="post" action="/login">
        <Button type="submit">Login</Button>
      </Form>
    );
  }
*/
