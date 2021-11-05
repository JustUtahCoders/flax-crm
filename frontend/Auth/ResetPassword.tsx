import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, ButtonKind } from "../Styleguide/Button";
import { FormField } from "../Styleguide/FormField";
import { FormFieldLabel } from "../Styleguide/FormFieldLabel";
import { Input } from "../Styleguide/Input";
import { RouterProps } from "react-router";
import { useMutation } from "react-query";
import { flaxFetch } from "../Utils/flaxFetch";
import { unary } from "lodash-es";

export function ResetPassword(props: RouterProps) {
  const [resetPasswordFormData, setResetPasswordFormData] =
    useState<ResetPasswordFormData>({
      email: "",
    });

  const history = useHistory();

  const submitMutation = useMutation<
    ResetPasswordResultData,
    Error,
    React.FormEvent<HTMLFormElement>
  >(
    (evt) => {
      evt.preventDefault();
      let requestPromise = flaxFetch<ResetPasswordResultData>(
        `/send-reset-password-email`,
        {
          method: "POST",
          body: {
            email: resetPasswordFormData.email,
          },
        }
      );
      return requestPromise;
    },
    {
      onSuccess: async (data, variables, context) => {
        history.push({
          pathname: "/reset-password-email-sent",
          state: { email: resetPasswordFormData.email },
        });
      },
      onError: (error, variables, context) => {
        console.log(error);
      },
    }
  );

  return (
    <div className="flex justify-center h-screen">
      <form onSubmit={unary(submitMutation.mutate)} className="pt-40 max-w-sm">
        <h1 className="text-xl text-gray-500 place-self-start mb-2">
          Need a new password?
        </h1>
        <p className="text-left text-s text-gray-600 py-8">
          Enter the email address associated with your account and we'll send an
          email with a link to reset your password.
        </p>
        <FormField className="mb-40">
          <FormFieldLabel htmlFor="email">Email</FormFieldLabel>
          <Input
            id="email"
            type="email"
            value={resetPasswordFormData.email}
            onChange={(evt) =>
              setResetPasswordFormData({
                ...resetPasswordFormData,
                email: evt.target.value,
              })
            }
            required
          />
        </FormField>

        <div className="flex space-x-4 my-8">
          <Button kind={ButtonKind.primary} type="submit" className="w-full">
            Send Reset Email
          </Button>
        </div>
      </form>
    </div>
  );
}

export interface ResetPasswordResultData {
  success: boolean;
}

export interface ResetPasswordFormData {
  email: string;
}
