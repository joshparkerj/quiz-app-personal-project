import React from 'react';

function Option(props){
  return (
    <button onClick={() => props.hc(props.text)}>
      {props.text}
    </button>
  )
}

export default Option;
