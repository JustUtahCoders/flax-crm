import React, { useEffect, useState } from "react";
import { Button, ButtonKind } from "../Styleguide/Button";
import { Anchor } from "../Styleguide/Anchor";
import { FormField } from "../Styleguide/FormField";
import { FormFieldLabel } from "../Styleguide/FormFieldLabel";
import { Input } from "../Styleguide/Input";
import { RouterProps } from "react-router";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { flaxFetch } from "../Utils/flaxFetch";
import { unary } from "lodash-es";

export function FinishResetPassword(props: RouterProps) {
  const [finishResetPasswordFormData, setFinishResetPasswordFormData] =
    useState<FinishResetPasswordFormData>({
      password: "",
    });
  const [
    finishResetPasswordFormDataCheck,
    setFinishResetPasswordFormDataCheck,
  ] = useState<FinishResetPasswordFormData>({
    password: "",
  });
  const [finishResetPasswordErrors, setFinishResetPasswordErrors] =
    useState<FinishResetPasswordErrors>({
      message: "",
      passwordCheck: "",
    });
  const [passwordSaveSucceeded, setPasswordSaveSucceeded] = useState(false);

  const paramString = props.history.location.search;
  let searchParams = new URLSearchParams(paramString);
  const token = searchParams.get("jwt") || "MISSING TOKEN";

  const queryFunctionHelper = (options) => {
    const token = options.queryKey[0];
    return flaxFetch<TokenValidationResponse>(
      `/api/validate-token/${token}?tokenType=passwordReset`,
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

  useEffect(() => {
    if (passwordSaveSucceeded) {
      props.history.push("/home");
    }
  }, [props.history, passwordSaveSucceeded]);

  const submitMutation = useMutation<
    TokenValidationResponse,
    Error,
    React.FormEvent<HTMLFormElement>
  >(
    (evt) => {
      evt.preventDefault();

      if (
        finishResetPasswordFormData.password !==
        finishResetPasswordFormDataCheck.password
      ) {
        setFinishResetPasswordErrors({
          message: "",
          passwordCheck: "Passwords do not match",
        });
        return Promise.resolve({
          tokenIsValid: false,
          tokenIsExpired: false,
        });
      }

      const ac = new AbortController();

      if (token) {
        return flaxFetch<TokenValidationResponse>(`/api/passwords`, {
          method: "PUT",
          signal: ac.signal,
          body: {
            password: finishResetPasswordFormData.password,
            token: token,
          },
        });
      } else {
        return Promise.resolve({
          tokenIsValid: false,
          tokenIsExpired: false,
        });
      }
    },
    {
      onSuccess: async (data, variables, context) => {
        setPasswordSaveSucceeded(true);
      },
      onError: (error, variables, context) => {
        setFinishResetPasswordErrors({
          // @ts-ignore
          message: error.body.errors[0],
          passwordCheck: "",
        });
      },
    }
  );

  return (
    <div className="flex justify-center h-screen p-24 sm:pt-80">
      {tokenValidationResponse?.tokenIsValid === true &&
      tokenValidationResponse?.tokenIsExpired === false ? (
        <form
          onSubmit={unary(submitMutation.mutate)}
          className="space-y-32 relative lg:max-w-sm w-64"
        >
          <div>
            <h1 className="text-gray-500 place-self-start mb-2 text-5xl lg:text-xl">
              Set New Password
            </h1>

            <p className="text-left text-gray-600 py-8 text-4xl lg:text-sm">
              Enter your new password below.
            </p>

            <FormField className="mb-4">
              <FormFieldLabel
                className="text-3xl lg:text-xs"
                htmlFor="username"
              >
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
              <FormFieldLabel
                className="text-3xl lg:text-xs"
                htmlFor="password"
              >
                New Password
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
            <FormField className="mb-4">
              <FormFieldLabel
                className="text-3xl lg:text-xs"
                htmlFor="passwordCheck"
              >
                Re-enter Password
              </FormFieldLabel>
              <Input
                id="passwordCheck"
                className="text-5xl lg:text-sm"
                type="password"
                value={finishResetPasswordFormDataCheck.password}
                onChange={(evt) =>
                  setFinishResetPasswordFormDataCheck({
                    ...finishResetPasswordFormDataCheck,
                    password: evt.target.value,
                  })
                }
                required
              />
            </FormField>
            <p className="text-sm text-gray-500">
              {finishResetPasswordErrors.passwordCheck}
            </p>
            <p className="text-sm text-gray-500">
              {finishResetPasswordErrors.message}
            </p>
          </div>

          <div className="inset-x-0 my-8 bottom-0">
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
        <div className="space-y-32 relative lg:max-w-sm w-64">
          <div>
            <h1 className="text-gray-500 place-self-start mb-2 text-5xl lg:text-xl">
              Set New Password
            </h1>

            {tokenValidationResponse?.tokenIsValid == false ? (
              <p className="text-left text-gray-600 py-8 text-4xl lg:text-sm">
                This reset password link is not valid. Please try{" "}
                <Link to="/reset-password" className="text-classic-link">
                  resetting your password
                </Link>{" "}
                again.
              </p>
            ) : (
              <p className="text-left text-gray-600 py-8 text-4xl lg:text-sm">
                This reset password link is expired. Please try{" "}
                <Link to="/reset-password" className="text-classic-link">
                  resetting your password
                </Link>{" "}
                again.
              </p>
            )}
          </div>

          <div className="inset-x-0 my-8 bottom-0">
            <Anchor kind={ButtonKind.primary} to="/login">
              Login
            </Anchor>
          </div>
        </div>
      )}
    </div>
  );
}

interface FinishResetPasswordFormData {
  password: string | undefined;
}

interface FinishResetPasswordFormDataCheck {
  password: string | undefined;
}

interface FinishResetPasswordErrors {
  message: string | undefined;
  passwordCheck: string | undefined;
}

interface TokenValidationResponse {
  tokenIsValid: boolean;
  tokenIsExpired: boolean;
  email?: string;
}
