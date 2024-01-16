import { useState } from 'react'

const Button = ({ text, handleClick }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState({ index: 0, votes: Array(anecdotes.length).fill(0) })

  const nextAnecdote = () => {
    const index = Math.floor(Math.random() * anecdotes.length)
    setSelected({ 
      ...selected,
      index: index, 
    })
    console.log("Index of new anecdote is", index)
  }

  const voteAnecdote = () => {
    const index = selected.index
    const votes = selected.votes
    votes[index] += 1

    setSelected({
      ...selected,
      votes: votes
    })

    console.log(selected.votes)
    console.log(`Increased votes of anecdote ${index} from ${selected.votes[index] - 1} to ${selected.votes[index]}`)
  }

  const findIndexOfMax = () => {
    const max = selected.votes.reduce((m, n) => Math.max(m, n))
    return selected.votes.findIndex(i => i === max)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected.index]}
      <br/>
      has {selected.votes[selected.index]} votes
      <br/>
      <Button text="vote" handleClick={voteAnecdote} />
      <Button text="next anecdote" handleClick={nextAnecdote} />

      <h2>Anecdote with most votes</h2>
      {anecdotes[findIndexOfMax()]}
    </div>
  )
}

export default App