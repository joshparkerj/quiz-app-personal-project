const connectedUsers = {};

module.exports = {
  connect: socket => {
    socket.on('log in', username => {
      console.log('logging in on socket...');
      console.log(username);
      socket.nickname = username;
      socket.broadcast.emit('log in', socket.nickname);
      console.log(`${socket.nickname} logged in`);
      connectedUsers[socket.nickname] = socket;
    })
    socket.on('create game', game => {
      console.log('creating game on socket...');
      console.log(game);
      socket.game = game;
      socket.gamescore = 0;
      socket.join(game.name);
      console.log(`${socket.nickname} created ${game.name}`);
    })
    socket.on('find game', () => {
      socket.broadcast.emit('report game', socket.nickname);
      console.log(`${socket.nickname} is looking for a game`);
    })
    socket.on('report game', nick => {
      if (socket.game) {
        socket.to(connectedUsers[nick]).emit('game', {
          name: socket.game.name,
          user: socket.nickname
        })
      }
    })
    socket.on('game', gameinfo => {
      socket.emit('game found', gameinfo);
    })
    socket.on('join game', game => {
      socket.game = game;
      socket.gamescore = 0;
      socket.join(game.name);
      console.log(`${socket.nickname} joined ${game.name}`);
      socket.to(socket.game).emit(
        'join room',
        JSON.stringify({ r: game, n: socket.nickname }));
    })
    socket.on('chat message', msg => {
      socket.to(socket.game).emit(
        'chat message',
        JSON.stringify({ n: socket.nickname, m: msg }));
      console.log(`${socket.nickname}: ${msg}`)
    })
    socket.on('answer question', qid => {
      socket.to(socket.game).emit(
        'answer question',
        JSON.stringify({ n: socket.nickname, q: qid }));
      console.log(`${socket.nickname} answered q#: ${qid}`);
    })
    socket.on('socket query', () => {
      socket.emit('socket query', socket.nickname);
      console.log(`${socket.nickname} queried their socket`);
    })
    socket.on('disconnect', () => {
      socket.emit('user disconnected', socket.nickname);
      console.log(`${socket.nickname} disconnected`);
    })
  }
}
