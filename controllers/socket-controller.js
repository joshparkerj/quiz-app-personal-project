const connectedUsers = {};

module.exports = {
  connect: socket => {
    socket.on('log in', () => {
      socket.nickname = socket.request.session.username;
      socket.broadcast.emit('log in', socket.nickname);
      console.log(`${socket.nickname} logged in`);
      connectedUsers[socket.nickname] = socket;
    })
    socket.on('join game', game => {
      socket.game = game;
      socket.join(game);
      console.log(`${socket.nickname} joined ${game}`);
      io.to(socket.game).emit(
        'join room',
        JSON.stringify({ r: game, n: socket.nickname}));
    })
    socket.on('chat message', msg => {
      io.to(socket.game).emit(
        'chat message',
        JSON.stringify({ n: socket.nickname, m: msg }));
      console.log(`${socket.nickname}: ${msg}`)
    })
    socket.on('answer question', qid => {
      io.to(socket.game).emit(
        'answer question',
        JSON.stringify({ n: socket.nickname, q: qid }));
      console.log(`${socket.nickname} answered q#: ${qid}`);
    })
    socket.on('disconnect', () => {
      io.emit('user disconnected', socket.nickname);
      console.log(`${socket.nickname} disconnected`);
    })
  }
}
