import React, { Component } from 'react';
import './app.css';
import Question from './views/question';
import Questions from './views/questions';
import Delete from './views/delete';
import NewQuestion from './views/newquestion';
import Auth from './views/auth';
import {
    getQuestions,
    deleteQuestion,
    addQuestion,
    postUser,
    authenticateUser
  } from './api/api';

class App extends Component {

  constructor(){
    super();
    this.state = {
      questions: [],
      deletePage: false,
      submissionForm: false,
      newText: '',
      newAnswer: '',
      username: '',
      password: '',
      loggedin: false,
      userid: null
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
        <Delete
          id={this.state.deletePage}
          data={this.state.questions.filter(e => {
            return e.id === this.state.deletePage;
          })[0]}
          handleDelete={this.confirmDelete}
          handleChicken={this.cancelDelete} />
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
    addQuestion(this.state.newText, this.state.newAnswer, this.state.userid)
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
        <NewQuestion
          text={this.state.newText}
          answer={this.state.newAnswer}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
      )
    } else {
      return (
        <div className="nothing-to-see-here"></div>
      )
    }
  }

  displayAuth = () => {
    if (!this.state.loggedin){
      return(
        <Auth
          username={this.state.username}
          password={this.state.password}
          login={this.login}
          register={this.register}
          handleChange={this.handleChange}
        />
      )
    } else {
      return (
        <button onClick={() => this.setState({loggedin: false, userid: null})}>
          log out
        </button>
      )
    }
  }

  login = () => {
    authenticateUser(this.state.username,this.state.password)
      .then(r => {
        console.log(r);
        this.setState({loggedin: true, userid: r[0].id});
      })
  }

  register = () => {
    postUser(this.state.username,this.state.password)
      .then(r => {
        console.log(r);
        console.log('now try logging in');
      })
  }

  showForm = () => {
    this.setState({submissionForm: true});
  }

  render() {
    return (
      <div className="app">
        {this.displayAuth()}
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
