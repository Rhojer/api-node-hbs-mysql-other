const passport = require ('passport')
const localStrategy = require ('passport-local').Strategy
const pool = require('../database')
const bcrypt = require('bcryptjs')

passport.use('local.signin', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done)=>{
    
    const rows = await pool.query('SELECT * FROM users WHERE username = ?',[username])
    if(rows.length > 0){
        const user = rows[0]
        const validPassword = await bcrypt.compareSync(password, user.password)
        console.log(validPassword)
        if(validPassword){
            done(null,user)
        }else{
            done(null,false)
        }
    }
}))

passport.use('local.signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done)=>{
    const {fullname} = req.body

    const user = {
        fullname,
        password,
        username
        
    }
    user.password = await bcrypt.hash(password, 10)
    const result = await pool.query('INSERT INTO users set ?',[user] )
    user.id = result.insertId
    return done(null, user)
}))

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser(async(id,done)=>{
    const rows= await pool.query('SELECT * FROM users WHERE id = ?',[id])
    done(null, rows[0])

})