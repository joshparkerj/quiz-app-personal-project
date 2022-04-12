/* eslint-disable no-param-reassign */
const debug = require('debug')('socket-controller');

const connectedUsers = {};
const games = [];

module.exports = {
  connect: (socket) => {
    debug('someone connected');

    socket.emit('who are you');

    socket.on('log in', (username) => {
      socket.nickname = username;
      debug(`${socket.nickname} logged in`);
      connectedUsers[socket.nickname] = socket;
    });

    socket.on('who i am', (username) => {
      debug(`identifying user: ${username}`);
      socket.nickname = username;
      if (connectedUsers[socket.nickname]) {
        socket.game = connectedUsers[socket.nickname].game;
        socket.gamescore = connectedUsers[socket.nickname].gamescore;
      }

      connectedUsers[socket.nickname] = socket;
    });

    socket.on('check name', (incomingName) => {
      if (games.find(({ name }) => name === incomingName)) {
        socket.emit('game name unavailable');
      } else {
        socket.emit('game name ok!');
      }
    });

    socket.on('create game', (game) => {
      socket.game = games.length;
      games.push({ ...game, host: socket.nickname, population: 1 });
      socket.gamescore = 0;
      socket.join(socket.game);
      debug(`${socket.nickname} created ${game.name}`);
    });

    socket.on('find game', () => {
      const gamelist = games.map(({ host, name }) => ({ host, game: name }));

      debug(`found ${gamelist.map((e) => e.name)} for ${socket.nickname}`);
      socket.emit(
        'games found',
        JSON.stringify(gamelist),
      );
    });

    socket.on('join game', (gameToJoin) => {
      const gameNumber = games.findIndex(({ name }) => name === gameToJoin);
      if (gameNumber === -1) {
        socket.emit('unable to join');
      }

      socket.game = gameNumber;
      socket.gamescore = 0;
      socket.join(socket.game);
      debug(`${socket.nickname} joined ${gameToJoin}`);

      const game = games[socket.game];

      game.population += 1;
      socket.emit('game info', JSON.stringify(game));
      socket.to(socket.game).emit(
        'join game',
        JSON.stringify({ r: game, n: socket.nickname }),
      );
    });

    socket.on('leave game', () => {
      if (socket.game && games[socket.game]) {
        debug(`${socket.nickname} left ${games[socket.game].name}`);
        socket.to(socket.game).emit('leave game', socket.nickname);
        socket.leave(socket.game);

        const game = games[socket.game];

        game.population -= 1;
        if (game.population === 0) {
          delete games[socket.game];
        }

        socket.game = null;
        socket.gamescore = 0;
      }
    });

    socket.on('answer question', (qid) => {
      socket.gamescore += 1;

      const game = games[socket.game];

      game.content = game.content.filter((e) => e.id !== qid);
      if (game.content.length === 0) {
        // um... should we really be doing this without emitting any event to clients?
        delete games[socket.game];
      }

      socket.to(socket.game).emit(
        'answer question',
        JSON.stringify({ n: socket.nickname, q: qid, s: socket.gamescore }),
      );

      debug(`${socket.nickname} answered q#: ${qid}`);
    });
  },
};
