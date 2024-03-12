import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      console.log(action.payload)
      const newAnecdote = action.payload
      state.push(newAnecdote)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = id => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    const object = anecdotes.find(a => a.id === id)
    const updatedAnecdote = { ...object, votes: Number(object.votes) + 1}
    await anecdoteService.update(updatedAnecdote)
    dispatch(setAnecdotes(anecdotes.map(anecdote => 
      anecdote.id !== id ? anecdote : updatedAnecdote  
    )))
  }
}

export default anecdoteSlice.reducer