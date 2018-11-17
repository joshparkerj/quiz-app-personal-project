import React, { Component } from 'react';
import { checkQuizResponse } from '../../api';
import { toast } from 'react-toastify';

class ResponseForm extends Component{

  constructor(props){
    super(props);
    this.state = {
      res: '',
      start: null
    }
  }

  componentDidMount(){
    this.setState({start: Date.now()});
  }

  hc = e => {
    this.setState({[e.target.name]: e.target.value});
  }

  click = () => {
    checkQuizResponse(
      this.props.id,
      this.state.res,
      Date.now()-this.state.start).then(r => {
        if (r==='great job!'){
          toast.success('Nice job, smarty-pants! That\'s right!');
        } else {
          toast.error('Keep Practicing! That answer was wrong!')
        }
        console.log(r);
        this.props.done();
      })
    }

  render(){
    return (
      <div className="response-form">
        <h2>Question:</h2>
        <p>{this.props.text}</p>
        <label>What is your response?</label>
        <input name="res" value={this.state.res} onChange={this.hc} />
        <button onClick={this.click}>Submit</button>
      </div>
    )
  }

}


export default ResponseForm;
