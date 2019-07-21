const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

//Define paths for Express config
const pathDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Steup static directory to serve
app.use(express.static(pathDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: "Ayan"
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Ayan'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: "Help Page",
        helpText: 'This is helpful message',
        name: "Ayan"
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: "you must provide an address"
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: "you must provide a search term"
        })
    }
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: "Ayan",
        errorMessage: "Help article not found."
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'My 404 page',
        name: "Ayan",
        errorMessage: 'Page not found.'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})


// app.get('', (req, res) => {
//     res.send('<h1>Weather</h1>')
// })

/* app.get('/help', (req, res) => {
    res.send({
        name: "Ayan",
        age: 35
    })
})

app.get('/about', (req, res) => {
    res.send('<h1>About</h1>')
}) */