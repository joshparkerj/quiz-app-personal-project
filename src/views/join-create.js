import React, { Component } from 'react';
import { createGame, getWikiCategories } from '../api';

class JoinCreate extends Component {

  constructor() {
    super();
    this.state = {
      count: 1,
      category: '',
      categories: []
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

  handleChange = e => this.setState({ category: e.target.value })

  handleCount = e => this.setState({count: e.target.value })

  categoryMapper = (e, i) => {
    return <option value={e.category} key={i}>{e.category}</option>
  }

  createGame = () => {
    createGame(this.state.category,this.state.count)
      .then(game => {
        console.log(game);
      })
  }

  render() {
    return (
      <div className="join-create">
        <label>
          Select a category:
        </label>
        <select
          name="categories"
          onChange={this.handleChange}
          value={this.state.category}
        >
          {this.state.categories.map(this.categoryMapper)}
        </select>
        <label>
          How many questions?
        </label>
        <input
          type="number"
          name="count"
          value={this.state.count}
          onChange={this.handleCount} />
        <button onClick={this.createGame}>
          Create Game
        </button>
      </div>
    )
  }
}

export default JoinCreate;
