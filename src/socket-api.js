import io from 'socket.io-client';

const socket = io();

export function onLogIn(cb){
  socket.on('log in', nickname => cb(nickname));
}

export function onJoinRoom(cb){
  socket.on('join room', msg => cb(JSON.parse(msg)));
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

export function emitLogIn(){
  socket.emit('log in');
}

export function emitJoinRoom(roomname){
  socket.emit('join room', roomname);
}

export function emitChatMessage(msg){
  socket.emit('chat message', msg);
}

export function emitAnswerQuestion(qid){
  socket.emit('answer question', qid);
}
