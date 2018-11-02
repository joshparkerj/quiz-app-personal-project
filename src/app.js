import React, { Component } from 'react';
import './app.css';
import Question from './views/question';
import Questions from './views/questions';
import Delete from './views/delete';
import NewQuestion from './views/newquestion';
import { getQuestions, deleteQuestion, addQuestion } from './api/api';

class App extends Component {
  
  constructor(){
    super();
    this.state = {
      questions: [],
      deletePage: false,
      submissionForm: false,
      newText: '',
      newAnswer: ''
    }
  }
  
  componentDidMount(){
    getQuestions()
      .then(r => {
        console.log(r);
        this.setState({questions: r});
      })
  }
  
    questionMapper = (e,i) => {
    return (
      <div className="question-wrapper" key={i}>
        <Question data={e} handleDelete={this.loadDeletePage} />
      </div>
    )
  }
  
  loadDeletePage = id => {
    this.setState({deletePage: id})
  }
  
  confirmDelete = () => {
    deleteQuestion(this.state.deletePage)
      .then(r => {
        getQuestions()
          .then(r => {
            this.setState({
              deletePage: false,
              questions: r
            })
          })
      })
  }
  
  cancelDelete = () => {
    this.setState({deletePage: false});
  }
  
  displayDeletePage = () => {
    if (this.state.deletePage){
      return(
        <div className="delete-wrapper">
          <Delete 
            id={this.state.deletePage} 
            data={this.state.questions.filter(e => {
              return e.id === this.state.deletePage;
            })[0]}
            handleDelete={this.confirmDelete} 
            handleChicken={this.cancelDelete} />
        </div>
      )
    } else {
      return(
        <div className="nothing-to-see-here"></div>
      )
    }
  }
  
  handleChange = e => {
    this.setState({[e.target.name]: e.target.value});
  }
  
  handleSubmit = () => {
    addQuestion(this.state.newText, this.state.newAnswer)
      .then(r => {
        getQuestions()
          .then(r => {
            this.setState({
              newText: '',
              newAnswer: '',
              submissionForm: false,
              questions: r
            })
          })
      })
  }
  
  displaySubmissionForm = () => {
    if (this.state.submissionForm){
      return(
        <div className="new-wrapper">
          <NewQuestion 
            text={this.state.newText}
            answer={this.state.newAnswer}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
          />
        </div>
      )
    } else {
      return (
        <div className="nothing-to-see-here"></div>
      )
    }
  }
  
  showForm = () => {
    this.setState({submissionForm: true});
  }

  render() {
    return (
      <div className="app">
        <h1>Quiz Site</h1>
        <Questions 
          mapper={this.questionMapper} 
          questions={this.state.questions} 
          handleClick={this.showForm}
         />
         {this.displayDeletePage()}
         {this.displaySubmissionForm()}
      </div>
    )
  }
}

export default App;
