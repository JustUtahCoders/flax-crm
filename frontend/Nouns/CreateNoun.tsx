import React, { useState, useEffect, useReducer } from "react";
import { Input } from "../Styleguide/Input";
import { RouterProps, useHistory } from "react-router";
import { useMutation } from "react-query";
import { flaxFetch } from "../Utils/flaxFetch";
import { unary, kebabCase } from "lodash-es";
import { Noun } from "../../backend/DB/models/Noun";
import { FieldToCreate } from "../../backend/Fields/BatchPostFields";
import { FormField } from "../Styleguide/FormField";
import { FormFieldLabel } from "../Styleguide/FormFieldLabel";
import { Button, ButtonKind } from "../Styleguide/Button";
import { Card } from "../Styleguide/Card";

export function CreateNoun(props: RouterProps) {
  const [nounName, setNounName] = useState<string>("");
  const [{ fields, editIndex }, dispatchFieldState] = useReducer<
    FieldReducer,
    FieldState
  >(fieldReducer, initialFieldState, () => initialFieldState);
  const history = useHistory();

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

    history.push(`/create-intake-form/${noun.id}`);

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
    <form onSubmit={unary(submitMutation.mutate)} className="container p-20">
      <h1>Create Noun</h1>
      <FormField>
        <FormFieldLabel htmlFor="noun-name">
          What is the name for this data? (Client, Donor, Lead, Invoice)
        </FormFieldLabel>
        <Input
          id="noun-name"
          value={nounName}
          onChange={(evt) => setNounName(evt.target.value)}
          required
        />
      </FormField>
      {fields.map((field, i) => {
        const isEditing = i === editIndex;
        return (
          <React.Fragment key={i}>
            <Card
              onClick={(evt) => {
                evt.stopPropagation();
                dispatchFieldState({
                  type: FieldActions.EditField,
                  editIndex: i,
                });
              }}
            >
              {!isEditing && <h1>{field.friendlyName || "(No Name)"}</h1>}
              {isEditing ? (
                <>
                  <FormField>
                    <FormFieldLabel htmlFor={`field-name-${i}`}>
                      Field Name
                    </FormFieldLabel>
                    <Input
                      id={`field-name-${i}`}
                      value={field.friendlyName}
                      onChange={(evt) => updateFriendlyName(i, evt)}
                    />
                  </FormField>
                  <FormField>
                    <FormFieldLabel htmlFor={`field-type-${i}`}>
                      Field Type
                    </FormFieldLabel>
                    <select
                      id={`field-type-${i}`}
                      value={field.type}
                      onChange={(evt) => {
                        updateFieldType(i, evt.target.value);
                      }}
                    >
                      <option value="text">Text</option>
                      <option value="date">Date</option>
                    </select>
                  </FormField>
                </>
              ) : (
                field.type || "No type"
              )}
            </Card>
          </React.Fragment>
        );
      })}
      <div className="mt-8">
        <Button
          kind={ButtonKind.primary}
          type="button"
          onClick={() =>
            dispatchFieldState({
              type: FieldActions.AddField,
            })
          }
        >
          Add Field
        </Button>
        <Button kind={ButtonKind.secondary} type="submit">
          Create Noun
        </Button>
      </div>
    </form>
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
