import axios from 'axios';

const api_address = "http://localhost:8080";

const err = err => console.error(err);

export function getHealth(){
  return axios.get(`${api_address}/health`)
    .then(r => {
      return r.data;})
    .catch(err)
}

export function getQuip(){
  return axios.get(`${api_address}/quip`)
    .then(r => {
      return r.data;})
    .catch(err)
}

export function getQuestions(){
  return axios.get(`${api_address}/questions`)
    .then(r => {
      return r.data;})
    .catch(err)
}

export function addQuestion(text,answer){
  return axios.post(`${api_address}/question`,{
    text: text,
    answer: answer
  })
    .then(r => {
      return r.data;})
    .catch(err)
}

export function getQuestion(id){
  return axios.get(`${api_address}/question/${id}`)
    .then(r => {
      return r.data;})
    .catch(err)
}

export function deleteQuestion(id){
  return axios.delete(`${api_address}/question/${id}`)
    .then(r => {
      return r.data;})
    .catch(err)
}
