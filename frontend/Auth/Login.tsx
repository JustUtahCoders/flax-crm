/*
[x] new frontend route /login. 
[x] contain a card with inputs for email, password, and a submit button.

[x] When the form submits, it should make a request to the backend to login, possibly sending the password as a base64 encoded string.

[x] If the backend responds with a 200, it can be assumed that a cookie was set and the user is now logged in. At that time, the user should be redirected back to the home page.
*/

import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
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

  const submitMutation = useMutation<
    LoginResultData,
    Error,
    React.FormEvent<HTMLFormElement>
  >(
    (evt) => {
      evt.preventDefault();
      let requestPromise = flaxFetch<LoginResultData>(`/login`, {
        method: "POST",
        body: {
          username: loginFormData.username,
          password: loginFormData.password,
        },
      });
      return requestPromise;
    },
    {
      onSuccess: async (data, variables, context) => {
        history.push("/home");
      },
    }
  );

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card
        style={{
          padding: "10px",
          width: "30%",
          boxShadow: "none",
          marginTop: "15%",
        }}
      >
        <h1 style={{ color: "#646461", fontSize: "20px" }}>Sign in</h1>
        <Form onSubmit={unary(submitMutation.mutate)}>
          <Form.Field>
            <label htmlFor="username">Email</label>
            <input
              id="username"
              type="email"
              value={loginFormData.username}
              onChange={(evt) =>
                setLoginFormData({
                  ...loginFormData,
                  username: evt.target.value,
                })
              }
              required
            />
          </Form.Field>

          <Form.Field>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={loginFormData.password}
              onChange={(evt) =>
                setLoginFormData({
                  ...loginFormData,
                  password: evt.target.value,
                })
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
            // <Link href="/reset-password">
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

          <div style={{ marginTop: "20px", marginBottom: "10px" }}>
            <div
              style={{
                width: "100%",
                height: "10px",
                textAlign: "center",
                borderBottom: "1px solid #b3b3b1",
                color: "#b3b3b1",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  backgroundColor: "white",
                  padding: "0 10px",
                }}
              >
                or
              </span>
            </div>
          </div>

          <div className="g-signin2" data-onsuccess="onSignIn"></div>

          <p
            style={{ textAlign: "center", fontSize: "12px", marginTop: "30px" }}
          >
            New to Flax?{" "}
            <Link
              href="/create-account"
              style={{ textDecoration: "underline" }}
            >
              Create an account
            </Link>
          </p>
        </Form>
      </Card>
    </div>
  );
}

export interface LoginResultData {
  success: boolean;
}

export interface LoginFormData {
  username: string;
  password: string;
}
