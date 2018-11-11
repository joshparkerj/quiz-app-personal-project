import React, { Component } from 'react';
import Auth from '../auth';
import Question from './question';
import Questions from '../questions';
import ResponseForm from './response-form';
import { connect } from 'react-redux';
import {
  getQuizQuestions,
  getQuizQuestion
} from '../../api';

class Quiz extends Component {

  constructor(){
    super();
    this.state = {
      questionid: null,
      questions: [],
      res: '',
      start: null,
      end: null,
      displayQuestion: (
        <div className="nothing-to-see-here"></div>
      ),
      extraTest: ''
    }
  }

  componentDidMount(){
    getQuizQuestions()
      .then(r => {
        this.setState({questions: r});
      })
  }

  resetQuestionID = () => {
    this.setState({
      questionid: null,
      displayQuestion: (
        <div className="nothing-to-see-here"></div>
      )
    });
  }

  hc = e => {
    this.setState({[e.target.name]: e.target.value});
  }

  questionMapper = (e,i) => {
    return (
      <Question key={i} text={e.text} id={e.id} load={this.loadQuestion} />
    )
  }

  loadQuestion = id => {
    this.gqq(id);
    this.setState({
      questionid: id,
      start: Date.now()
    });
  }

  gqq = id => {
    getQuizQuestion(id)
      .then(r => {
        console.log('GOT SOMETHING!');
        console.log(r);
        this.setState({
          displayQuestion: (
            <ResponseForm id={id} text={r[0].text} done={this.resetQuestionID}/>
        )})
      })
  }

  render() {
    return (
      <div className="quiz">
        <Auth />
        {this.state.displayQuestion}
        <Questions
          mapper={this.questionMapper}
          questions={this.state.questions}
          handleClick={this.loadQuestion}
         />
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

export default connect(mapStateToProps, mapDispatchToProps)(Quiz);
