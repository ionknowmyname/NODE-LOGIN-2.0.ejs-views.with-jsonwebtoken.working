const User =  require("../models/User")
const bcrypt =  require("bcryptjs")
const jwt =  require("jsonwebtoken")


const register = (req, res, next) => {
    console.log(req.body);
    const { name, email, phone, password } = req.body     // 
    let errors = [];

    if (!name || !email || !password ) {
        errors.push({ msg: 'Please enter all required fields' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        //console.log(errors)
        res.render('register', { errors, name, email, phone, password });  // register.ejs
    }else {
        User.findOne({ email: email }).then(user => { // email in DB: email from req.body
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', { errors, name, email, phone, password });
            } else {
                // encrypt password & submit, return any error
                bcrypt.hash(req.body.password, 10, function(err, hashedPass){
                    if(err){ 
                        //res.json({ error: err })
                        errors.push({ msg: err })
                    }

                    /* 
                    let user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone,
                        password: hashedPass
                    }) 
                    */

                    let user = new User({
                        name,  // coz its same as name: name; ES6 syntax
                        email, // email: email; no need for (email: req.body.email) coz const email was already declared with req.body
                        phone,
                        password: hashedPass
                    })
                    user.save()
                    .then(user => {
                        console.log(req.body)
                        console.log('User added Sucessfully')

                        req.flash('success_msg', 'Successfully Registered, go to login');
                        res.redirect('/users/login');  // redirects to the login GET route in auth.js not login POST route here
                        //res.render("login")    // render login.ejs
                    })
                    .catch(err => { console.log(err) })
                    //res.json({ message: 'An error occured' })        
                })              
            }
        });
    }


    
}


const login = (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    User.findOne({$or: [{ email: username }, { phone: username }]})   // can use either email/phone for username
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(err, result){   // compare currently submitted password with user.password hashed in DB
               if (err) {
                   res.json({ error: err })
                }
               if (result) {
                    let token = jwt.sign({ name: user.name }, 'verySecretValue', { expiresIn: '1hr' })
                    //res.json({ message: 'Login Successful', token })
                    console.log('Login Successful with Token: ' + token)
                    res.render("dashboard");   // dashboard.ejs view
                }else{
                res.json({ message: 'Password does not match' })
                }
            }) 
        }else{
            res.json({ message: 'No user found!' })
        }
    })
}






module.exports = { register, login }