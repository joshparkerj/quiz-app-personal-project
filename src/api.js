import axios from 'axios';

const api_address = "/";
const err = err => console.error(err);
const r = r => r.data;

export function postUser(username, password) {
  return axios.post(`${api_address}user`, {
    username: username,
    password: password
  })
    .then(r)
    .catch(err)
}

export function authenticateUser(username, password) {
  return axios.post(`${api_address}user-login`, {
    username: username,
    password: password
  })
    .then(r)
    .catch(err)
}

export function getApiAuthMe() {
  return axios.get(`${api_address}api/auth/me`)
    .then(r)
    .catch(err)
}

export function logout() {
  return axios.post(`${api_address}api/auth/logout`, {})
    .then(r)
    .catch(err)
}

export function scrapeWiki(term) {
  return axios.get(`${api_address}questions/mc/new/scrape/${term}`)
    .then(r)
    .catch(err)
}

export function wikiSelection(id, choice) {
  return axios.post(`${api_address}wiki-quiz/submit-choice`, {
    id: id,
    choice: choice
  })
    .then(r)
    .catch(err)
}

export function getWikiCategories() {
  return axios.get(`${api_address}wiki-quiz/categories`)
    .then(r)
    .catch(err)
}

export function createGame(category, count) {
  return axios.get(`${api_address}create-game/${category}/${count}`)
    .then(r => {
      if(Number(r.status) === 204){
        return 'count too high';
      }else{
        return r.data;
      }
    })
    .catch(err)
}

export function questionAnswered(id) {
  return axios.post(`${api_address}question-answered/${id}`)
    .then(r)
    .catch(err)
}

export function setGameOnSession(game) {
  return axios.post(`${api_address}setgameonsession`, {
    game: game
  })
    .then(r)
    .catch(err)
}

export function leaveGameSession() {
  return axios.post(`${api_address}leavegamesession`)
    .then(r)
    .catch(err)
}

export function getMyStats() {
  return axios.get(`${api_address}api/userstats/me`)
    .then(r)
    .catch(err)
}

export function getAllStats() {
  return axios.get(`${api_address}api/allstats`)
    .then(r)
    .catch(err)
}

export function getMyProgress() {
  return axios.get(`${api_address}api/userprogress/me`)
    .then(r)
    .catch(err)
}

export function getProgressLeaderboard() {
  return axios.get(`${api_address}api/progressleaderboard`)
    .then(r)
    .catch(err)
}

export function getSimilarUsers() {
  return axios.get(`${api_address}api/similarusers`)
    .then(r => {
      if(Number(r.status) === 400){
        return 'try answering some questions first';
      }else{
        return r.data;
      }
    })
    .catch(err)
}

export function resetScore() {
  return axios.post(`${api_address}resetscore`)
    .then(r)
    .catch(err)
}

export function getEntireCategory(category) {
  return axios.get(`${api_address}admin/getcat/${category}`)
    .then(r)
    .catch(err)
}

export function deleteWikiQuestion(id){
  return axios.delete(`${api_address}admin/delete/${id}`)
    .then(r)
    .catch(err)
}

export function updateWikiQuestion(id,text){
  return axios.put(`${api_address}admin/update/${id}`,{
    text: text
  })
    .then(r)
    .catch(err)
}