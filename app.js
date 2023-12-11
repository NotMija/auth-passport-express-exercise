const express = require("express");
const app = express();
const PORT = 3000;
const morgan = require("morgan");
const passport = require('passport');
const { create } = require('express-handlebars');
const session = require('express-session');
const hbs = create({
  extname: 'hbs',
  defaultLayout: 'main',
  partialsDir: 'views/partials',
  helpers: require('./utils/helpers')
});

app.use(session({
  secret: 'tu_clave_secreta',
  resave: false,
  saveUninitialized: false
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(passport.initialize());
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(passport.session());

require('./config/passport');


const router = require('./routes');
const isAuthenticated = require("./middleware/isAuthenticated");

app.use('/', router);

const bodyParser = require('body-parser');

// ...

// Actualiza la línea de uso de body-parser
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', isAuthenticated, (req, res) => {
  const skins = [
    { name: 'Red', value: 'red', userId: 1 },
    { name: 'Blue', value: 'blue', userId: 2 },
    { name: 'Green', value: 'green', userId: req.user.id },
    { name: 'Yellow', value: 'yellow', userId: 3 },
    { name: 'Purple', value: 'purple', userId: req.user.id },
  ]
  console.log(req.user);
  res.render('profile', { user: req.user, skins });
});

app.get("/health", (req, res) => {
  res.send("Servidor corriendo correctamente");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});