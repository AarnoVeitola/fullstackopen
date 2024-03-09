import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div key={anecdote.id}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdotesList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    console.log(state.anecdotes)
    return state.anecdotes.filter(a => {
      console.log(a)
      return a.content
        .toLowerCase()
        .includes(state.filter.toLowerCase())
      }
      )
  })
  return (
    <div>
      {anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => {
            dispatch(voteAnecdote(anecdote.id))
            dispatch(setNotification(`you voted '${anecdote.content}'`))
            setTimeout(() => {
              dispatch(setNotification(''))
            }, 5000)
            }
          }
        />
      )}
    </div>
  )
}

export default AnecdotesList