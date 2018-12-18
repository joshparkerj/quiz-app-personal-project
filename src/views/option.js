import React from 'react';
import './option.css';

function Option(props) {
  return (
    <button
      className={`option${props.num}`}
      onClick={() => props.hc(props.text)}>
      {props.text}
    </button>
  )
}

export default Option;
