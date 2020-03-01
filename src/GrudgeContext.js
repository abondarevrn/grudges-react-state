import React, { useReducer, createContext, useCallback } from 'react';

import id from 'uuid/v4';
import initialState from './initialState';

const GRUDGE_ADD = 'GRUDGE_ADD';
const GRUDGE_FORGIVE = 'GRUDGE_FORGIVE';
const UNDO = 'UNDO';
const REDO = 'REDO';

const DEFAULT_STATE = {
    past: [],
    present: initialState,
    future: []
}

const reducer = (state = DEFAULT_STATE, action) => {
    console.log(`DISPATCHING ${action.type}`)

    if (action.type === GRUDGE_ADD) {
        const newPresent = [action.payload, ...state]

        // The state of future is cancelled in the moment we dispatch a new action
        // A new Present is generated
        // The previous present is putted as past[0] in the array of past
        return { past: [state.present, ...state.past], present: newPresent, future: [] }
    }

    if (action.type === GRUDGE_FORGIVE) {
        const newPresent = state.present.map(grudge => {
            if (grudge.id !== action.payload.id) return grudge;
            return { ...grudge, forgiven: !grudge.forgiven }
        })

        return { past: [state.present, ...state.past], present: newPresent, future: [] }
    }

    if (action.type === UNDO) {
        const [newPresent, ...newPast] = state.past
        return {
            past: newPast,
            present: newPresent,
            future: [state.present, ...state.future]
        }
    }

    if (action.type === REDO) {
        const [newPresent, ...newFuture] = state.future;
        const newPast = [state.present, ...state.past];

        return {
            past: newPast,
            present: newPresent,
            future: newFuture
        }
    }

    return state

}

export const GrudgeContext = createContext()

export const GrudgeProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, DEFAULT_STATE)

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