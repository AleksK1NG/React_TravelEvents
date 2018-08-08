import { createReducer } from '../../app/common/util/reducerUtil';
import { INCREMENT_COUNTER, DECREMENT_COUNTER, COUNTER_ACTION_FINISHED, COUNTER_ACTION_STARTED } from './testConstants';


const initialState = {
  data: 1257,
  loading: false
};

export const incrementCounter = (state, payload) => {
  return {...state, data: state.data + payload};
};

export const decrementCounter = (state, payload) => {
  return {...state, data: state.data - payload};
};

export const counterActionStarted = (state, payload) => {
  return {...state, loading: true}
};

export const counterActionFinished = (state, payload) => {
  return {...state, loading: false}
};


// const testReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case INCREMENT_COUNTER:
//       return {
//         ...state,
//         data: state.data + action.payload
//       };
//     case DECREMENT_COUNTER:
//       return {
//         ...state,
//         data: state.data - action.payload
//       };
//     default:
//       return state;
//   }
// };


export default createReducer(initialState, {
  [INCREMENT_COUNTER]: incrementCounter,
  [DECREMENT_COUNTER]: decrementCounter,
  [COUNTER_ACTION_FINISHED]: counterActionFinished,
  [COUNTER_ACTION_STARTED]: counterActionStarted
});