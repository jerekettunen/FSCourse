import React, { useState, useEffect } from 'react'
import countryService from '../services/countries'

const Countries = ({ countries, filter, showCountry, handleCountryChange, countryData}) => {
    const filteredCountries = countries.filter(country => country.toLowerCase().includes(filter.toLowerCase()))
  
    if (showCountry)  {
      return (
        <SingleCountry countryData={countryData} searchCountry={showCountry} handleCountryChange={handleCountryChange}/>
      )
    }

    if(filteredCountries.length === 1) {
      handleCountryChange(filteredCountries[0])
    }

    if(filteredCountries.length >= 10) {
  
      return (
        <div>
          <p>Too many countries, refine your search</p>
        </div>
      )
    }
    
    if(filteredCountries.length > 1 && filteredCountries.length < 10) {
      return (
        <div>
          {filteredCountries.map(country => 
          <p key={country}>{country}
          <Button onClick={() => handleCountryChange(country)} text="show" />
          </p>
          )}
        </div>
      )
    }
    
  }
  
  
  const SingleCountry = ({ countryData, searchCountry, handleCountryChange }) => {
    const country = countryData.find(country => country.name.common.toLowerCase() === searchCountry.toLowerCase())
    return (
      <div>
        <h2>{country.name.common}</h2>
        <Button onClick={() => handleCountryChange(null)} text="reset" />
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
        <h3>Weather in {country.capital}</h3>
        <Weather capital={country.capital} />
      </div>
    )
  }

  const Weather = ({ capital }) => {
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      countryService
        .getCapitalInfo(capital)
        .then((capitalInfo) => {
          const lat = capitalInfo[0].lat
          const lon = capitalInfo[0].lon
          return countryService.getWeather(lat, lon)
        })
        .then((weatherData) => {
          setWeather(weatherData)
          setLoading(false)
        })
    }, [capital])

    if (loading) {
      return <p>Loading weather...</p>
    }

    return (
      <div>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
        <p>Temperature: {Math.round(weather.main.temp - 273.15)}°C</p>
        <p>Wind: {weather.wind.speed} m/s</p>
      </div>
    )
  }

  const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>


  export default Countries