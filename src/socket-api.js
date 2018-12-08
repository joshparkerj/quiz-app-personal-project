import io from 'socket.io-client';

const socket = io();

export function refreshConnection(){
  io.connect({'forceNew': true})
}

export function onLogIn(cb){
  socket.on('log in', nickname => cb(nickname));
}

export function onWhoAreYou(cb){
  socket.on('who are you', () => cb());
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
  socket.on('socket query',response => cb(JSON.parse(response)));
}

export function onGamesFound(cb){
  socket.on('games found', gamelist => cb(JSON.parse(gamelist)));
}

export function onGameInfo(cb){
  socket.on('game info', game => cb(JSON.parse(game)));
}

export function emitLogIn(username){
  socket.emit('log in',username);
}

export function emitWhoAmI(username){
  socket.emit('who i am',username);
}

export function emitJoinGame(user){
  socket.emit('join game', user);
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

export function emitFindGame(){
  socket.emit('find game');
}
