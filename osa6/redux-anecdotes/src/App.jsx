import AnecdotesList from './components/AnecdotesList'
import AnecdoteForm from './components/AnecdoteForm'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteForm />
      <AnecdotesList />
    </div>
  )
}

export default App