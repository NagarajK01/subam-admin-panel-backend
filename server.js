const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const DBURL = 'mongodb://127.0.0.1/nagu-tech';
const LOCAL_ADDRESS = 'localhost';
const PORT = 5500;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(DBURL, {
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.use(cors());
app.use("/api/v1/category", require("./api/category"));
app.use("/api/v1/product", require("./api/product"));
app.use('/api/v1/authentication', require('./api/authentication'));

app.listen(PORT, LOCAL_ADDRESS, () => {
    console.log(`Server running at http://${LOCAL_ADDRESS}:${PORT}/`);
});