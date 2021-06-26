import { useState } from "react";
import { Input, Form, Button } from "semantic-ui-react";
import { RouterProps } from "react-router";
import { useMutation } from "react-query";
import { flaxFetch } from "../Utils/flaxFetch";
import { unary, kebabCase } from "lodash-es";

export function CreateNoun(props: RouterProps) {
  const [nounName, setNounName] = useState<string>("");

  const submitMutation = useMutation<
    Noun,
    Error,
    React.FormEvent<HTMLFormElement>
  >((evt) => {
    evt.preventDefault();
    return flaxFetch(`/api/nouns`, {
      method: "POST",
      body: {
        friendlyName: nounName,
        tableName: nounName,
        slug: kebabCase(nounName),
        parentId: null,
      },
    });
  });

  return (
    <Form onSubmit={unary(submitMutation.mutate)}>
      <Form.Field>
        <label htmlFor="noun-name">
          What is the name for this data? (Client, Donor, Lead, Invoice)
        </label>
        <Input
          id="noun-name"
          value={nounName}
          onChange={(evt) => setNounName(evt.target.value)}
          required
        />
      </Form.Field>
      <Button type="submit">Create Noun</Button>
    </Form>
  );
}

export interface Noun {
  id: number;
  tableName: string;
  slug: string;
  friendlyName: string;
  parentId?: number;
  createdAt: DbDateTime;
  updatedAt: DbDateTime;
}

export type DbDateTime = string;
