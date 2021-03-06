const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const morgan = require('morgan')
var cors = require('cors')
const app = express();
const path = require('path')

//setup logger
app.use(morgan('dev'))

//using cors
app.use(cors())

//connecting with DB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
app.use(express.json());
db.once('open', () => console.log('connected to database'));
//creating routes
const teamsRouter = require('./routes/teams');
const homeRouter = require('./routes/home');
const subscriptionRouter = require('./routes/subscriptions');
const logoRouter = require('./routes/logos');

app.use('/api/teams', teamsRouter);
app.use('/api/home', homeRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/logos', logoRouter);

app.get('/', (req, res, next) => res.sendFile(path.join(__dirname, 'index.html')));
//serve images from public/assets
app.use('/assets', express.static('./public/assets/'));

// app.use(express.static('npateams/build'));
app.use('/*', (req, res) => {
    res.status(404).send('<h1>NOT FOUND</h1>')
})

//server listen on port
const PORT = process.env.PORT || 5000;
// const PORT = process.env.PORT || config.httpPort;

app.listen(PORT, () => console.log(`Your server is running on: http://localhost:${PORT}/`));