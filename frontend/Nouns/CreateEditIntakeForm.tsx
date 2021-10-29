import { useEffect, useReducer } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { RouteComponentProps } from "react-router";
import { Field } from "../../backend/DB/models/field";
import { useQuery } from "react-query";
import { Card } from "../Styleguide/Card";
import { Loader } from "../Styleguide/Loader";
import { Input } from "../Styleguide/Input";
import { FormFieldLabel } from "../Styleguide/FormFieldLabel";
import { FormField } from "../Styleguide/FormField";
import { EditIntakeItem } from "./EditIntakeItem";
import { Button, ButtonKind } from "../Styleguide/Button";
import { CreateIntakeItem } from "./CreateIntakeItem";
import { flaxFetch } from "../Utils/flaxFetch";

export function CreateEditIntakeForm(
  props: RouteComponentProps<{ id: string }>
) {
  const [state, dispatch] = useReducer<Reducer, State>(
    reducer,
    initialState,
    () => initialState
  );

  const nounId = props.match.params.id;

  const {
    data: fields,
    isLoading: isLoadingFields,
    isError: isErrorFields,
    error: errorFields,
  } = useQuery<Field[]>(`fields-${nounId}`, async () => {
    const r = await flaxFetch<{ fields: Field[] }>(
      `/api/nouns/${nounId}/fields`
    );
    return r.fields;
  });

  const {
    data: intakeItems,
    isLoading: isLoadingIntakeItems,
    isError: isErrorIntakeItems,
    error: errorIntakeItems,
  } = useQuery<IntakeItem[]>(`intake-form-${nounId}`, async () => {
    const r: GetIntakeItemsResponse = {
      intakeItems: [
        {
          type: IntakeItemType.Field,
          field: {
            createdAt: Date.now().toString(),
            id: 1,
            activeStatus: true,
            columnName: "givenName",
            friendlyName: "First Name",
            nounId: 10,
            type: "text",
            updatedAt: Date.now().toString(),
          },
          id: 1,
          question: {
            label: "First Name",
            placeholderText: "Jane",
            required: true,
          },
        },
        {
          type: IntakeItemType.Field,
          field: {
            createdAt: Date.now().toString(),
            id: 2,
            activeStatus: true,
            columnName: "surname",
            friendlyName: "Last Name",
            nounId: 10,
            type: "text",
            updatedAt: Date.now().toString(),
          },
          id: 2,
          question: {
            label: "Last Name",
            placeholderText: "Doe",
            required: true,
          },
        },
      ],
    };
    return r.intakeItems;
  });

  useEffect(() => {
    dispatch({
      type: ActionTypes.NounFieldsLoaded,
      nounFields: fields || [],
    });
  }, [fields]);

  useEffect(() => {
    dispatch({
      type: ActionTypes.IntakeItemsLoaded,
      intakeItems: intakeItems || [],
    });
  }, [intakeItems]);

  if (isLoadingIntakeItems || isLoadingFields) {
    return (
      <Card>
        <Loader description="Loading intake form" />
      </Card>
    );
  }

  if (isErrorIntakeItems || isErrorFields) {
    return (
      <Card>
        <h1>Error loading intake form</h1>
      </Card>
    );
  }

  return (
    <div className="container p-20">
      <div className="flex justify-between">
        <h1>Intake form for Noun</h1>
        <Button
          kind={ButtonKind.primary}
          onClick={() =>
            dispatch({
              type: ActionTypes.CreateItem,
            })
          }
        >
          Add Field
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="intake-form">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {state.intakeForm.intakeItems.map((item, i) => {
                const fieldItem = item as IntakeFieldItem;
                return (
                  <Draggable
                    key={item.id}
                    draggableId={String(item.id)}
                    index={i}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={snapshot.isDragging ? "outline-primary" : ""}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          dispatch({
                            type: ActionTypes.EditItem,
                            item,
                          })
                        }
                      >
                        <FormField className="pointer-events-none mt-3">
                          <FormFieldLabel htmlFor={`intake-item-${item.id}`}>
                            {fieldItem.question.label}
                          </FormFieldLabel>
                          <Input
                            id={`intake-item-${item.id}`}
                            placeholder={fieldItem.question.placeholderText}
                            required={fieldItem.question.required}
                            disabled
                          />
                        </FormField>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {state.itemToEdit && (
        <EditIntakeItem
          fields={state.nounFields}
          intakeItem={state.itemToEdit}
          close={() => {
            dispatch({
              type: ActionTypes.CancelEdit,
            });
          }}
        />
      )}
      {state.creatingItem && (
        <CreateIntakeItem
          fields={state.nounFields}
          addNewItem={(intakeItem: IntakeItem) => {
            dispatch({
              type: ActionTypes.AddNewItem,
              intakeItem,
            });
          }}
          close={() => {
            dispatch({
              type: ActionTypes.CancelCreate,
            });
          }}
        />
      )}
    </div>
  );

  function onDragEnd(result: DropResult) {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    dispatch({
      type: ActionTypes.Reorder,
      sourceIndex: result.source.index,
      destIndex: result.destination.index,
    });
  }
}

const initialState: State = {
  intakeForm: {
    intakeItems: [],
  },
  nounFields: [],
  creatingItem: false,
  itemToEdit: undefined,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.IntakeItemsLoaded:
      return modifyIntakeForm(state, {
        intakeItems: action.intakeItems,
      });
    case ActionTypes.Reorder:
      const newItems = [...state.intakeForm.intakeItems];
      const [removedItem] = newItems.splice(action.sourceIndex, 1);
      newItems.splice(action.destIndex, 0, removedItem);

      return modifyIntakeForm(state, {
        intakeItems: newItems,
      });
    case ActionTypes.EditItem:
      return {
        ...state,
        itemToEdit: action.item,
      };
    case ActionTypes.CancelEdit:
      return {
        ...state,
        itemToEdit: undefined,
      };
    case ActionTypes.CreateItem:
      return {
        ...state,
        creatingItem: true,
      };
    case ActionTypes.CancelCreate:
      return {
        ...state,
        creatingItem: false,
      };
    case ActionTypes.AddNewItem:
      return {
        ...state,
        intakeForm: {
          ...state.intakeForm,
          intakeItems: [...state.intakeForm.intakeItems, action.intakeItem],
        },
        creatingItem: false,
      };
    case ActionTypes.NounFieldsLoaded:
      return {
        ...state,
        nounFields: action.nounFields,
      };
    default:
      throw Error();
  }
}

function modifyIntakeForm(
  state: State,
  partialIntakeForm: Partial<IntakeForm>
) {
  return {
    ...state,
    intakeForm: {
      ...state.intakeForm,
      ...partialIntakeForm,
    },
  };
}

interface State {
  intakeForm: IntakeForm;
  itemToEdit?: IntakeItem;
  creatingItem?: boolean;
  nounFields: Field[];
}

interface IntakeForm {
  intakeItems: IntakeItem[];
}

enum ActionTypes {
  IntakeItemsLoaded = "IntakeItemsLoaded",
  Reorder = "Reorder",
  EditItem = "EditItem",
  CancelEdit = "CancelEdit",
  CreateItem = "CreateItem",
  CancelCreate = "CancelCreate",
  AddNewItem = "AddNewItem",
  NounFieldsLoaded = "NounFieldsLoaded",
}

export enum IntakeItemType {
  Field = "Field",
  Section = "Section",
  Page = "Page",
  Header = "Header",
  Paragraph = "Paragraph",
}

export interface IntakeFieldItem {
  type: IntakeItemType.Field;
  id: number;
  field: Field;
  question: FieldQuestion;
}

export interface IntakeSectionItem {
  type: IntakeItemType.Section;
  id: number;
  intakeItems: IntakeItem[];
}

interface FieldQuestion {
  label: string;
  required: boolean;
  placeholderText: string;
}

export type IntakeItem = IntakeFieldItem | IntakeSectionItem;

interface IntakeItemsLoadedAction {
  type: ActionTypes.IntakeItemsLoaded;
  intakeItems: IntakeItem[];
}

interface ReorderAction {
  type: ActionTypes.Reorder;
  sourceIndex: number;
  destIndex: number;
}

interface EditItemAction {
  type: ActionTypes.EditItem;
  item: IntakeItem;
}

interface CancelEditAction {
  type: ActionTypes.CancelEdit;
}

interface CreateAction {
  type: ActionTypes.CreateItem;
}

interface CancelCreateAction {
  type: ActionTypes.CancelCreate;
}

interface AddNewItem {
  type: ActionTypes.AddNewItem;
  intakeItem: IntakeItem;
}

interface NounFieldsLoaded {
  type: ActionTypes.NounFieldsLoaded;
  nounFields: Field[];
}

type Action =
  | IntakeItemsLoadedAction
  | ReorderAction
  | EditItemAction
  | CancelEditAction
  | CreateAction
  | CancelCreateAction
  | AddNewItem
  | NounFieldsLoaded;

type Reducer = (state: State, action: Action) => State;

interface RouteParams {
  nounId: string;
}

interface GetIntakeItemsResponse {
  intakeItems: IntakeItem[];
}
