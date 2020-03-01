import React, { createContext, useCallback } from 'react';

import id from 'uuid/v4';

import { UNDO, REDO, useTimeTravelReducer } from './hooks/useTimeTravelReducer'
import initialState from './initialState';

const GRUDGE_ADD = 'GRUDGE_ADD';
const GRUDGE_FORGIVE = 'GRUDGE_FORGIVE';

const reducer = (state = initialState, action) => {

    if (action.type === GRUDGE_ADD) {
        return [action.payload, ...state]
    }

    if (action.type === GRUDGE_FORGIVE) {
        return state.map(grudge => {
            if (grudge.id !== action.payload.id) return grudge;
            return { ...grudge, forgiven: !grudge.forgiven }
        })
    }

    return state

}

export const GrudgeContext = createContext()

export const GrudgeProvider = ({ children }) => {
    const [state, dispatch] = useTimeTravelReducer(reducer, initialState)

    const { past, present: grudges, future } = state;

    const isPast = !!past.length;
    const isFuture = !!future.length;

    const addGrudge = useCallback(({ person, reason }) => {
        dispatch({ type: GRUDGE_ADD, payload: { person, reason, id: id(), forgiven: false } })
    }, [dispatch]);


    const toggleForgiveness = useCallback((id) => {
        dispatch({ type: GRUDGE_FORGIVE, payload: { id } })
    }, [dispatch]);

    const undo = useCallback(() => {
        dispatch({ type: UNDO })
    }, [dispatch])

    const redo = useCallback(() => {
        dispatch({ type: REDO })
    }, [dispatch])

    const value = { grudges, addGrudge, toggleForgiveness, undo, redo, isPast, isFuture }

    return <GrudgeContext.Provider {...{ value }}>
        {children}
    </GrudgeContext.Provider>
};