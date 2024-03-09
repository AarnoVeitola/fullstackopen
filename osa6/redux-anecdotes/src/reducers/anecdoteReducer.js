import { createSlice } from '@reduxjs/toolkit'

/* THESE ARE USELESS SINCE WE ARE USING JSON SERVER
const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}
*/

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      console.log(action.payload)
      const newAnecdote = action.payload
      state.push(newAnecdote)
    },
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(a => a.id === id)
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: Number(anecdoteToChange.votes) + 1
      }
      return state.map(anecdote => 
        anecdote.id !== id ? anecdote : changedAnecdote  
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { createAnecdote, voteAnecdote, setAnecdotes } = anecdoteSlice.actions

export default anecdoteSlice.reducer