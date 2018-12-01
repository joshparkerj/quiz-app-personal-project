import React, { Component } from 'react';
import {
  createGame,
  getWikiCategories,
  wikiSelection,
  questionAnswered
} from '../api';
import {
  emitCreateGame
} from '../socket-api';
import { toast } from 'react-toastify';
import WikiMC from './wiki/wiki-mc';

class JoinCreate extends Component {

  constructor() {
    super();
    this.state = {
      count: 1,
      category: '',
      categories: [],
      game: [],
      gamename: ''
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

  handleChange = e => this.setState({ [e.target.name]: e.target.value })

  categoryMapper = (e, i) => {
    return <option value={e.category} key={i}>{e.category}</option>
  }

  hc = wikiID => {
    return e => {
      console.log(wikiID);
      console.log(e);
      wikiSelection(wikiID, e)
        .then(r => {
          console.log(r);
          if (r === 'correct') {
            toast.success('well done');
            questionAnswered(wikiID)
              .then(r => {
                toast.success(`your score is now ${r.score}`);
                if (this.state.game.length === 1) {
                  toast.success('you\'ve finished the game!');
                }
                this.setState({
                  game: this.state.game.filter(e => {
                    return e.id !== wikiID;
                  })
                });
              })
          } else {
            toast.error('that was very bad');
          }
        })
        .catch(err => {
          console.error(err);
        })
    }
  }

  gameMapper = (e, i) => {
    return (
      <div className="game-wiki-mc" key={i}>
        <WikiMC
          wikiText={e.text}
          wikiAnswers={e.answers}
          imgUrl={e.img_url}
          hc={this.hc(e.id)} />
      </div>
    )
  }

  createGame = () => {
    console.log('creating game...')
    console.log(this.state.gamename);
    createGame(this.state.category, this.state.count)
      .then(game => {
        emitCreateGame({name: this.state.gamename, content: game});
        this.setState({ game: game });
      })
  }

  render() {
    return (
      <div className="join-create">
        <h2>Create A New Game</h2>
        <label>
          Name your game:
        </label>
        <input
          name="gamename"
          value={this.state.gamename}
          onChange={this.handleChange} />
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
        <label>
          How many questions?
        </label>
        <input
          type="number"
          name="count"
          value={this.state.count}
          onChange={this.handleChange} />
        <button onClick={this.createGame}>
          Create Game
        </button>
        {this.state.game.length > 0 ? (
          <div className="game">
            {this.state.game.map(this.gameMapper)}
          </div>
        ) : <div className="no-game"></div>}
      </div>
    )
  }
}

export default JoinCreate;
