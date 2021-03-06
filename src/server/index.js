var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/groupsDB';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

// Produce indentation on json content.
app.set('json spaces', 2)

// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname +'./../../')); //serves the index.html

var groups = require('./groups.js');
app.use('/api/groups', groups);

var path = require('path');
app.use(express.static(__dirname + '/public'));
app.use('/SubGroupScheme',express.static(__dirname + '/public/images/SubGroupScheme'));

app.listen(3000); //listens on port 3000 -> http://localhost:3000/