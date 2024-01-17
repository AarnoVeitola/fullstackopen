import { useState } from 'react'

const Persons = ({ persons, filter }) => {
  const numbers = persons.filter(person => 
    person.name.toLowerCase().startsWith(filter.toLowerCase())
  )

  return (
    <ul>
      {numbers.map(person =>
        <Number key={person.name} person={person} />  
      )}
    </ul>
  )
}

const Number = ({ person }) => {
  return (
    <li>
      {person.name} {person.number}
    </li>
  )
}

const Filter = ({ filter, handleChange}) => {
  return (
    <form>
      <div>
        filter shown with <input value={filter} onChange={handleChange} />
      </div>
    </form>
  )
}

const PersonForm = ({ handleSubmit, value1, value2, handleChange1, handleChange2 }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={value1} onChange={handleChange1} />
        <br/>
        number: <input value={value2} onChange={handleChange2} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    console.log("button clicked", event.target)

    if (persons.map(person => person.name).includes(newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }

      setPersons(persons.concat(personObject))
      setNewName("")
      setNewNumber("")
      console.log("person logged", personObject)
    }
  }
  
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} handleChange={handleFilterChange} />
      
      <h3>Add a new</h3>

      <PersonForm 
        handleSubmit={addPerson} 
        value1={newName} 
        value2={newNumber} 
        handleChange1={handleNameChange} 
        handleChange2={handleNumberChange} 
      />

      <h3>Numbers</h3>

      <Persons persons={persons} filter={filter} />
    </div>
  )
}

export default App