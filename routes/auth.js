const express = require("express")
const router = express.Router()

const AuthController  = require('../controllers/AuthController')

// request the ejs view 
router.get('/', (req, res) => {  res.render('Welcome') }); // regular users route
router.get('/register', (req, res) => {  res.render('register') }); 
router.get('/login', (req, res) => { res.render('login') });    
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/users/login');   
    // /users is from main route in server.js, then /login is from login function above, that is exported for the login post route in auth Controller.js
})    


//  for the submitting of info
router.post('/register', AuthController.register) 
router.post('/login', AuthController.login)



module.exports = router