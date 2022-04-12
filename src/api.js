import axios from 'axios';
import debug from 'debug';

const apiAddress = '/';
const handleError = (err) => debug('api')(err);
const handleResponse = (r) => r.data;

export function postUser(username, password) {
  return axios.post(`${apiAddress}user`, {
    username,
    password,
  })
    .then(handleResponse)
    .catch(handleError);
}

export function authenticateUser(username, password) {
  return axios.post(`${apiAddress}user-login`, {
    username,
    password,
  })
    .then(handleResponse)
    .catch(handleError);
}

export function getApiAuthMe() {
  return axios.get(`${apiAddress}api/auth/me`)
    .then(handleResponse)
    .catch(handleError);
}

export function logout() {
  return axios.post(`${apiAddress}api/auth/logout`, {})
    .then(handleResponse)
    .catch(handleError);
}

export function scrapeWiki(term) {
  return axios.get(`${apiAddress}questions/mc/new/scrape/${term}`)
    .then(handleResponse)
    .catch(handleError);
}

export function wikiSelection(id, choice) {
  return axios.post(`${apiAddress}wiki-quiz/submit-choice`, {
    id,
    choice,
  })
    .then(handleResponse)
    .catch(handleError);
}

export function getWikiCategories() {
  return axios.get(`${apiAddress}wiki-quiz/categories`)
    .then(handleResponse)
    .catch(handleError);
}

export function createGame(category, count) {
  return axios.get(`${apiAddress}create-game/${category}/${count}`)
    .then((r) => {
      if (Number(r.status) === 204) {
        return 'count too high';
      }

      return r.data;
    })
    .catch(handleError);
}

export function questionAnswered(id) {
  // id must be a number
  if (typeof id !== 'number') {
    return Promise.reject(new Error('id must be a number'));
  }

  return axios.post(`${apiAddress}question-answered/${id}`)
    .then(handleResponse)
    .catch(handleError);
}

export function setGameOnSession(game) {
  return axios.post(`${apiAddress}setgameonsession`, {
    game,
  })
    .then(handleResponse)
    .catch(handleError);
}

export function leaveGameSession() {
  return axios.post(`${apiAddress}leavegamesession`)
    .then(handleResponse)
    .catch(handleError);
}

export function getMyStats() {
  return axios.get(`${apiAddress}api/userstats/me`)
    .then(handleResponse)
    .catch(handleError);
}

export function getAllStats() {
  return axios.get(`${apiAddress}api/allstats`)
    .then(handleResponse)
    .catch(handleError);
}

export function getMyProgress() {
  return axios.get(`${apiAddress}api/userprogress/me`)
    .then(handleResponse)
    .catch(handleError);
}

export function getProgressLeaderboard() {
  return axios.get(`${apiAddress}api/progressleaderboard`)
    .then(handleResponse)
    .catch(handleError);
}

export function getSimilarUsers() {
  return axios.get(`${apiAddress}api/similarusers`)
    .then((r) => {
      if (Number(r.status) === 204) {
        return 'try answering some questions first';
      }

      return r.data;
    })
    .catch(handleError);
}

export function resetScore() {
  return axios.post(`${apiAddress}resetscore`)
    .then(handleResponse)
    .catch(handleError);
}

export function getEntireCategory(category) {
  return axios.get(`${apiAddress}admin/getcat/${category}`)
    .then(handleResponse)
    .catch(handleError);
}

export function deleteWikiQuestion(id) {
  return axios.delete(`${apiAddress}admin/delete/${id}`)
    .then(handleResponse)
    .catch(handleError);
}

export function updateWikiQuestion(id, text) {
  return axios.put(`${apiAddress}admin/update/${id}`, {
    text,
  })
    .then(handleResponse)
    .catch(handleError);
}
