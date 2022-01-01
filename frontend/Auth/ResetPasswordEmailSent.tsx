import React from "react";
import { Redirect } from "react-router";
import { Button, ButtonKind } from "../Styleguide/Button";
import { Anchor } from "../Styleguide/Anchor";

export function ResetPasswordEmailSent(props) {
  const { email } = props.location.state;

  if (!email) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="flex justify-center h-screen">
      <div className="space-y-72 pt-40 w-64 max-w-sm">
        <div>
          <h1 className="text-xl text-gray-500 place-self-start mb-6">
            Email Sent
          </h1>
          <p className="text-left text-gray-600 text-sm">
            An email with reset instructions has been sent to {email}
          </p>
        </div>
        <div className="my-8 lg:text-sm">
          <Anchor kind={ButtonKind.primary} to="/login">
            Return To Sign In
          </Anchor>
        </div>
      </div>
    </div>
  );
}
