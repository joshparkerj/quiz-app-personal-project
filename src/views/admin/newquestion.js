import React from 'react';

function NewQuestion(props){
  return (
    <div className="newquestion">
      <h2>Add a new Question</h2>
      <label>Input your question text</label>
      <input name="newText" value={props.text} onChange={props.handleChange} />
      <label>Input the answer to your question</label>
      <input name="newAnswer" value={props.answer} onChange={props.handleChange} />
      <button onClick={props.handleSubmit}>
        Click here to submit this question.
      </button>
    </div>
  )
}

export default NewQuestion;
