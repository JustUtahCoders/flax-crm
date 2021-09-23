/*
[x] new frontend route /login. 
[x] contain a card with inputs for email, password, and a submit button.

[x] When the form submits, it should make a request to the backend to login, possibly sending the password as a base64 encoded string.

[x] If the backend responds with a 200, it can be assumed that a cookie was set and the user is now logged in. At that time, the user should be redirected back to the home page.
*/

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, ButtonKind } from "../Styleguide/Button";
import { Anchor } from "../Styleguide/Anchor";
import { FormField } from "../Styleguide/FormField";
import { FormFieldLabel } from "../Styleguide/FormFieldLabel";
import { Input } from "../Styleguide/Input";
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
    <div className="flex justify-center h-screen">
      <form onSubmit={unary(submitMutation.mutate)} className="pt-40">
        <h1 className="text-xl text-gray-500 place-self-start mb-6">Sign in</h1>
        <FormField>
          <FormFieldLabel htmlFor="username">Email</FormFieldLabel>
          <Input
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
        </FormField>
        <FormField className="mt-4">
          <FormFieldLabel htmlFor="password">Password</FormFieldLabel>
          <Input
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
        </FormField>
        <div className="flex space-x-4 my-8">
          <Button kind={ButtonKind.primary} type="submit" className="mr-8">
            Sign in
          </Button>
          <Anchor kind={ButtonKind.transparent} to="/reset-password">
            Reset Password
          </Anchor>
        </div>

        <div className="pt-6 pb-2 flex flex-row">
          <hr className="w-full mt-4 mb-8 border-gray-400"></hr>
          <span className="bg-white py-2 px-2 text-gray-400 text-sm">or</span>
          <hr className="w-full mt-4 mb-8 border-gray-400"></hr>
        </div>

        <Anchor
          kind={ButtonKind.secondary}
          className="w-full"
          href="/auth/google"
        >
          Continue with Google
        </Anchor>

        <p className="text-center text-xs text-gray-600 py-8">
          New to Flax?{" "}
          <Anchor kind={ButtonKind.classic} href="/create-account">
            Create an account
          </Anchor>
        </p>
      </form>
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
