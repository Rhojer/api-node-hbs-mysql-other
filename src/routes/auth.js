const express = require('express')
const router = express.Router()
const pool = require('../database')
const bcrypt = require('bcryptjs')
const  passport = require('passport')
const jwt = require('jsonwebtoken')
const authorization = require('../lib/authorization.js')


router.get('/signup', (req, res)=>{
    res.render('auth/signup.hbs')
} )
router.post('/signup', async(req, res)=>{
    const {fullname, password, username} = req.body

    const user = {
        fullname,
        password,
        username
        
    }
    user.password = await bcrypt.hash(password, 10)
    const result = await pool.query('INSERT INTO users set ?',[user] )
    if(result){
        req.flash('success', 'Usuario creado satisfactoriamente')
        res.redirect('/signin')
    }
})

router.get('/profile',authorization,(req, res)=>{
    const user = req.user
    res.render('partials/profile',{user})
})

router.get('/signin', (req, res)=>{
    const error = req.flash('error')
    const success = req.flash('success')
    res.render('auth/signin.hbs',{error, success})
})
router.post('/signin', async(req, res)=>{
    const {username, password} = req.body

    const rows = await pool.query('SELECT * FROM users WHERE username = ?',[username])
    if(rows.length > 0){
        const user = rows[0]
        const validPassword = await bcrypt.compare(password, user.password)
        if(validPassword){
            const token = jwt.sign({
                fullname: user.fullname,
                id: user.id,
                username: user.username
            }, '123')
            localStorage.setItem('token', JSON.stringify(token))
            res.redirect('/profile')
        }else{
            req.flash('error','Usuario o Contraseña invalida')
            res.redirect('/signin')
        }
    }else{
        req.flash('error','Usuario o Contraseña invalida')
        res.redirect('/signin')
    }

})
router.get('/logout', (req, res)=>{
    localStorage.removeItem('token')
    res.redirect('/profile')
})

module.exports = router;