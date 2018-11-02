import React from 'react';

function Questions(props){
  return (
    <div className="questions">
      <h3>Questions</h3>
      <button onClick={props.handleClick}>add new question</button>
      {
        props.questions.map(props.mapper)
      }
    </div>
  )
}

export default Questions;