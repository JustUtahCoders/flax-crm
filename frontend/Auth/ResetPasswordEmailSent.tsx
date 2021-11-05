import React from "react";
import { useHistory } from "react-router";
import { Button, ButtonKind } from "../Styleguide/Button";

export function ResetPasswordEmailSent(props) {
  const { email } = props.location.state;

  const history = useHistory();

  if (!email) {
    history.push("/login");
  }

  return (
    <div className="flex justify-center h-screen">
      <div className="pt-40 max-w-sm">
        <h1 className="text-xl text-gray-500 place-self-start mb-2">
          Email Sent
        </h1>
        <p className="text-left text-s text-gray-600 py-8 mb-60">
          An email with reset instructions has been sent to {`${email}.`}
        </p>
        <div className="flex space-x-4 my-8">
          <Button kind={ButtonKind.primary} className="w-full mt-2">
            <a href="/login">Return To Sign In</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
