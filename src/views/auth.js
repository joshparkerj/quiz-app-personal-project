import React from 'react';

function Auth(props){
  return (
    <div className="auth">
      <div className="auth-inputs">
        <label>Username:</label>
        <input
          name="username"
          value={props.username}
          onChange={props.handleChange} />
        <label>Password:</label>
        <input
          name="password"
          value={props.password}
          onChange={props.handleChange} />
      </div>
      <div className="auth-buttons">
        <button onClick={props.login}>login</button>
        <button onClick={props.register}>register</button>
      </div>
    </div>
  )
}

export default Auth;
