import React, { Component } from 'react';
import Question from './question';
import Questions from '../questions';
import Delete from './delete';
import NewQuestion from './newquestion';
import Auth from '../auth';
import {
    getQuestions,
    deleteQuestion,
    addQuestion,
    scrapeWiki
  } from '../../api';

class Admin extends Component {

  constructor(){
    super();
    this.state = {
      questions: [],
      deletePage: false,
      submissionForm: false,
      newText: '',
      newAnswer: '',
      name: ''
    }
  }

  componentDidMount(){
    getQuestions()
      .then(r => {
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

  showForm = () => {
    this.setState({submissionForm: true});
  }

  scrape = () => {
    scrapeWiki(this.state.term)
      .then(r => {
        this.setState({
          term: ''
        })
      })
  }

  render() {
    return (
      <div className="admin">
        <Auth />
        <h1>Quiz Site</h1>
        <button onClick={this.showForm}>add new question</button>
        <input 
          onChange={this.handleChange} 
          name="term" 
          value={this.state.term} 
        />
        <button onClick={this.scrape}>Scrape Wiki</button>
        <Questions
          mapper={this.questionMapper}
          questions={this.state.questions}
         />
         {this.displayDeletePage()}
         {this.displaySubmissionForm()}
      </div>
    )
  }
}

export default Admin;
