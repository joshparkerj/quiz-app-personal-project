const connectedUsers = {};

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
    socket.on('create game', game => {
      socket.game = game;
      socket.game.host = socket.nickname;
      socket.gamescore = 0;
      socket.join(game.name);
      console.log(`${socket.nickname} created ${game.name}`);
    })
    socket.on('find game', () => {
      gamelist = [];
      for (user in connectedUsers) {
        if (connectedUsers[user].game) {
          gamelist.push({
            host: connectedUsers[user].game.host,
            game: connectedUsers[user].game.name
          });
        }
      }
      console.log(`sending gamelist ${gamelist} to ${socket.nickname}`);
      socket.emit(
        'games found',
        JSON.stringify(gamelist)
      );
    })
    socket.on('join game', user => {
      if (!connectedUsers[user]) {
        socket.emit('unable to join');
      }
      const game = connectedUsers[user].game;
      socket.game = game;
      socket.gamescore = 0;
      socket.join(game.name);
      console.log(`${socket.nickname} joined ${game.name}`);
      socket.emit('game info', JSON.stringify(game));
      socket.to(socket.game.name).emit(
        'join game',
        JSON.stringify({ r: game, n: socket.nickname }));
    })
    socket.on('answer question', qid => {
      socket.gamescore += 1;
      socket.to(socket.game.name).emit(
        'answer question',
        JSON.stringify({ n: socket.nickname, q: qid, s: socket.gamescore }));
      console.log(`${socket.nickname} answered q#: ${qid}`);
    })
  }
}
