import axios from 'axios';

const api_address = "/";

const err = err => console.error(err);
const r = r => {
  console.log(r.data);
  return r.data;
};

export function get(what){
  return axios.get(`${api_address}${what}`)
    .then(r)
    .catch(err)
}

export function getSession(){
  return axios.get(`${api_address}session`)
    .then(r)
    .catch(err)
}

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

export function getQuizQuestions(){
  return axios.get(`${api_address}quiz/questions`)
    .then(r)
    .catch(err)
}

export function getQuizQuestion(id){
  return axios.get(`${api_address}quiz/question/${id}`)
    .then(r)
    .catch(err)
}

export function checkQuizResponse(q_id,answer,time){
  return axios.post(`${api_address}quiz/response`,{
    q_id: q_id,
    answer: answer,
    time: time
  })
    .then(r)
    .catch(err)
}

export function getApiAuthMe(){
  return axios.get(`${api_address}api/auth/me`)
    .then(r)
    .catch(err)
}

export function logout(){
  return axios.post(`${api_address}api/auth/logout`,{})
    .then(r)
    .catch(err)
}

export function getMC(){
  return axios.get(`${api_address}mc-quiz/new-question`)
    .then(r)
    .catch(err)
}

export function submitSelection(id,choice){
  return axios.post(`${api_address}mc-quiz/submit-choice`,{
    id: id,
    choice: choice
  })
    .then(r)
    .catch(err)
}

export function scrapeWiki(term){
  return axios.get(`${api_address}questions/mc/new/scrape/${term}`)
    .then(r)
    .catch(err)
}

export function getWikiMC(){
  return axios.get(`${api_address}wiki-quiz/new-question`)
    .then(r)
    .catch(err)
}

export function getWikiMCbyCat(category){
  return axios.get(`${api_address}wiki-quiz/new-question/${category}`)
    .then(r)
    .catch(err)
}

export function wikiSelection(id,choice){
  return axios.post(`${api_address}wiki-quiz/submit-choice`,{
    id: id,
    choice: choice
  })
    .then(r)
    .catch(err)
}

export function getWikiCategories(){
  return axios.get(`${api_address}wiki-quiz/categories`)
    .then(r)
    .catch(err)
}

export function createGame(category,count){
  return axios.get(`${api_address}create-game/${category}/${count}`)
    .then(r)
    .catch(err)
}

export function questionAnswered(id){
  return axios.post(`${api_address}question-answered/${id}`)
    .then(r)
    .catch(err)
}

export function setGameOnSession(game){
  return axios.post(`${api_address}setgameonsession`,{
    game: game
  })
    .then(r)
    .catch(err)
}
