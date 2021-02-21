const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')


//Load config
dotenv.config({
  path: './config/config.env'
})

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Handlebars Helpers
const {
  select,
} = require('./helpers/hbs')

//Handlebars
app.engine(
  '.hbs',
  exphbs({
    helpers: {
      select,
    },
    defaultLayout: 'main',
    extname: '.hbs',
  })
)
app.set('view engine', '.hbs')

//Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
)

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Connect flash
app.use(flash())

//Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Bodyparser
app.use(express.urlencoded({
  extended: false
}))
app.use(express.json())

//Method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//Routes
app.use('/', require('./routes/index'))
app.use('/user', require('./routes/user'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))