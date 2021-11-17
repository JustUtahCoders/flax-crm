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
    void,
    Error,
    React.FormEvent<HTMLFormElement>
  >(
    (evt) => {
      evt.preventDefault();
      let requestPromise = flaxFetch<void>(`/send-reset-password-email`, {
        method: "POST",
        body: {
          email: resetPasswordFormData.email,
        },
      });
      return requestPromise;
    },
    {
      onSuccess: async (data, variables, context) => {
        history.push({
          pathname: "/reset-password-email-sent",
          state: { email: resetPasswordFormData.email },
        });
      },
    }
  );

  return (
    <div className="flex justify-center h-screen p-24 sm:pt-80">
      <form
        onSubmit={unary(submitMutation.mutate)}
        className="relative lg:max-w-sm"
      >
        <h1 className="text-gray-500 place-self-start mb-2 text-5xl lg:text-xl">
          Need a new password?
        </h1>
        <p className="text-left text-gray-600 py-8 text-4xl lg:text-sm">
          Enter the email address associated with your account and we'll send an
          email with a link to reset your password.
        </p>
        <FormField className="mb-40">
          <FormFieldLabel className="text-3xl lg:text-xs" htmlFor="email">
            Email
          </FormFieldLabel>
          <Input
            id="email"
            className="text-5xl lg:text-sm"
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

        <div className="absolute inset-x-0 my-8 bottom-0">
          <Button
            kind={ButtonKind.primary}
            type="submit"
            className="w-full h-24 lg:h-10 text-3xl lg:text-sm"
          >
            Send Reset Email
          </Button>
        </div>
      </form>
    </div>
  );
}

interface ResetPasswordFormData {
  email: string;
}
