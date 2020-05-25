//env
require('dotenv').config()

// express
const express = require('express');
const app = express();

// controllers
const log = require('./controllers/logcontroller');
const user = require('./controllers/usercontroller');

// database
const sequelize = require('./db');
sequelize.sync();
app.use(express.json());

// middleware
app.use(require('./middleware/headers'));

// listen
app.listen(process.env.PORT, () => console.log(`app is listening on ${process.env.PORT}`));

// routes
app.use('/api', user);
app.use(require('./middleware/validate-session'));
app.use('/api', log);