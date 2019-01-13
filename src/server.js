const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const db = require('./models');

db.sequelize.sync();

const app = express();
const port = process.env.PORT || 8080;

// middleware
app.use(bodyParser());
app.use(morgan('dev'));

app.get('/', async (req, res) => {
    await res.send('Hello world');
});

// routers
app.use('/location', require('./routers/location'));

app.listen(port, () => console.log('listening on port 8080'));
