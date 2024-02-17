const express = require('express')
const router = express.Router()
const pool = require('../database')

router.get('/add', (req, res)=>{
    res.render('links/add')
})

router.post('/add', async(req, res)=>{
    console.log(req.body)
    const {title, url, description} = req.body
    const newLink = {
        title,
        url,
        description
    }
    await pool.query('INSERT INTO links set ? ', [newLink])
    req.flash('success','link agregado correctamente')
    res.redirect('/links')
})

router.get('/', async(req, res)=>{
    const links = await pool.query('SELECT * FROM links')
    res.render('links/list', {links})

})

router.get('/delete/:id', async(req, res)=>{
    const {id} = req.params
    await pool.query('DELETE FROM links WHERE ID= ?',[id])
    res.redirect('/links')
})

router.get('/edit/:id', async(req, res)=>{
    const {id} = req.params
    const links = await pool.query('SELECT * FROM links WHERE ID=?', [id])
    res.render('links/edit',{link: links[0]} )
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
    res.redirect('/links')
})
module.exports = router;