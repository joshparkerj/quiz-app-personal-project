import React from 'react';

function Question(props){
  return (
    <div className="question">
      <h2>Question</h2>
      <ul>
        <li>{props.data.text}</li>
        <li>{props.data.answer}</li>
      </ul>
      <button onClick={() => props.handleDelete(props.data.id)}>
        Click here to delete this question.
      </button>
    </div>
  )
}

export default Question;
