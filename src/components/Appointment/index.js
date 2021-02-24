import React from 'react';
import "./styles.scss";
import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from '../../hooks/useVisualMode';

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVE = "SAVE";
  const DELETE = "DELETE";
  const CONFIRM = "CONFIRM";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = function(name, interviewer) {
    if (name.length === 0 || interviewer === null) return;
    const interview = {
      student: name,
      interviewer
    }
    transition(SAVE);
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(() => transition(ERROR_SAVE, true));
  };

  const showRemove = function() {
    transition(CONFIRM);
  };

  const showEdit = function() {
    transition(CREATE);
  };

  const confirmRemove = function() {
    transition(DELETE);
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(() => transition(ERROR_DELETE, true));
  }

  const confirmCancel = function() {
    transition(SHOW);
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
          handleDelete={showRemove}
          handleEdit={showEdit}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === SAVE && <Status status="Saving"/>}
      {mode === DELETE && <Status status="Deleting"/>}
      {mode === CONFIRM && (
        <Confirm
          handleConfirm={confirmRemove}
          handleCancel={confirmCancel}
          message="Are you sure you would like to delete?"
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Saving error occured"
          close={back}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Deleting error occured"
          close={back}
        />
      )}
    </article>
  )
}