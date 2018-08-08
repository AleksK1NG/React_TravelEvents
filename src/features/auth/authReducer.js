import { LOGIN_USER, SIGN_OUT_USER } from './authConstants';
import { createReducer } from '../../app/common/util/reducerUtil';

const initialState = {
  currentUser: {}
};

export const loginUser = (state, payload) => {
  return {
    ...state,
    authenticated: true,
    currentUser: payload.creds.email
  }
};

export const signOutUser = (state, payload) => {
  return {
    ...state,
    authenticated: false,
    currentUser: {}
  }
};

//
// const authReducer = (state = initialState, action) => {
//   switch (action.type) {
//
//     case LOGIN_USER:
//       return {
//         ...state,
//         authenticated: true,
//         currentUser: action.payload.email
//       };
//
//     default:
//       return state
//   }
// };
//
// export default authReducer;


export default createReducer(initialState, {
  [LOGIN_USER]: loginUser,
  [SIGN_OUT_USER]: signOutUser
});
