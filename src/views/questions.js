import React from 'react';

function Questions(props){
  return (
    <div className="questions">
      <h3>Questions</h3>
      {
        props.questions ? props.questions.map(props.mapper) : "nothing loaded"
      }
    </div>
  )
}

export default Questions;