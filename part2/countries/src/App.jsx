import { useState, useEffect } from 'react'
import countryService from './services/countries'
import Countries from './components/Countries'

const Search = ({ search, handleSearchChange }) => {

  return (
    <div>
      <input value={search} onChange={handleSearchChange} />
    </div>
  )
}

const App = () => {

  const [search, setSearch] = useState('')
  const [countryData, setCountryData] = useState([])
  const [countryNames, setCountryNames] = useState([])
  const [showCountry, setShowCountry] = useState(null)

    // Fetch country names from server
    useEffect( () => {
      countryService
        .getCountryNames()
        .then((allCountries) => {
          setCountryData(allCountries)
          setCountryNames(allCountries.map(country => country.name.common))
        })
    }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    handleCountryChange(null)
  }

  const handleCountryChange = (name) => {
    setShowCountry(name)
    
    
  }
  
  return (
  <div>
      <h2>Countries</h2>
      <p>Search for a country </p>
      <Search search = {search} handleSearchChange={handleSearchChange}/>
      <Countries countries = {countryNames} 
        filter = {search}
        showCountry = {showCountry} 
        handleCountryChange={handleCountryChange}
        countryData={countryData}
         />
  </div>
  )
}

export default App
