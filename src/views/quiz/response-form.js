import React, { Component } from 'react';
import { connect } from 'react-redux';
import { checkQuizResponse } from '../../api';

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
      this.props.user_id,
      this.state.res,
      Date.now()-this.state.start).then(r => {
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

const mapStateToProps = state => {
  return {
    user_id: state.user_id
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ResponseForm);
