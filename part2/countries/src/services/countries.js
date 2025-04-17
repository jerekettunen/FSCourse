import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'

const getCountryNames = () => {
    return axios.get(`${baseUrl}all`)
        .then(response => response.data)
}

const getCountry = (name) => {
    const request = axios.get(`${baseUrl}name/${name}`)
    return request.then(response => response.data)
}


//weather api
const API_KEY = 'Add openweather API key here'

const getCapitalInfo = (capital) => {
    const request = axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${capital}&limit=1&appid=${API_KEY}`)
    return request.then(response => response.data)
}

const getWeather = (lat, lon) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    return request.then(response => response.data)
}

export default { getCountryNames, getCountry, getCapitalInfo, getWeather }