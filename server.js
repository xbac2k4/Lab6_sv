// require
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const api = require('./routes/api');
const database = require('./config/connect');
const DistributorModel = require('./model/Distributor');
const FruitModel = require('./model/fruits');
var cookieParser = require('cookie-parser');
var path = require('path');

const app = express();
//Tạo port
const PORT = 3000;
// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', api);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// connect db
database.connect();
//Chạy server
app.listen(PORT, () => {
    console.log(`Server is running the port ${PORT}`);
});

app.get('/distributors', async (req, res) => {
    let distributor = await DistributorModel.find().populate();
    console.log(distributor);
    res.send(distributor)
})

app.get('/fruits', async (req, res) => {
    let fruit = await FruitModel.find().populate();
    console.log(fruit);
    res.send(fruit);
})


