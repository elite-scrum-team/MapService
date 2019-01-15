const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');

const db = require('./models');

db.sequelize.sync({ alter: true }).then(() => {
    db.municipality.create();
});
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// middleware
app.use(bodyParser());
app.use(morgan('dev'));

app.get('/', async (req, res) => {
    await res.send('Hello world');
});

// routers
app.use('/api/v1/location', require('./routers/location'));

app.listen(port, () => console.log(`Listening to port ${port}`));
