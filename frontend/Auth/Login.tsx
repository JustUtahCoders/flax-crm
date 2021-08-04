/*
[x] new frontend route /login. 
[x] contain a card with inputs for email, password, and a submit button.

[] When the form submits, it should make a request to the backend to login, possibly sending the password as a base64 encoded string.

[] If the backend responds with a 200, it can be assumed that a cookie was set and the user is now logged in. At that time, the user should be redirected back to the home page.
*/

// Q: Do we need to import React here?
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Form, Card } from "semantic-ui-react";
import { RouterProps } from "react-router";
import { useMutation } from "react-query";
import { flaxFetch } from "../Utils/flaxFetch";
import { unary } from "lodash-es";

export function Login(props: RouterProps) {
  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const history = useHistory();
  /* ORGINAL CODE
  const submitMutation = useMutation<
    LoginResultData, // should be what backend login endpoint returns
    Error,
    React.FormEvent<HTMLFormElement>
  >((evt) => {
    evt.preventDefault();
    console.log("loginFormData in mutation: ", loginFormData);
    let requestPromise = flaxFetch<LoginResultData>(`/login`, {
      method: "POST",
      body: {
        username: loginFormData.username,
        password: loginFormData.password,
      },
    });
    console.log("-------------------requestPromise: ", requestPromise);
    return requestPromise;
  });
  */

  // GOAL:  Get the 200 from server, then redirect to home page
  // CHALLENGE:  How to get the 200 from the server?

  const submitMutation = useMutation<
    LoginResultData,
    Error,
    React.FormEvent<HTMLFormElement>
  >(
    (evt) => {
      evt.preventDefault();
      console.log(
        "--------------------------loginFormData in mutation: ",
        loginFormData
      );
      let requestPromise = flaxFetch<LoginResultData>(`/login`, {
        method: "POST",
        body: {
          username: loginFormData.username,
          password: loginFormData.password,
        },
      });
      console.log("-------------------result: ", requestPromise);
      return requestPromise;
    },
    {
      onSuccess: async (data, variables, context) => {
        history.push("/home");
      },
    }
  );

  console.log("submitMutation", submitMutation);
  console.log("submitMutation.isSuccess", submitMutation.isSuccess);

  // ATTEMPT TWO - PROMISE
  // const submitMutation = useMutation<LoginResultData, Error, React.FormEvent<HTMLFormElement>>();

  // try {
  //   const result = await submitMutation.mutateAsync((evt) => {
  //     evt.preventDefault();
  //     console.log("--------------------------loginFormData in mutation: ", loginFormData);
  //     let result = flaxFetch<LoginResultData>(`/login`, {
  //       method: "POST",
  //       body: {
  //         username: loginFormData.username,
  //         password: loginFormData.password,
  //       },
  //     });
  //     console.log("-------------------result: ", result);
  //     return result;
  //   })
  //   console.log("result", result)
  // } catch (error) {
  //   console.error(error)
  // } finally {
  //   console.log('done')
  // }

  // useMutation(addTodo, {
  //   onSuccess: async () => {
  //     console.log("I'm first!")
  //   },
  //   onSettled: async () => {
  //     console.log("I'm second!")
  //   },
  // })

  // async function asyncCall() {
  //   console.log('calling');
  //   const result = await resolveAfter2Seconds();
  //   console.log(result);
  //   // expected output: "resolved"
  // }

  return (
    // Q: What does the .mutate do?
    // https://react-query.tanstack.com/guides/mutations
    <Card>
      <h1 style={{ color: "#646461" }}>Sign in</h1>
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
            required
          />
        </Form.Field>

        <Button
          type="submit"
          style={{
            background: "#2a467b",
            color: "white",
            width: "50%",
            margin: 0,
          }}
        >
          Sign in
        </Button>

        <Button
          type="submit"
          style={{
            background: "white",
            color: "#2a467b",
            width: "50%",
            margin: 0,
          }}
        >
          Reset Password
        </Button>

        <div
          style={{
            width: "100%",
            height: "10px",
            textAlign: "center",
            borderBottom: "1px solid #b3b3b1",
            color: "#b3b3b1",
          }}
        >
          {/* <div style={{ borderBottom: "1px solid black", width: "100%", height: "20px", text-align: "center"}}> */}
          <span
            style={{
              fontSize: "10px",
              backgroundColor: "white",
              padding: "0 10px",
            }}
          >
            or
          </span>
          {/* <span style={{"font-size: 40px; background-color: #F3F5F6; padding: 0 10px;"}}> */}
          {/* Section Title <!--Padding is optional--> */}
          {/* </span> */}
        </div>
        {/* </Form.Group> */}
      </Form>
    </Card>
  );
}

export interface LoginResultData {
  success: boolean;
}

export interface LoginFormData {
  username: string;
  password: string;
}
