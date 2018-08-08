import { DECREMENT_COUNTER, INCREMENT_COUNTER, COUNTER_ACTION_FINISHED, COUNTER_ACTION_STARTED } from './testConstants';

export const incrementCounter = (payload) => {
  return {
    type: INCREMENT_COUNTER,
    payload
  }
};

export const decrementCounter = (payload) => {
  return {
    type: DECREMENT_COUNTER,
    payload
  }
};

export const startCounterAction = () => {
  return {
    type: COUNTER_ACTION_STARTED
  }
};

export const finishCounterAction = () => {
  return {
    type: COUNTER_ACTION_FINISHED
  }
};

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
};


export const incrementAsync = (payload) => {
  return async dispatch => {
    dispatch(startCounterAction());
    await delay(1000);
    dispatch({ type: INCREMENT_COUNTER, payload });
    dispatch(finishCounterAction());
  }
};

export const decrementAsync = (payload) => {
  return async dispatch => {
    dispatch(startCounterAction());
    await delay(1000);
    dispatch({ type: DECREMENT_COUNTER, payload });
    dispatch(finishCounterAction());
  }
};