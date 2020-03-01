import { useReducer } from 'react';

export const UNDO = "UNDO"
export const REDO = "REDO"

export const useTimeTravelReducer = (reducer, initialState) => {

    // Adding past and future in the state
    const enhancedState = {
        past: [],
        present: initialState,
        future: []
    }

    const enhancedReducer = (state, action) => {

        console.log(`DISPATCHING ${action.type}`)

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

        // If the action is not UNDO / REDO call the BASIC reducer passed to the useTimeTravelReducer
        // to get the newPresent state and shuffle the previousState to to past[0] element and reset
        // the future array

        const newPresent = reducer(state.present, action)

        return { past: [state.present, ...state.past], present: newPresent, future: [] }
    }

    return useReducer(enhancedReducer, enhancedState)
}