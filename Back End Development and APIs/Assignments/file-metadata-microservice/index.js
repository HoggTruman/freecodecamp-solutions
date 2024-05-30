var express = require('express');
var cors = require('cors');
const multer = require('multer');
require('dotenv').config();


// setup
var app = express();



// middleware
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
const upload = multer({dest: 'uploads/'});



// route handlers
function fileAnalyse(req, res) {
  responseObject = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  }
  res.json(responseObject)
}


// routes
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), fileAnalyse)




const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
