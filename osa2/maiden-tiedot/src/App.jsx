import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './Countries'

const api_key = import.meta.env.VITE_SOME_KEY


const App = () => {
  const [value, setValue] = useState('')
  const [search, setSearch] = useState(null)
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    console.log('effect run, search is now', search)

    if (search) {
      console.log('fetching countries...')
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          const matchingCountries = response.data.filter(
            country => country.name.common.toLowerCase().startsWith(search.toLowerCase())
          )
          console.log(matchingCountries)
          setCountries(matchingCountries)
        })
    } else {
      setCountries([])
    }
  }, [value])

  useEffect(() => {
    if (countries.length === 1) {
      console.log('fetching weather...')
      const country = countries[0]
      if (country.capitalInfo.latlng) {
        console.log('capital info found, fetching weather for capital')
        const [lat, lon] = country.capitalInfo.latlng
        axios
          .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
          .then(response => {
            console.log(response.data)
            setWeather(response.data)
          })
      }
    } else {
      console.log('not fetching weather, too many results...')
      setWeather(null)
    }
  }, [countries])

  const handleChange = (event) => {
    setValue(event.target.value)
    setSearch(event.target.value)
    console.log(event.target.value)
  }

  return (
    <div>
      <form>
        find countries <input value={value} onChange={handleChange} />
      </form>
      <Countries countries={countries} weather={weather} />
    </div>
  )
}

export default App