const express = require("express");
const mongoose = require('mongoose');
const bodyparser = require("body-parser");   
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");

const AuthRoute = require('./routes/auth')


////////////////////  MongoDB Connection ////////////////////////
mongoose.connect('mongodb://localhost:27017/LoginDB', {useNewUrlParser: true, useUnifiedTopology: true}, (err) =>{
    if (!err) {
       console.log("MongoDB connection success"); 
    }else{
        console.log("Error in DB Connection: " + err);
    }
});
//////////////////////////////////////////////////////////////////

const app = express();
app.use(express.static(`${__dirname}/public`))
//   app.use(express.static('public'))
//   app.use('/', express.static(path.join(__dirname, 'public')))


//////////// Bodyparser middleware //////////////
//app.use(bodyParser.json());
app.use(bodyparser.urlencoded({ extended: true })); 
// bodyparser is now added to express, no need to install as seperate dependency    
/////////////////////////////////////////////////

///// EJS  SETUP  ///////
app.use(expressLayouts);   // expressLayouts should be above view engine
app.set('view engine', 'ejs');
/////////////////////////

///// EXPRESS-SESSION middleware ////
app.use(session({
    secret: 'secret',   // can be anything
    resave: true,
    saveUninitialized: true
}))
///////////////////////////////////////////////

//// FLASH middleware ////
app.use(flash());
//////////////////////////

/////////////// setting Global Variables ///////////////////
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');  // success_msg is the variable name
    res.locals.error_msg = req.flash('error_msg'); 
    next();
});
// flashes after sucessfully registering; can't use dismissible alerts coz you changing pages
// so flash stores it in the session 
///////////////////////////////////////////////////////////



app.use('/users', AuthRoute)   // routes should be after bodyparser middleware or req.body would be undefined



//////////////////// Server start //////////////////
const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{ 
    console.log(`server started on port ${PORT}`); 
});
/////////////////////////////////////////////////////