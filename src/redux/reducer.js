const initState = {
  user_id: null
}

export const setUserId = id => {
  return {
    type: "SET_USER_ID",
    payload: {
      user_id: id
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
    default:
      return state;
  }
}

export default reducer;
