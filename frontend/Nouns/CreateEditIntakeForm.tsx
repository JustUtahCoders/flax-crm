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

export function CreateEditIntakeForm(props: RouterProps) {
  const [state, dispatch] = useReducer<Reducer, State>(
    reducer,
    initialState,
    () => initialState
  );
  const { nounId } = useParams<RouteParams>();
  const { isLoading, isError, error } = useQuery<Field[]>(
    `fields-${nounId}`,
    async () => {
      // const r = await flaxFetch<GetFieldsResponse>(`/api/nouns/${nounId}/fields`)
      const r: GetFieldsResponse = {
        fields: [
          {
            createdAt: Date.now().toString(),
            id: 1,
            activeStatus: true,
            columnName: "givenName",
            friendlyName: "First Name",
            nounId: 10,
            type: "text",
            updatedAt: Date.now().toString(),
          },
          {
            createdAt: Date.now().toString(),
            id: 2,
            activeStatus: true,
            columnName: "surname",
            friendlyName: "Last Name",
            nounId: 10,
            type: "text",
            updatedAt: Date.now().toString(),
          },
        ],
      };
      dispatch({
        type: ActionTypes.FieldsLoaded,
        fields: r.fields,
      });
      return r.fields;
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
      <Loader description="Hi"></Loader>
      <h1>Intake form for Noun</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="intake-form">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {state.intakeForm.intakeItems.map((item, i) => (
                <Draggable key={i} draggableId={String(item.id)} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {(item as IntakeFieldItem).field.friendlyName}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
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

    console.log("reordering", result);
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
    case ActionTypes.FieldsLoaded:
      return modifyIntakeForm(state, {
        intakeItems: action.fields.map((field) => ({
          type: IntakeItemType.Field,
          id: field.id,
          field,
        })),
      });
    case ActionTypes.Reorder:
      const newItems = [...state.intakeForm.intakeItems];
      const [removedItem] = newItems.splice(action.sourceIndex, 1);
      newItems.splice(action.destIndex, 0, removedItem);

      return modifyIntakeForm(state, {
        intakeItems: newItems,
      });
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
}

interface IntakeForm {
  intakeItems: IntakeItem[];
}

enum ActionTypes {
  FieldsLoaded = "FieldsLoaded",
  Reorder = "Reorder",
}

enum IntakeItemType {
  Field = "Field",
}

interface IntakeFieldItem {
  type: IntakeItemType.Field;
  id: number;
  field: Field;
}

type IntakeItem = IntakeFieldItem;

interface FieldsLoadedAction {
  type: ActionTypes.FieldsLoaded;
  fields: Field[];
}

interface ReorderAction {
  type: ActionTypes.Reorder;
  sourceIndex: number;
  destIndex: number;
}

type Action = FieldsLoadedAction | ReorderAction;

type Reducer = (state: State, action: Action) => State;

interface RouteParams {
  nounId: string;
}

interface GetFieldsResponse {
  fields: Field[];
}
