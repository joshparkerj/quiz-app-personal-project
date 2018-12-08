import React, { Component } from 'react';
import Question from './question';
import Questions from '../questions';
import ResponseForm from './response-form';
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
        console.log(`Got quiz question: ${r}`);
        this.setState({
          displayQuestion: (
            <ResponseForm id={id} text={r[0].text} done={this.resetQuestionID}/>
        )})
      })
  }

  render() {
    return (
      <div className="quiz">
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

export default Quiz;
