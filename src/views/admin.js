import React, { Component } from 'react';
import {
  scrapeWiki,
  getWikiCategories,
  getEntireCategory,
  deleteWikiQuestion,
  updateWikiQuestion
} from '../api';
import './admin.css';
import { toast } from 'react-toastify';

class Admin extends Component {

  constructor() {
    super();
    this.state = {
      disablescrape: false,
      scrapebuttontext: 'Scrape Wiki',
      category: '',
      categories: [],
      questions: [],
      showUpdate: false,
      toUpdate: null,
      updateAnswer: '',
      updatetext: '',
      showDelete: false,
      toDelete: null,
      deleteAnswer: ''
    }
  }

  componentDidMount() {
    getWikiCategories()
      .then(cats => {
        this.setState({
          category: cats[0].category,
          categories: cats
        })
      })
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  scrape = () => {
    this.setState({
      term: '',
      disablescrape: true,
      scrapebuttontext: "Please wait..."
    })
    scrapeWiki(this.state.term)
      .then(r => {
        return getWikiCategories()
      })
      .then(cats => {
        this.setState({
          category: cats[0].category,
          categories: cats,
          disablescrape: false,
          scrapebuttontext: "Scrape Wiki"
        })
      })
  }

  showQuestions = () => {
    getEntireCategory(this.state.category)
      .then(r => {
        this.setState({ questions: r })
      })
  }

  deleteQuestion = (id,answer) => {
    this.setState({
      toDelete: id,
      showDelete: true,
      showUpdate: false,
      deleteAnswer: answer
    })
  }

  updateQuestion = (id, text, answer) => {
    this.setState({
      toUpdate: id,
      updatetext: text,
      showUpdate: true,
      showDelete: false,
      updateAnswer: answer
    })
  }

  questionMapper = (e, i) => {
    return (
      <div className={`question${e.id}`} key={i}>
        <h4>{e.answer}</h4>
        <p className="admin-qtext">{e.text}</p>
        <button onClick={() => this.deleteQuestion(e.id, e.answer)}>
          Delete This Question
        </button>
        <button onClick={() => this.updateQuestion(e.id, e.text, e.answer)}>
          Update This Question
        </button>
      </div>
    )
  }

  showDelete = () => {
    return (
      <div className="admin-delete">
        <h4>{this.state.deleteAnswer}</h4>
        <h4>Are you sure you wish to delete?</h4>
        <button onClick={() => {
          deleteWikiQuestion(this.state.toDelete)
            .then(r => {
              return getEntireCategory(this.state.category)
            })
            .then(r=> {
              toast.success('deleted!');
              this.setState({
                showDelete: false,
                questions: r
              })
            })
        }}>
          Yes!
        </button>
        <button onClick={() => this.setState({ showDelete: false })}>
          No...
        </button>
      </div>
    )
  }

  showUpdate = () => {
    return (
      <div className="admin-update">
        <h4>{this.state.updateAnswer}</h4>
        <h4>Tweak text:</h4>
        <textarea
          name="updatetext"
          value={this.state.updatetext}
          onChange={this.handleChange}
        />
        <button onClick={() => {
          updateWikiQuestion(this.state.toUpdate, this.state.updatetext)
            .then(r => {
              return getEntireCategory(this.state.category)
            })
            .then(r => {
              toast.success('updated!');
              this.setState({
                showUpdate: false,
                questions: r
              })
            })
        }}>
          Confirm!
        </button>
        <button onClick={() => this.setState({ showUpdate: false })}>
          Never mind...
        </button>
      </div >
    )
  }

  categoryMapper = (e, i) => {
    return <option value={e.category} key={i}>{e.category}</option>
  }

  render() {
    return (
      <div className="admin">
        <h1>Admin Options:</h1>
        <input
          onChange={this.handleChange}
          name="term"
          value={this.state.term}
        />
        <button
          onClick={this.scrape}
          disabled={this.state.disablescrape}
        >{this.state.scrapebuttontext}</button>
        <p>Note: The scrape wiki operation takes a while;
          sometimes over a minute.</p>
        <h4>Tweak the wiki questions:</h4>
        <label>
          Select a category:
        </label>
        <select
          name="category"
          onChange={this.handleChange}
          value={this.state.category}
        >
          {this.state.categories.map(this.categoryMapper)}
        </select>
        <button onClick={this.showQuestions}>
          Show Entire Category
        </button>
        {
          this.state.questions.length > 0 ?
            this.state.questions.map(this.questionMapper) :
            ''
        }
        {this.state.showDelete ? this.showDelete() : ''}
        {this.state.showUpdate ? this.showUpdate() : ''}
      </div>
    )
  }
}

export default Admin;
