import axios from 'axios';

const api_address = "http://localhost:8080/";

const err = err => console.error(err);
const r = r => r.data;

export function getHealth(){
  return axios.get(`${api_address}health`)
    .then(r)
    .catch(err)
}

export function getQuip(){
  return axios.get(`${api_address}quip`)
    .then(r)
    .catch(err)
}

export function getQuestions(){
  return axios.get(`${api_address}questions`)
    .then(r)
    .catch(err)
}

export function addQuestion(text,answer,id){
  return axios.post(`${api_address}question`,{
    text: text,
    answer: answer,
    author: id
  })
    .then(r)
    .catch(err)
}

export function getQuestion(id){
  return axios.get(`${api_address}question/${id}`)
    .then(r)
    .catch(err)
}

export function deleteQuestion(id){
  return axios.delete(`${api_address}question/${id}`)
    .then(r)
    .catch(err)
}

export function getUsers(){
  return axios.get(`${api_address}users`)
    .then(r)
    .catch(err)
}

export function postUser(username,password){
  return axios.post(`${api_address}user`,{
    username: username,
    password: password
  })
    .then(r)
    .catch(err)
}

export function getUser(id){
  return axios.get(`${api_address}user/${id}`)
    .then(r)
    .catch(err)
}

export function deleteUser(id){
  return axios.delete(`${api_address}user/${id}`)
    .then(r)
    .catch(err)
}

export function authenticateUser(username,password){
  return axios.post(`${api_address}user-login`,{
    username: username,
    password: password
  })
    .then(r)
    .catch(err)
}
