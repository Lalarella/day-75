const path = require('path');
const express = require('express');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session');

const db = require('./data/database');
const blogRoutes = require('./routes/blog');

const MongoDBStore = mongodbStore(session);

const app = express();

const sessionStore = new MongoDBStore({
    uri: 'mongodb://localhost:27017',
    databaseName: 'website',
    collection: 'sessions'
  });


app.set('view engine', 'ejs');
app.set ('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));




app.get('/', function(req, res) {
    res.render('home');
});

app.get('/signup', function(req, res) {
    res.render('signup');
});

app.get('/login', function(req, res) {
    res.render('login');
});


// app.get('/comment', function(req, res) {
//     res.render('comment');
// });




app.use(blogRoutes);

db.connectToDatabase().then(function () {
    app.listen(3000);
  });
  