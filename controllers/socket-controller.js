const connectedUsers = {};
const games = {};

module.exports = {
  connect: socket => {
    console.log('someone connected');
    socket.emit('who are you');
    socket.on('log in', username => {
      socket.nickname = username;
      console.log(`${socket.nickname} logged in`);
      connectedUsers[socket.nickname] = socket;
    })
    socket.on('who i am', username => {
      console.log(`identifying user: ${username}`);
      socket.nickname = username;
      if (connectedUsers[socket.nickname]) {
        socket.game = connectedUsers[socket.nickname].game;
        socket.gamescore = connectedUsers[socket.nickname].gamescore;
      }
      connectedUsers[socket.nickname] = socket;
    })
    socket.on('check name', name => {
      if (games[name]) {
        socket.emit('game name unavailable');
      } else {
        socket.emit('game name ok!');
      }
    })
    socket.on('create game', game => {
      games[game.name] = game;
      socket.game = game.name;
      games[game.name].host = socket.nickname;
      games[game.name].population = 1;
      socket.gamescore = 0;
      socket.join(game.name);
      console.log(`${socket.nickname} created ${game.name}`);
    })
    socket.on('find game', () => {
      gamelist = [];
      for (game in games) {
        gamelist.push({
          host: games[game].host,
          game: games[game].name
        });
      }
      console.log(`found ${gamelist.map(e => e.name)} for ${socket.nickname}`);
      socket.emit(
        'games found',
        JSON.stringify(gamelist)
      );
    })
    socket.on('join game', game => {
      if (!games[game]) {
        socket.emit('unable to join');
      }
      socket.game = game;
      socket.gamescore = 0;
      socket.join(game);
      console.log(`${socket.nickname} joined ${game}`);
      games[game].population += 1;
      socket.emit('game info', JSON.stringify(games[game]));
      socket.to(socket.game).emit(
        'join game',
        JSON.stringify({ r: games[game], n: socket.nickname }));
    })
    socket.on('leave game', () => {
      if (socket.game && games[socket.game]) {
        console.log(`${socket.nickname} left ${socket.game}`);
        socket.to(socket.game).emit('leave game', socket.nickname);
        socket.leave(socket.game);
        games[socket.game].population -= 1;
        if (games[socket.game].population === 0) {
          delete games[socket.game];
        }
        socket.game = null;
        socket.gamescore = 0;
      }
    })
    socket.on('answer question', qid => {
      socket.gamescore += 1;
      games[socket.game].content = games[socket.game].content.filter(e => {
        return e.id !== qid;
      })
      if (games[socket.game].content.length === 0) {
        delete games[socket.game];
      }
      socket.to(socket.game).emit(
        'answer question',
        JSON.stringify({ n: socket.nickname, q: qid, s: socket.gamescore }));
      console.log(`${socket.nickname} answered q#: ${qid}`);
    })
  }
}
