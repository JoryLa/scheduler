import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";

export default function Appointment(props) {



  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  //console.log('index show prop', props)
  const { interview, time, interviewers } = props;
  let studentName = '';
  let interviewerName = '';
  if (interview) {
    studentName = interview.student;
    //interviewerName = interviewers[interview.interviewer].name
  }
  //console.log('interviewerName ', interviewerName);
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
        />
      )}
      {mode === CREATE && <Form 
      interviewers={props.interviewers}
      onCancel={() => back()}
      />}
    </article>
  )
}