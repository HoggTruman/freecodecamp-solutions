require('dotenv').config();
const bodyParser = require('body-parser');

let express = require('express');
let app = express();

// route handler?
function welcome(req, res) {
    const absolutePath = __dirname + '/views/index.html';
    res.sendFile(absolutePath);
}

function giveJSON(req, res) {
    const responseObject = {
        "message": "Hello json"
    };

    if (process.env.MESSAGE_STYLE === 'uppercase') {
        responseObject.message = responseObject.message.toUpperCase();
    }

    res.json(responseObject);
}

function giveTime(req, res) {
    const responseObject = {
        time: req.time
    };
    res.json(responseObject)
}

function echo(req, res) {
    const responseObject = {
        echo: req.params.word
    };
    res.json(responseObject);
}

function name(req, res) {
    const responseObject = {
        name: `${req.body.first} ${req.body.last}`
    };
    res.json(responseObject);
}


// middleware
function middleware(req, res, next) {
    const toLog = `${req.method} ${req.path} - ${req.ip}`;
    console.log(toLog);
    next();
}

function timeMiddleWare(req, res, next) {
    req.time = new Date().toString();
    next();
}


app.use('/public', express.static(__dirname + '/public'));
app.use('/', middleware);
app.use(bodyParser.urlencoded({extended: false}));

// routes
app.get('/', welcome);
app.get('/json', giveJSON);
app.get('/now', timeMiddleWare, giveTime);
app.get('/:word/echo', echo);
app.post('/name', name)





































 module.exports = app;
