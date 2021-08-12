import React, { useState, useEffect, useReducer } from "react";
import {
  Input,
  Form,
  Button,
  DropdownItemProps,
  Card,
} from "semantic-ui-react";
import { RouterProps } from "react-router";
import { useMutation } from "react-query";
import { flaxFetch } from "../Utils/flaxFetch";
import { unary, kebabCase } from "lodash-es";
import { Noun } from "../../models/noun";
import { FieldToCreate } from "../../backend/Fields/BatchPostFields";

export function CreateNoun(props: RouterProps) {
  const [nounName, setNounName] = useState<string>("");
  const [{ fields, editIndex }, dispatchFieldState] = useReducer<
    FieldReducer,
    FieldState
  >(fieldReducer, initialFieldState, () => initialFieldState);

  const submitMutation = useMutation<
    Noun,
    Error,
    React.FormEvent<HTMLFormElement>
  >(async (evt) => {
    evt.preventDefault();

    const noun = await flaxFetch<Noun>(`/api/nouns`, {
      method: "POST",
      body: {
        friendlyName: nounName,
        tableName: nounName,
        slug: kebabCase(nounName),
        parentId: null,
      },
    });

    await flaxFetch<void>(`/api/nouns/${noun.id}/fields`, {
      method: "POST",
      body: {
        fields,
      },
    });

    return noun;
  });

  useEffect(() => {
    document.addEventListener("click", clearEditedField);
    return () => {
      document.removeEventListener("click", clearEditedField);
    };

    function clearEditedField() {
      dispatchFieldState({
        type: FieldActions.ClearEdit,
      });
    }
  });

  return (
    <Form onSubmit={unary(submitMutation.mutate)} className="container p-20">
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
      <Card.Group onClick={(evt) => evt.stopPropagation()}>
        {fields.map((field, i) => {
          const isEditing = i === editIndex;
          return (
            <React.Fragment key={i}>
              <Card
                onClick={() =>
                  dispatchFieldState({
                    type: FieldActions.EditField,
                    editIndex: i,
                  })
                }
              >
                <Card.Content>
                  {!isEditing && (
                    <Card.Header>
                      {field.friendlyName || "(No Name)"}
                    </Card.Header>
                  )}
                  <Card.Meta>
                    {isEditing ? (
                      <>
                        <Form.Field>
                          <label htmlFor={`field-name-${i}`}>Field Name</label>
                          <Input
                            id={`field-name-${i}`}
                            value={field.friendlyName}
                            onChange={(evt) => updateFriendlyName(i, evt)}
                          />
                        </Form.Field>
                        <Form.Field>
                          <label htmlFor={`field-type-${i}`}>Field Type</label>
                          <Form.Select
                            options={fieldTypes}
                            id={`field-type-${i}`}
                            value={field.type}
                            onChange={(evt, props) => {
                              updateFieldType(i, props.value as string);
                            }}
                          ></Form.Select>
                        </Form.Field>
                      </>
                    ) : (
                      field.type || "No type"
                    )}
                  </Card.Meta>
                </Card.Content>
              </Card>
            </React.Fragment>
          );
        })}
      </Card.Group>
      <div className="mt-8">
        <Button
          primary
          type="button"
          onClick={() =>
            dispatchFieldState({
              type: FieldActions.AddField,
            })
          }
        >
          Add Field
        </Button>
        <Button secondary type="submit">
          Create Noun
        </Button>
      </div>
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
    dispatchFieldState({
      type: FieldActions.UpdateFields,
      update(fields) {
        return fields.map((field, j) => {
          if (i === j) {
            return transform({ ...field });
          } else {
            return field;
          }
        });
      },
    });
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

function fieldReducer(oldState: FieldState, action: FieldAction): FieldState {
  switch (action.type) {
    case FieldActions.ClearEdit:
      return {
        ...oldState,
        editIndex: null,
      };
    case FieldActions.EditField:
      return {
        ...oldState,
        editIndex: action.editIndex,
      };
    case FieldActions.AddField:
      return {
        ...oldState,
        fields: oldState.fields.concat(emptyField()),
      };
    case FieldActions.UpdateFields:
      return {
        ...oldState,
        fields: action.update(oldState.fields),
      };
    default:
      throw Error();
  }
}

const initialFieldState: FieldState = {
  fields: [],
  editIndex: null,
};

interface FieldState {
  fields: FieldToCreate[];
  editIndex: number | null;
}

enum FieldActions {
  ClearEdit = "ClearEdit",
  EditField = "EditField",
  AddField = "AddField",
  UpdateFields = "UpdateFields",
  ClearEmptyFields = "ClearEmptyFields",
}

type ClearEditedField = {
  type: FieldActions.ClearEdit;
};

type EditField = {
  type: FieldActions.EditField;
  editIndex: number;
};

type AddField = {
  type: FieldActions.AddField;
};

type UpdateFields = {
  type: FieldActions.UpdateFields;
  update(fields: FieldToCreate[]): FieldToCreate[];
};

type FieldAction = ClearEditedField | EditField | AddField | UpdateFields;

type FieldReducer = (oldState: FieldState, action: FieldAction) => FieldState;

export type DbDateTime = string;
