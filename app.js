if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const dbURL = process.env.DB_URL //'mongodb://localhost:27017/yelp-camp';
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');


mongoose.connect(dbURL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.use(morgan('dev'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const sessionConfig = {
    name: 'session',
    secret: 'bettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 *24 * 7,
        maxAge: 1000 * 60 * 60 *24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(helmet( {contentSecurityPolicy: false}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // how to store user in session
passport.deserializeUser(User.deserializeUser()); // how to get user out of session

app.use((req, res, next) => {
    console.log(req.query)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error= req.flash('error');
    next()
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'andrew@gmail.com', username: 'andrew' });
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
});


app.get('/', (req, res) => {
    res.render('home');
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.use((req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', { err });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});