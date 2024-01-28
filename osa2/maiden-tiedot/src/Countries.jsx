const Languages = ({ country }) => {
  if (!country.languages) {
    return null
  }
  
  return (
    <div>
    <b>languages:</b>
    <ul>
      {Object.values(country.languages).map(language => 
        <li key={language}>{language}</li>
      )}
    </ul>
    </div>
  )
}

const Weather = ({ country, weather }) => {
  if (!weather) {
    return null
  }

  const calcTemp = temp => {
    return +(Math.round(temp - 273.15 + "e+2") + "e-2")
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div>
      <h2>Weather in {country.capital[0]}</h2>

      <p>temperature {calcTemp(weather.main.temp)} Celsius</p>

      <img src={iconUrl} />

      <p>wind {weather.wind.speed} m/s</p>

    </div>
  )
}
  
const Flag = ({ country }) => {
  if (!country.flag) {
    return null
  }

  return (
    <img src={country.flags.png} />
  )
}
  
const Countries = ({ countries, weather }) => {
  if (countries.length >= 10) {
    return (
      "Too many matches, specify another filter"
    )
  }

  if (countries.length === 1) {
    const country = countries[0]

    return (
        <div>
          <h2>{country.name.common}</h2>
          <p>capital {country.capital}</p>
          <p>area {country.area}</p>

          <Languages country={country} />
          
          <Flag country={country} />

          <Weather country={country} weather={weather} />
        </div>
    )
  }

  return (
    <ul>
      {countries.map(country =>
        <li key={country.name.common}>{country.name.common}</li>
      )}
    </ul>
  )
}

export default Countries