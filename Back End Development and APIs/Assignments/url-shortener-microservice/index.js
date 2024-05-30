require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const dns = require('dns');


const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const urlStoreLoc = './urlStore.json'


// middleware
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(`${process.cwd()}/public`));



// path handlers
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
app.get('/api/shorturl/:short_url?', function(req, res) {
  const urlStore = require(urlStoreLoc);

  if (Object.values(urlStore).includes(req.params.short_url)) {
    const redirect_url = Object.keys(urlStore).find(key => urlStore[key].toString() === req.params.short_url)
    console.log(redirect_url)
    res.redirect(redirect_url);
  } 
  res.json({ error: 'invalid url' })
});

app.post('/api/shorturl', urlShorten);


// callbacks
async function urlShorten(req, res) {
  const urlStore = require(urlStoreLoc);
  const responseObject = {};

  if(isValidURL(req.body.url) === false) {
    res.json({ error: 'invalid url' });
    return;
  }
  

  if (!Object.keys(urlStore).includes(req.body.url)) {
    // find new shortened url and update json file
    const short_url = Object.keys(urlStore).length.toString();
    urlStore[req.body.url] = short_url;
    fs.writeFileSync(urlStoreLoc, JSON.stringify(urlStore, null, 2));
  }

  //update response object
  responseObject['original_url'] = req.body.url;
  responseObject['short_url'] = urlStore[req.body.url];

  res.json(responseObject);
}

// validate url
function isValidURL(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:"
    
  }
  catch (err) {
    console.error(err);
    return false;
  }
}

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
