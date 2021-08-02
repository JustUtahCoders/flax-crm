import React, { useState } from "react";
import { Input, Form, Button, DropdownItemProps } from "semantic-ui-react";
import { RouterProps } from "react-router";
import { useMutation } from "react-query";
import { flaxFetch } from "../Utils/flaxFetch";
import { unary, kebabCase } from "lodash-es";
import { NounAttributes } from "../../models/noun";
import { FieldToCreate } from "../../backend/Fields/BatchPostFields";

export function CreateNoun(props: RouterProps) {
  const [nounName, setNounName] = useState<string>("");
  const [fields, setFields] = useState<FieldToCreate[]>([emptyField()]);

  const submitMutation = useMutation<
    NounAttributes,
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
    <Form onSubmit={unary(submitMutation.mutate)} style={{ padding: "4rem" }}>
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
      <Form.Field>
        {fields.map((field, i) => (
          <>
            <label htmlFor={`field-type-${i}`}>Field Type</label>
            <Form.Select
              options={fieldTypes}
              id={`field-type-${i}`}
              value={field.type}
              onChange={(evt, props) => {
                updateFieldType(i, props.value as string);
              }}
            ></Form.Select>
            <label htmlFor={`field-name-${i}`}>Field Name</label>
            <Input
              id={`field-name-${i}`}
              value={field.friendlyName}
              onChange={(evt) => updateFriendlyName(i, evt)}
            />
          </>
        ))}
      </Form.Field>
      <Button type="submit">Create Noun</Button>
    </Form>
  );

  function updateFriendlyName(i, evt: React.ChangeEvent<HTMLInputElement>) {
    updateField(i, (field) => {
      field.friendlyName = evt.target.value;
      return field;
    });
  }

  function updateFieldType(i, type: string) {
    updateField(i, (field) => {
      field.type = type;
      return field;
    });
  }

  function updateField(
    i: number,
    transform: (field: FieldToCreate) => FieldToCreate
  ) {
    setFields(
      fields.map((field, j) => {
        if (i === j) {
          return transform({ ...field });
        } else {
          return field;
        }
      })
    );
  }
}

const fieldTypes: DropdownItemProps[] = [
  {
    text: "Text",
    value: "string",
  },
  {
    text: "Date",
    value: "date",
  },
];

function emptyField(): FieldToCreate {
  return {
    friendlyName: "",
    columnName: "",
    type: "",
    activeStatus: true,
  };
}

export type DbDateTime = string;
