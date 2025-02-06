    require('dotenv').config()
// const dotenv = require('dotenv')
// dotenv.config()
const express = require('express')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')

const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const path = require('path')
const isSignedIn = require('./middleware/is-signed-in')
const passUserToView = require('./middleware/pass-user-to-view')

const port = process.env.PORT ? process.env.PORT : '3000'

// creates a connection to MONGO database
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "public")))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 7 * 24 * 60 * 60 // 1 week in seconds
    }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
        httpOnly: true,
        secure: false,
    }
}))
app.use(passUserToView)

// CONTROLLERS
const pagesCtrl = require('./controllers/pages')
const authCtrl = require('./controllers/auth')
const vipCtrl = require('./controllers/vip')
const listingsCtrl = require('./controllers/listings.controller')

// ROUTE HANDLERS
app.get('/', pagesCtrl.home)
app.get('/auth/sign-up', authCtrl.signUp)
app.post('/auth/sign-up', authCtrl.addUser)
app.get('/auth/sign-in', authCtrl.signInForm)
app.post('/auth/sign-in', authCtrl.signIn)
app.get('/auth/sign-out', authCtrl.signOut)
app.get('/vip-lounge', isSignedIn, vipCtrl.welcome)

app.use(isSignedIn) // must be signed in to see below routes
// LISTINGS HANDLERS
app.get('/listings', listingsCtrl.index)
app.get('/listings/new', listingsCtrl.newListing)
// app.post('/listings', listingsCtrl.createListing)
app.post('/listings/:userId', listingsCtrl.createListing)
app.get('/listings/:listingId', listingsCtrl.show)
app.delete('/listings/:userId/:listingId', listingsCtrl.deleteListing)
app.get('/listings/:userId/:listingId/edit', listingsCtrl.edit)
app.put('/listings/:userId/:listingId', listingsCtrl.update)
 
app.listen(port, () => { 
    console.log(`The express app is ready on port ${port}`)
})