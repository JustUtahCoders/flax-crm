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
      onError: (error, variables, context) => {
        console.log(error);
      },
    }
  );

  return (
    <div className="flex flex-col items-center grid grid-cols-3 gap-r">
      <div className="flex items-center"></div>

      <div>
        <h1 className="text-xl text-gray-500 place-self-start pt-40 mb-6">
          Sign in
        </h1>
        <Form onSubmit={unary(submitMutation.mutate)}>
          <Form.Field>
            <label
              htmlFor="username"
              style={{
                fontFamily: "Source Sans Pro", // san serif
                color: "#403F3D",
                fontWeight: 600,
              }}
            >
              Email
            </label>
            <input
              id="username"
              type="email"
              className="ui input"
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
            <label
              htmlFor="password"
              style={{
                fontFamily: "Source Sans Pro",
                color: "#403F3D",
                fontWeight: 600,
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="ui input"
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

          <div className="py-8"></div>

          <div className="flex grid grid-cols-2 gap-4 space-x-4">
            <Button
              type="submit"
              style={{
                background: "#2a467b",
                color: "white",
              }}
              className="h-15 rounded font-medium flex-shrink"
            >
              Sign in
            </Button>
            <Link
              to="/reset-password"
              className="h-15 rounded self-center text-center font-medium text-blue-900 bg-white flex-shrink"
            >
              Reset Password
            </Link>
          </div>

          <div className="pt-6 pb-2 flex flex-row">
            <hr className="w-full mt-4 mb-8 border-gray-400"></hr>
            <span className="bg-white py-2 px-2 text-gray-400 text-sm">or</span>
            <hr className="w-full mt-4 mb-8 border-gray-400"></hr>
          </div>

          <Button className="ui grey basic button w-full" type="button">
            <a href="/auth/google">Continue with Google</a>
          </Button>

          <p className="text-center text-xs text-gray-600 py-8">
            New to Flax?{" "}
            <Link href="/create-account" className="underline text-blue-900">
              Create an account
            </Link>
          </p>
        </Form>
      </div>

      <div className="flex items-center"></div>
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
