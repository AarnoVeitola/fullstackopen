import { useState, useEffect } from 'react'
import personService from "./services/persons"
import Filter from './Filter'
import Persons from './Persons'
import PersonForm from './PersonForm'



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getPersons()
      .then(initialPersons => {
        setPersons(initialPersons)
    })
  }, [])

  const addPerson = event => {
    console.log(event)
    event.preventDefault()
    console.log("button clicked", event.target)

    const personObject = {
      name: newName,
      number: newNumber
    }

    if (persons.map(person => person.name).includes(newName)) {
      console.log("Persmission asked")
      window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      console.log("Permission granted")
      const updatedPerson = persons.filter(person => person.name === personObject.name)[0]
      console.log(updatedPerson)

      personService
        .updatePerson(updatedPerson.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id != returnedPerson.id ? person : returnedPerson))
          console.log("number updated", returnedPerson)
        })
    } else {
      personService
        .createPerson(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          console.log("person added", returnedPerson)
      })
      setNewName("")
      setNewNumber("")
    }
  }

  const deletePerson = (event, id) => {
    console.log(event)
    event.preventDefault()
    personService
      .deletePerson(id)
      .then(removedPerson => {
        setPersons(persons.filter(person => person.id != removedPerson.id))
    })
  }
  
  const handleNameChange = event => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = event => {
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

      <Persons 
        persons={persons}
        filter={filter} 
        handleSubmit={deletePerson}
      />
    </div>
  )
}

export default App