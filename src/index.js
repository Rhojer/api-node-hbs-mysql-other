const express = require('express');
const morgan = require('morgan');
const exphbs  = require('express-handlebars');
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const {database} = require('./keys')
const MySQLStore = require('express-mysql-session')(session)

//init
const app = express();

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

//Routes
app.use(require('./routes'))
app.use(require('./routes/auth'))
app.use('/links', require('./routes/links'))

//Public
app.use(express.static(path.join(__dirname, 'public')))

//Global Variables
app.use((req,res,next)=>{
console.log(req.flash('success'))

    next()
})

app.listen (app.get('port'), () =>{
    console.log('server on Port: ', app.get('port'));
})