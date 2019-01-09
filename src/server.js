
const express = require('express');
const db = require('./models');

db.sequelize.sync();

const app = express();

app.get('/', async (req, res) => {
    await res.send('Hello world11');
});

app.listen(8080, () => console.log('listening on port 8080'));
