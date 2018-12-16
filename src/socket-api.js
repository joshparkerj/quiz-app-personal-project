import io from 'socket.io-client';

const socket = io();

export function refreshConnection(){
  io.connect({'forceNew': true})
}

export function onWhoAreYou(cb){
  socket.on('who are you', () => cb());
}

export function onJoinRoom(cb){
  socket.on('join game', msg => cb(JSON.parse(msg)));
}

export function onLeaveGame(cb){
  socket.on('leave game', name => cb(name));
}

export function onAnswerQuestion(cb){
  socket.on('answer question', msg => cb(JSON.parse(msg)));
}

export function onGamesFound(cb){
  socket.on('games found', gamelist => cb(JSON.parse(gamelist)));
}

export function onGameInfo(cb){
  socket.on('game info', game => cb(JSON.parse(game)));
}

export function onGameNameUnavailable(cb){
  socket.on('game name unavailable', () => cb());
}

export function onGameNameOK(cb){
  socket.on('game name ok!', () => cb());
}

export function emitLogIn(username){
  socket.emit('log in',username);
}

export function emitWhoAmI(username){
  socket.emit('who i am',username);
}

export function emitJoinGame(game){
  socket.emit('join game', game);
}

export function emitLeaveGame(){
  socket.emit('leave game');
}

export function emitCreateGame(game){
  socket.emit('create game', game)
}

export function emitAnswerQuestion(qid){
  socket.emit('answer question', qid);
}

export function emitFindGame(){
  socket.emit('find game');
}

export function emitCheckName(name){
  socket.emit('check name', name);
}
