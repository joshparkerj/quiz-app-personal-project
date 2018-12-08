import React, { Component } from 'react';
import {
  createGame,
  getWikiCategories,
  wikiSelection,
  questionAnswered,
  setGameOnSession
} from '../api';
import {
  emitCreateGame,
  emitFindGame,
  emitJoinGame,
  emitAnswerQuestion,
  onGamesFound,
  onJoinRoom,
  onGameInfo,
  onAnswerQuestion,
  refreshConnection
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
      gamelist: [],
      gamename: '',
      findGameHeading: ''
    }
  }

  componentDidMount() {
    refreshConnection();
    onGamesFound(gamelist => {
      if (gamelist.length > 0) {
        this.setState({ gamelist: gamelist, findGameHeading: 'Games found:' })
      } else {
        this.setState({ findGameHeading: 'No games found...' });
      }
    })
    onJoinRoom(msg => {
      toast.success(`${msg.n} has joined your game!`)
    })
    onGameInfo(game => {
      this.setState({ game: game.content });
      setGameOnSession(game.content);
    })
    onAnswerQuestion(msg => {
      if (msg.n !== this.props.username) {
        toast.error(
          `${msg.n} has answered a question!\nTheir score is now ${msg.s}!`);
        if (this.state.game.length === 1) {
          toast.error('The game is over!');
        }
        setGameOnSession(this.state.game.filter(e => {
          return e.id !== msg.q;
        }))
        this.setState({
          game: this.state.game.filter(e => {
            return e.id !== msg.q;
          })
        })
      }
    })
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
      wikiSelection(wikiID, e)
        .then(r => {
          console.log(r);
          if (r === 'correct') {
            questionAnswered(wikiID)
              .then(r => {
                const game = this.state.game.filter(e => {
                  return e.id !== wikiID;
                })
                toast.success(`well done\nyour score is now ${r.score}`);
                emitAnswerQuestion(wikiID);
                if (game.length === 0) {
                  toast.success('you\'ve finished the game!');
                }
                this.setState({
                  game: game
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

  joinGame = host => {
    emitJoinGame(host);
  }

  gamelistmapper = (e, i) => {
    return (
      <button key={i} onClick={() => this.joinGame(e.host)}>
        {e.game} hosted by {e.host}
      </button>
    )
  }

  createGame = () => {
    createGame(this.state.category, this.state.count)
      .then(game => {
        emitCreateGame({ name: this.state.gamename, content: game });
        this.setState({ game: game });
      })
  }

  render() {
    return (
      <div className="join-create">
        <h2>Find A Game To Join</h2>
        <button onClick={emitFindGame}>
          Click to find available games
        </button>
        <h4>{this.state.findGameHeading}</h4>
        <ul>{this.state.gamelist.map(this.gamelistmapper)}</ul>
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
        <button onClick={() => console.log(this.state)}>
          Console Log Join Create State
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
