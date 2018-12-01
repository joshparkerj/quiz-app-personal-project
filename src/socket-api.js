import io from 'socket.io-client';

const socket = io();

export function onLogIn(cb){
  socket.on('log in', nickname => cb(nickname));
}

export function onJoinRoom(cb){
  socket.on('join game', msg => cb(JSON.parse(msg)));
}

export function onChatMessage(cb){
  socket.on('chat message', msg => cb(JSON.parse(msg)));
}

export function onAnswerQuestion(cb){
  socket.on('answer question', msg => cb(JSON.parse(msg)));
}

export function onUserDisconnected(cb){
  socket.on('user disconnected',nickname => cb(nickname));
}

export function onSocketQuery(cb){
  socket.on('socket query',response => cb(response));
}

export function emitLogIn(username){
  console.log('logging in on socket...');
  console.log(username);
  socket.emit('log in',username);
}

export function emitJoinGame(game){
  socket.emit('join game', game);
}

export function emitCreateGame(game){
  socket.emit('create game', game)
}

export function emitChatMessage(msg){
  socket.emit('chat message', msg);
}

export function emitAnswerQuestion(qid){
  socket.emit('answer question', qid);
}

export function emitSocketQuery(){
  socket.emit('socket query');
}
