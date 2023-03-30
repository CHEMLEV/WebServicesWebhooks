const express = require('express');
const app = express();

app.use(require('express').json());

app.listen(3000, ()=> {
    console.log("Server listening at port 3000")
});

app.get('/home', (req, res) => {
  res.sendFile(`${__dirname}/home.html`);
});

app.use(express.json());

require("dotenv").config();

const mongoose = require('mongoose');
const mongoDataBase = process.env.DATABASE_URL;

mongoose.connect(mongoDataBase, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log('Error connecting to MongoDB:', error.message);
});

const routes = require('./routes/controller.js');
app.use('/', routes);