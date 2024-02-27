const express = require('express')
const router = express.Router()
const pool = require('../database')
const authorization = require('../lib/authorization.js')
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
  

router.get('/add',authorization, (req, res)=>{
    const user = req.user
    res.render('links/add',{user})
})

router.post('/add', authorization, async(req, res)=>{
    const user = req.user
    const {title, url, description} = req.body
    const newLink = {
        title,
        url,
        description,
        user_id: user.id
    }
    await pool.query('INSERT INTO links set ? ', [newLink])
    req.flash('success','link agregado correctamente')
    res.redirect('/links')
})

router.get('/', authorization, async(req, res)=>{
    const success = req.flash('success')
    const user = req.user
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?',[user.id])
    res.render('links/list', {links, user, success})

})

router.get('/delete/:id',authorization, async(req, res)=>{
    const {id} = req.params
    await pool.query('DELETE FROM links WHERE ID= ?',[id])
    req.flash('success','link eliminado correctamente')
    res.redirect('/links')
})

router.get('/edit/:id',authorization, async(req, res)=>{
    const user = req.user
    const {id} = req.params
    const links = await pool.query('SELECT * FROM links WHERE ID=?', [id])
    res.render('links/edit',{link: links[0], user} )
})

router.post('/edit/:id', async(req, res)=>{
    const {id} = req.params
    const {title, description, url} = req.body
    
    const newLink = {
        title,
        url,
        description
    }
    await pool.query('UPDATE links set ? WHERE ID=?', [newLink,id])
    req.flash('success','link editado correctamente')
    res.redirect('/links')
})
module.exports = router;