import { useReducer } from "react";
import { Header, Loader, Segment } from "semantic-ui-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { RouterProps, useParams } from "react-router";
import { Field } from "../../models/field";
import { useQuery } from "react-query";
import { flaxFetch } from "../Utils/flaxFetch";

export function CreateEditIntakeForm(props: RouterProps) {
  const [state, dispatch] = useReducer<Reducer, State>(
    reducer,
    initialState,
    () => initialState
  );
  const { nounId } = useParams<RouteParams>();
  const { data, isLoading, isError, error } = useQuery<Field[]>(
    `fields-${nounId}`,
    async () => {
      // const r = await flaxFetch<GetFieldsResponse>(`/api/nouns/${nounId}/fields`)
      const r: GetFieldsResponse = {
        fields: [
          {
            createdAt: Date.now().toString(),
            friendlyName: "First name",
            id: 1,
            parentId: null,
            slug: "",
          },
        ],
      };
      return r.fields;
    }
  );

  const fields = data as Field[];

  if (isLoading) {
    return (
      <Segment>
        <Header>Loading intake form</Header>
        <Loader />
      </Segment>
    );
  }

  if (isError) {
    return (
      <Segment>
        <Header>Error loading intake form</Header>
      </Segment>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="intake-form">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {fields.map((field, i) => (
              <Draggable key={i} draggableId={String(field.id)} index={i}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {field.friendlyName}
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  function onDragEnd() {}
}

const initialState: State = {
  intakeForm: {},
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionTypes.SetIntake:
      return {
        ...state,
        intakeForm: action.intakeForm,
      };
    default:
      throw Error();
  }
}

interface State {
  intakeForm: IntakeForm;
}

interface IntakeForm {}

enum ActionTypes {
  SetIntake = "SetIntake",
}

interface SetIntakeFormAction {
  type: ActionTypes.SetIntake;
  intakeForm: IntakeForm;
}

type Action = SetIntakeFormAction;

type Reducer = (state: State, action: Action) => State;

interface RouteParams {
  nounId: string;
}

interface GetFieldsResponse {
  fields: Field[];
}
