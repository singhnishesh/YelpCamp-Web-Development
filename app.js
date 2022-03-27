if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const userRoutes = require('./routes/users')
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");
const User = require("./models/user");
const MongoDBStore = require("connect-mongo");

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')));

const secret = 'thisshouldbeabettersecret!';

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    secret:'thisshouldbeabettersecret!',
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}

app.use(session(sessionConfig))
app.use(flash()); 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res)=>{
    res.render('home')
})

app.use((err, req, res, next) => {
    console.log(err)
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.all('*', (req, res, next) =>{
    next(new ExpressError('Page Not Found', 404))
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})


