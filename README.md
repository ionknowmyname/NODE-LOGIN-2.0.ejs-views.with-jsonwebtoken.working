using ejs as view engine instead of handlebars

flow goes from Schema/models -> controllers -> routes -> server.js

// can also use promise to write mongoose.connect in server.js

mongoose.connect('mongodb://localhost:27017/LoginDB', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("MongoDB connection success"))
.catch(err => console.log(err))

/// in routes (auth.js), all post request functions are gotten from the controller (authController.js). Could not put get requests in controller because a single url has post & get methods, if I'm exporting the functions from controllers as post, I would have to rename the functions in controller to export for the get, bt in the url in browser, I can't go to 2 different url's
