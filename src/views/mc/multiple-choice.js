import React, { Component } from 'react';
import { getMC, submitSelection } from '../../api';
import Option from './option';
import { toast } from 'react-toastify';

class MultipleChoice extends Component {

  constructor(){
    super();
    this.state = {
      mcText: '',
      mcID: null,
      selection: null
    }
  }

  componentDidMount(){
    getMC()
      .then(mc => {
        if(mc[0] && mc[0].text){
          this.setState({mcText: JSON.parse(mc[0].text), mcID:(mc[0].id)});
        }
      })
  }

  hc = e => {
    submitSelection(this.state.mcID,e)
      .then(r => {
        console.log(r);
        if(r==='correct'){
          toast.success('well done');
        } else {
          toast.error('that was very bad');
        }
      })
      .then(r => {
        getMC()
          .then(mc => {
            if(mc[0] && mc[0].text){
              this.setState({mcText: JSON.parse(mc[0].text), mcID:(mc[0].id)});
            }
          })
      })
      .catch(err => {
        console.error(err);
      })
  }

  optionMapper = (e,i) => {
    return (
      <Option
        hc={this.hc}
        key={i}
        name={e.name}
        text={e.text}
      />
    )
  }

  displayQuestion = () => {
    if (this.state.mcText){
      return (
        <div className="multiple-choice-question">
          {this.state.mcText.text}
          {this.state.mcText.options.map(this.optionMapper)}
        </div>
      )
    } else {
      return (
        <div className="no-question-available">
          We have no question available for you. Check back again!
        </div>
      )
    }
  }

  render() {
    return (
      <div className="mc">
        {this.displayQuestion()}
      </div>
    )
  }

}

export default MultipleChoice;
