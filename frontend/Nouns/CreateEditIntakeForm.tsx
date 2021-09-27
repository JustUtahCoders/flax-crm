import { useReducer } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { RouterProps, useParams } from "react-router";
import { Field } from "../../backend/DB/models/field";
import { useQuery } from "react-query";
import { Card } from "../Styleguide/Card";
import { Loader } from "../Styleguide/Loader";
import { Input } from "../Styleguide/Input";
import { FormFieldLabel } from "../Styleguide/FormFieldLabel";
import { FormField } from "../Styleguide/FormField";
import { Modal } from "../Styleguide/Modal";

export function CreateEditIntakeForm(props: RouterProps) {
  const [state, dispatch] = useReducer<Reducer, State>(
    reducer,
    initialState,
    () => initialState
  );
  const { nounId } = useParams<RouteParams>();
  const { isLoading, isError, error } = useQuery<IntakeItem[]>(
    `fields-${nounId}`,
    async () => {
      // const r = await flaxFetch<GetFieldsResponse>(`/api/nouns/${nounId}/fields`)
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
      dispatch({
        type: ActionTypes.IntakeItemsLoaded,
        intakeItems: r.intakeItems,
      });
      return r.intakeItems;
    }
  );

  if (isLoading) {
    return (
      <Card>
        <Loader description="Loading intake form" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <h1>Error loading intake form</h1>
      </Card>
    );
  }

  return (
    <div className="container p-20">
      <h1>Intake form for Noun</h1>
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
        {state.itemToEdit && (
          <Modal
            title={`Edit ${state.itemToEdit.field.friendlyName}`}
            close={() =>
              dispatch({
                type: ActionTypes.CancelEdit,
              })
            }
          />
        )}
      </DragDropContext>
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
}

interface IntakeForm {
  intakeItems: IntakeItem[];
}

enum ActionTypes {
  IntakeItemsLoaded = "IntakeItemsLoaded",
  Reorder = "Reorder",
  EditItem = "EditItem",
  CancelEdit = "CancelEdit",
}

enum IntakeItemType {
  Field = "Field",
}

interface IntakeFieldItem {
  type: IntakeItemType.Field;
  id: number;
  field: Field;
  question: FieldQuestion;
}

interface FieldQuestion {
  label: string;
  required: boolean;
  placeholderText: string;
}

type IntakeItem = IntakeFieldItem;

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

type Action =
  | IntakeItemsLoadedAction
  | ReorderAction
  | EditItemAction
  | CancelEditAction;

type Reducer = (state: State, action: Action) => State;

interface RouteParams {
  nounId: string;
}

interface GetIntakeItemsResponse {
  intakeItems: IntakeItem[];
}
