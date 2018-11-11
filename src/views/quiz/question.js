import React from 'react';

function Question(props){
  return (
    <div className="question">
      <h2>Question:</h2>
      <p>{props.text}</p>
      <button onClick={() => props.load(props.id)}>
        Answer this question
      </button>
    </div>
  )
}

export default Question;
