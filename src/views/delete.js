import React from 'react';
import './delete.css';

function Delete(props){
  return (
    <div className="delete">
      <h2>Delete A Question</h2>
      <ul>
        <li>{props.data.text}</li>
        <li>{props.data.answer}</li>
      </ul>
      <h3>Delete <em>this</em> question?</h3>
      <button onClick={props.handleDelete}>Yes, <em>do</em> it.</button>
      <button onClick={props.handleChicken}>No, take me back!</button>
    </div>
  )
}

export default Delete;
