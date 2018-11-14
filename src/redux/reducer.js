const initState = {
  user_id: null,
  username: '',
  profile_pic: ''
}

export const setUserId = id => {
  return {
    type: "SET_USER_ID",
    payload: {
      user_id: id
    }
  }
}

export const loginInfo = (name,pic) => {
  return {
    type: "LOGIN_INFO",
    payload: {
      username: name,
      profile_pic: pic
    }
  }
}

const reducer = (state=initState, actions) => {
  switch(actions.type){
    case "SET_USER_ID":
      return {
        ...state,
        user_id: actions.payload.user_id
      }
    case "LOGIN_INFO":
      return {
        ...state,
        username: actions.payload.username,
        profile_pic: actions.payload.profile_pic
      }
    default:
      return state;
  }
}

export default reducer;
