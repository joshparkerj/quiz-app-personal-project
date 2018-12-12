import axios from 'axios';

const api_address = "/";

const err = err => console.error(err);
const r = r => {
  console.log(r.data);
  return r.data;
};

export function postUser(username,password){
  return axios.post(`${api_address}user`,{
    username: username,
    password: password
  })
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

export function scrapeWiki(term){
  return axios.get(`${api_address}questions/mc/new/scrape/${term}`)
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
