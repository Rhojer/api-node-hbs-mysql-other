const jwt = require('jsonwebtoken')


const authoritazion = (req, res, next)=>{
    const token = JSON.parse(localStorage.getItem('token'))
    jwt.verify(token, '123', (err, user)=>{
        if(err){
            console.log('token invalido')
            res.redirect('/signin')
        }
        req.user = user
        next()
    })
}
module.exports = authoritazion