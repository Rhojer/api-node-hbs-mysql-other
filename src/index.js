const express = require('express');
const morgan = require('morgan');
const exphbs  = require('express-handlebars');
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const {database} = require('./keys')
const MySQLStore = require('express-mysql-session')(session)
const passport = require ('passport')

if (typeof localStorage === "undefined" || localStorage === null) {
   const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

//init
const app = express();
require('./lib/passport')

//config
app.set('port', process.env.PORT || 7001);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs')


//middlewares

app.use(session({
    secret: 'linksApp',
    saveUninitialized: false,
    resave: false,
    store: new MySQLStore(database)

}))
app.use(flash())
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use(require('./routes'))
app.use(require('./routes/auth'))
app.use('/links', require('./routes/links'))

//Public
app.use(express.static(path.join(__dirname, 'public')))

//Global Variables
app.use((req,res,next)=>{
    const success = req.flash('success')
    next({success})
})

app.listen (app.get('port'), () =>{
    console.log('server on Port: ', app.get('port'));
})