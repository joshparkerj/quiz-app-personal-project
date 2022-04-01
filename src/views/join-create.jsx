import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import debug from 'debug';

import {
  createGame,
  getWikiCategories,
  wikiSelection,
  questionAnswered,
  setGameOnSession,
  leaveGameSession,
  resetScore,
} from '../api';

import {
  emitCreateGame,
  emitFindGame,
  emitJoinGame,
  emitLeaveGame,
  emitAnswerQuestion,
  emitCheckName,
  onGamesFound,
  onJoinRoom,
  onLeaveGame,
  onGameInfo,
  onGameNameUnavailable,
  onGameNameOK,
  onAnswerQuestion,
  refreshConnection,
} from '../socket-api';

import WikiMC from './wiki-mc';
import './join-create.css';

const JoinCreate = function JoinCreate({ username }) {
  const [count, setCount] = useState(1);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [game, setGame] = useState([]);
  const [gamelist, setGamelist] = useState([]);
  const [gamename, setGamename] = useState('');
  const [findGameHeading, setFindGameHeading] = useState('');
  const [showForms, setShowForms] = useState(true);

  const generateGame = () => {
    createGame(category, count)
      .then((r) => {
        if (r === 'count too high') {
          toast.error('couldn\'t get that many questions');
          return;
        }

        emitCreateGame({ name: gamename, content: r });

        setFindGameHeading('');
        setGamelist([]);
        setShowForms(false);
        setGame(r);
      });
  };

  const leaveGame = () => {
    emitLeaveGame();
    leaveGameSession()
      .then(() => {
        setShowForms(true);
        setGame([]);
      });
  };

  useEffect(() => {
    refreshConnection();

    onGamesFound((r) => {
      if (r.length > 0) {
        setGamelist(r);
        setFindGameHeading('Games found:');
      } else {
        setFindGameHeading('No games found...');
      }
    });

    onGameNameUnavailable(() => {
      toast.error('that name is in use! pick another');
    });

    onGameNameOK(() => {
      generateGame();
    });

    onJoinRoom(({ n }) => {
      toast.success(`${n} has joined your game!`);
    });

    onLeaveGame((name) => {
      toast.warn(`${name} has left the game!`);
    });

    onGameInfo(({ content }) => {
      setGame(content);
      setGameOnSession(content);
    });

    onAnswerQuestion(({ n, s, q }) => {
      if (n !== username) {
        toast.error(`${n} has answered a question!\nTheir score is now ${s}`);

        if (game.length === 1) {
          toast.error('The game is over!');
          resetScore();
          setShowForms(true);
        }

        const newGame = game.filter(({ id }) => id !== q);

        setGameOnSession(newGame);
        setGame(newGame);
      }
    });

    getWikiCategories()
      .then((cats) => {
        setCategory(cats[0].category);
        setCategories(cats);
      });

    return function cleanup() {
      leaveGame();
    };
  }, []);

  const categoryMapper = (e, i) => <option value={e.category} key={i}>{e.category}</option>;

  const hc = (wikiID) => (e) => {
    wikiSelection(wikiID, e)
      .then((r) => {
        debug('join-create-wiki-selection')(r);
        if (r === 'correct') {
          questionAnswered(wikiID)
            .then(() => {
              const newGame = game.filter(({ id }) => id !== wikiID);
              toast.success(`well done\nyour score is now ${r.score}`);
              emitAnswerQuestion(wikiID);
              if (newGame.length === 0) {
                toast.success('you\'ve finished the game!');
                resetScore();
                setShowForms(true);
              }

              setGame(newGame);
            });
        } else {
          toast.error('that was very bad');
        }
      })
      .catch((err) => {
        debug('join-create-wiki-selection-error')(err);
      });
  };

  const gameMapper = (e, i) => (
    <div className="game-wiki-mc" key={i}>
      <WikiMC
        wikiText={e.text}
        wikiAnswers={e.answers}
        imgUrl={e.img_url}
        hc={hc(e.id)}
      />
    </div>
  );

  const joinGame = (gameToJoin) => {
    setFindGameHeading('');
    setGamelist([]);
    setShowForms(false);
    emitJoinGame(gameToJoin);
  };

  const gamelistmapper = (e, i) => (
    <button type="button" key={i} onClick={() => joinGame(e.game)}>
      {e.game}
      {' '}
      created by
      {e.host}
    </button>
  );

  const handleCreateGame = () => {
    emitCheckName(gamename);
  };

  return (
    <div className="join-create">
      {showForms ? (
        <div className="join-create-forms">
          <h2>Find A Game To Join</h2>
          <button type="button" onClick={emitFindGame}>Find available games</button>
          <h4>{findGameHeading}</h4>
          <ul>{gamelist.map(gamelistmapper)}</ul>
          <h2>Create A New Game</h2>
          <label htmlFor="gamename">
            Name your game:
            <input
              name="gamename"
              id="gamename"
              value={gamename}
              onChange={({ target }) => setGamename(target.value)}
            />
          </label>
          <label htmlFor="category">
            Select a category:
            <select
              name="category"
              id="category"
              onChange={({ target }) => setCategory(target.value)}
              value={category}
            >
              {categories.map(categoryMapper)}
            </select>
          </label>
          <label htmlFor="count">
            How many questions?
            <input
              type="number"
              name="count"
              id="count"
              value={count}
              onChange={({ target }) => setCount(target.value)}
            />
          </label>
          <button type="button" onClick={handleCreateGame}>Create Game</button>
        </div>
      ) : <button type="button" onClick={leaveGame}>Leave This Game</button>}
      {game.length > 0 ? (
        <div className="game">
          {game.map(gameMapper)}
        </div>
      ) : <div className="no-game" />}
    </div>
  );
};

JoinCreate.propTypes = {
  username: PropTypes.string.isRequired,
};

export default JoinCreate;
