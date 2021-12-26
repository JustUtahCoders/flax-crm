import React, { useState } from "react";
import { Button, ButtonKind } from "../Styleguide/Button";
import { FormField } from "../Styleguide/FormField";
import { FormFieldLabel } from "../Styleguide/FormFieldLabel";
import { Input } from "../Styleguide/Input";
import { RouterProps } from "react-router";
import { useMutation, useQuery } from "react-query";
import { flaxFetch } from "../Utils/flaxFetch";
import { unary } from "lodash-es";

export function FinishResetPassword(props: RouterProps) {
  const [finishResetPasswordFormData, setFinishResetPasswordFormData] =
    useState<FinishResetPasswordFormData>({
      password: "",
    });
  const [tokenIsValid, setTokenIsValid] =
    useState<boolean | undefined>(undefined);
  const [tokenIsExpired, setTokenIsExpired] =
    useState<boolean | undefined>(undefined);

  const paramString = props.history.location.search;
  let searchParams = new URLSearchParams(paramString);
  const token = searchParams.get("jwt") || "MISSING TOKEN";

  const queryFunctionHelper = (options) => {
    const token = options.queryKey[0];
    return flaxFetch<TokenValidationResponse>(
      `/validate-token/${token}?tokenType=passwordReset`,
      {
        method: "GET",
        signal: options.signal,
      }
    );
  };

  const tokenValidationResponse = useQuery<TokenValidationResponse>(
    token,
    queryFunctionHelper
  ).data;

  const userEmail = tokenValidationResponse?.email;

  const submitMutation = useMutation<
    void,
    Error,
    React.FormEvent<HTMLFormElement>
  >((evt) => {
    evt.preventDefault();
    const ac = new AbortController();
    let requestPromise = flaxFetch<void>(`/send-reset-password-email`, {
      method: "POST",
      signal: ac.signal,
      body: {
        password: finishResetPasswordFormData.password,
        token: token,
      },
    });
    return requestPromise;
  });

  return (
    <div className="flex justify-center h-screen p-24 sm:pt-80">
      {tokenValidationResponse?.tokenIsValid == true &&
      tokenValidationResponse?.tokenIsExpired == false ? (
        <form
          onSubmit={unary(submitMutation.mutate)}
          className="relative lg:max-w-sm w-64"
        >
          <h1 className="text-gray-500 place-self-start mb-2 text-5xl lg:text-xl">
            Set New Password
          </h1>

          <p className="text-left text-gray-600 py-8 text-4xl lg:text-sm">
            Enter your new password below.
          </p>

          <FormField className="mb-4">
            <FormFieldLabel className="text-3xl lg:text-xs" htmlFor="username">
              Email
            </FormFieldLabel>
            <Input
              id="username"
              type="email"
              placeholder={userEmail}
              value={userEmail}
              disabled
              className="text-gray-500"
            />
          </FormField>

          <FormField className="mb-4">
            <FormFieldLabel className="text-3xl lg:text-xs" htmlFor="password">
              Password
            </FormFieldLabel>
            <Input
              id="password"
              className="text-5xl lg:text-sm"
              type="password"
              value={finishResetPasswordFormData.password}
              onChange={(evt) =>
                setFinishResetPasswordFormData({
                  ...finishResetPasswordFormData,
                  password: evt.target.value,
                })
              }
              required
            />
          </FormField>

          <div className="absolute inset-x-0 my-8 bottom-0">
            <Button
              kind={ButtonKind.primary}
              type="submit"
              className="w-full h-24 lg:h-10 text-3xl lg:text-sm"
            >
              Submit New Password
            </Button>
          </div>
        </form>
      ) : (
        <div className="relative lg:max-w-sm w-64">
          <h1 className="text-gray-500 place-self-start mb-2 text-5xl lg:text-xl">
            Set New Password
          </h1>

          {tokenValidationResponse?.tokenIsValid == false ? (
            <p className="text-left text-gray-600 py-8 text-4xl lg:text-sm">
              This reset password link is not valid. Please try resetting your
              password again.
            </p>
          ) : (
            <p className="text-left text-gray-600 py-8 text-4xl lg:text-sm">
              This reset password link is expired. Please try resetting your
              password again.
            </p>
          )}

          <div className="absolute inset-x-0 my-8 bottom-0">
            <Button
              kind={ButtonKind.primary}
              type="submit"
              className="w-full h-24 lg:h-10 text-3xl lg:text-sm"
            >
              Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface FinishResetPasswordFormData {
  password: string;
}

interface TokenValidationResponse {
  tokenIsValid: boolean;
  tokenIsExpired: boolean;
  email: string;
}
