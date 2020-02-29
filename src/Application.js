import React, { useReducer, useCallback } from 'react';

import id from 'uuid/v4';

import Grudges from './Grudges';
import NewGrudge from './NewGrudge';

import initialState from './initialState';

const GRUDGE_ADD = 'GRUDGE_ADD';
const GRUDGE_FORGIVE = 'GRUDGE_FORGIVE';

const reducer = (state, action) => {
  console.log(`DISPATCHING ${action.type}`)

  switch (action.type) {
    case GRUDGE_ADD:
      return [action.payload, ...state]
    case GRUDGE_FORGIVE:
      return state.map(grudge => {
        if (grudge.id !== action.payload.id) return grudge;
        return { ...grudge, forgiven: !grudge.forgiven }
      })
    default:
      return state;
  }

}

const Application = () => {
  const [grudges, dispatch] = useReducer(reducer, initialState)

  const addGrudge = useCallback(({ person, reason }) => {
    dispatch({ type: GRUDGE_ADD, payload: { person, reason, id: id(), forgiven: false } })
  }, [dispatch]);

  // NOTE: toggleForgiveness will not change so all the <Grudge /> elements will not 
  // re render based on the function but only based on the new value of the grudge 
  // that actually changed because of the function itself that dispatch a TOGGLE_FORGIVE action

  const toggleForgiveness = useCallback((id) => {
    dispatch({ type: GRUDGE_FORGIVE, payload: { id } })
  }, [dispatch]);

  // OLD: Less performance

  // const addGrudge = ({ person, reason }) => {
  //   dispatch({ type: GRUDGE_ADD, payload: { person, reason, id: id(), forgiven: false } })
  // };

  // const toggleForgiveness = (id) => {
  //   dispatch({ type: GRUDGE_FORGIVE, payload: { id } })
  // };

  return (
    <div className="Application">
      <NewGrudge onSubmit={addGrudge} />
      <Grudges grudges={grudges} onForgive={toggleForgiveness} />
    </div>
  );
};

export default Application;
