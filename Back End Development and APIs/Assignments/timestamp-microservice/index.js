// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


app.get("/api/:date?", dateHandler);


function dateHandler(req, res) {
  const responseObject = {};
  let date;

  if (isNaN(req.params.date)){
    date = req.params.date? new Date(req.params.date): new Date();
  }
  else {
    date = new Date(Number(req.params.date))
  }

  // handle invalid date
  if (!date instanceof Date || isNaN(date.valueOf())) {
    res.json({error: "Invalid Date"});
  }

  responseObject.unix = date.getTime();
  responseObject.utc = date.toUTCString();

  res.json(responseObject);
}



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
