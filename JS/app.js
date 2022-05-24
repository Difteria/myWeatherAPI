const weatherIcons = {
    'Clear' : 'wi wi-day-sunny' ,
    'Clouds' : 'wi wi-cloudy' ,
    'Rain' : 'wi wi-rain' ,
    'Drizzle' : 'wi wi-sleet' ,
    'Mist' : 'wi wi-fog' ,
    'Snow' : 'wi wi-snow' ,
    'Thunderstorm' : 'wi wi-thunderstorm' ,
    'Haze' : 'wi wi-day-haze'
}

const capitalize = function(string) {
    return string[0].toUpperCase() + string.slice(1)
}


async function main() {
    // const ip = await fetch('https://api.ipify.org?format=json')
    // .then(function (result) {
    //     return result.json()
    // })
    // .then(function (json) {
    //     console.log(json)
    //     console.log(json.ip)
    //     json.ip
    // })
    // const ville = await fetch(`http://api.ipstack.com/${ip}?access_key=c6fd7cc6e588eab80b6e6603d2480ac2`)
    // .then(function (result) {       
    //     return result.json()
    // })
    // .then(function (json) {
    //     console.log(json)
    //     json.city
    // })
    let ville = document.querySelector('#ville').textContent
    console.log(ville)
    const meteo = await fetch (`http://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=b50fa6b0dcac04fced2fcfd68274f86a&lang=fr&units=metric`)
    .then(function (result) {
        return result.json()
    })
    .then(function (json) {
        return json
    })
    console.log(meteo)
    displayWeatherInfos(meteo)
    console.log(timeZone(meteo))
}

main()

const date = new Date()
const localTime = [date.getHours(), date.getMinutes(), date.getSeconds()]
const formatedLocalTime = function(arrayTime) {
    let hours = arrayTime[0]
    let minutes = arrayTime[1]
    let seconds = arrayTime[2]
    if (hours < 10) {
        hours = '0' + hours
    }
    if (minutes < 10) {
        minutes = '0' + minutes
    }
    if (seconds < 10) {
        seconds = '0' + seconds
    }
    return hours + ':' + minutes + ':' + seconds
}
// console.log(formatedLocalTime(localTime))

const timeZone = function (data) {
    let decalage = 0
    let dateLocaleTS = 0
    let dateLocale = 0
    let sunrisedate = 0
    let sunriseLocaleTS = 0
    let sunsetdate = 0
    let sunsetLocaleTS = 0
    if (data.timezone < 7200) {
        decalage = 7200 - data.timezone
        dateLocaleTS = (Math.floor(date.getTime()/1000)) - decalage
        dateLocale = new Date(dateLocaleTS * 1000)
        sunriseLocaleTS = data.sys.sunrise - decalage
        sunrisedate = new Date((sunriseLocaleTS) * 1000)
        sunsetLocaleTS = data.sys.sunset - decalage
        sunsetdate = new Date((sunsetLocaleTS) * 1000)
    }
    if (data.timezone === 7200) {
        decalage = 0
        dateLocaleTS = (Math.floor(date.getTime()/1000)) - decalage
        dateLocale = new Date(dateLocaleTS * 1000)
        sunriseLocaleTS = data.sys.sunrise - decalage
        sunrisedate = new Date((sunriseLocaleTS) * 1000)
        sunsetLocaleTS = data.sys.sunset - decalage
        sunsetdate = new Date((sunsetLocaleTS) * 1000)
    }
    if (data.timezone > 7200) {
        decalage = data.timezone - 7200
        dateLocaleTS = (Math.floor(date.getTime()/1000)) + decalage
        dateLocale = new Date(dateLocaleTS * 1000)
        sunriseLocaleTS = data.sys.sunrise + decalage
        sunrisedate = new Date((sunriseLocaleTS) * 1000)
        sunsetLocaleTS = data.sys.sunset + decalage
        sunsetdate = new Date((sunsetLocaleTS) * 1000)
    }
    // console.log(dateLocaleTS)
    // console.log(dateLocale)
    // console.log(sunrisedate)
    // console.log(sunsetdate)
    // console.log(dateLocale.getDay())
    if (dateLocaleTS >= sunriseLocaleTS && dateLocaleTS < sunsetLocaleTS) {
        return 'c\'est le jour'
    }
    if (dateLocaleTS >= sunsetLocaleTS /* || date.getDay() != dateLocale.getDay() */) {
        return 'c\'est la nuit'
    }
}

const displayWeatherInfos = function(data) {
    const name = data.name
    const temperature = data.main.temp
    const conditions = data.weather[0].main
    const description = data.weather[0].description

    document.querySelector('#ville').textContent = name
    document.querySelector('#temperature').textContent = Math.round(temperature*10)/10
    document.querySelector('#condition').textContent = capitalize(description)
    document.querySelector('i.wi').className = weatherIcons[conditions]
    document.querySelector('#myMeteo').className = conditions.toLowerCase()
}

let ville = document.querySelector('#ville')

ville.addEventListener('click', function() {
    ville.contentEditable = true
})
ville.addEventListener('keydown', function(event) {
    if (event.keyCode === 13){
        event.preventDefault()
        ville.contentEditable = false
        main()
    }
})