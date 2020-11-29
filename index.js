const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const config = require('./config/db');
const accountRoutes = require('./routes/account');

const app = express();

const port = 3000;

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => console.log('Database connection established'));
mongoose.connection.on('error', (err) => console.log(`No database connection established, error: ${err}`));

app.get('/', (req, res) => {
  res.send('Index Page');
});

app.use('/account', accountRoutes);

app.listen(port, () => console.log(`Server started on port: ${port}`));