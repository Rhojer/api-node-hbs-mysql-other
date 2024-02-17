const express = require('express')
const router = express.Router()
const pool = require('../database')

router.get('/signup', (req, res)=>{
    res.render('auth/signup.hbs')
} )
router.post('/signup', async(req, res)=>{
    const {fullname, username, password} = req.body
    const user = {
        fullname,
        password,
        username
        
    }
    await pool.query('INSERT INTO users set ?',[user] )
    console.log('recivido')
    res.send('recivido')
})
module.exports = router;