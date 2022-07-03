import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERR_SAVE = "ERR_SAVE"
  const ERR_DELETE = "ERR_DELETE"

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const { interview, time } = props;
  let studentName = '';
  if (interview) {
    studentName = interview.student;
  }

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERR_SAVE, true))
  }

  function cancel() {
    transition(DELETING)
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERR_DELETE, true))
  }

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty
        onAdd={() => transition(CREATE)}
      />
      }
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && <Form
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save}
      />}
      {mode === SAVING && <Status message='Saving' />}
      {mode === DELETING && <Status message='Deleting' />}
      {mode === CONFIRM && <Confirm
        onCancel={back}
        onConfirm={cancel}
      />}
      {mode === EDIT && <Form
        interviewers={props.interviewers}
        student={props.interview.student}
        onCancel={back}
        onSave={save} />}
      {mode === ERR_DELETE && <Error 
      message='delete'
      onClose={back}/>}
      {mode === ERR_SAVE && <Error 
      message='create'
      onClose={() => transition(CREATE)}/>}
    </article>
  )
}