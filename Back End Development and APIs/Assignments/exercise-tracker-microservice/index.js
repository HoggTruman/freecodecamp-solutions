const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


// setup
const app = express();
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'exercise-tracker'
})
.then(() => {
  console.log('Connected to the Database.');
})
.catch(err => console.error(err));


// Schemas
const userSchema = new mongoose.Schema({
  username: String,
}, {versionKey: false})


const logSchema = new mongoose.Schema({
  username: String,
  _id: String,
  count: Number,
  log: [{
    _id: false,
    description: String,
    duration: Number,
    date: String
  }]
}, {versionKey: false})

let User = mongoose.model('User', userSchema);
let Log = mongoose.model('Log', logSchema);

// middleware
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));


// helper functions
function dateOrNow(date) {
  let dateObject = new Date(date);
  if (dateObject.toString() === "Invalid Date") {
    dateObject = new Date();
  }
  return dateObject.toDateString();
}


// path handlers
async function getAllUsers(req, res) {
  try {
    const userList = await User.find({});
    res.json(userList)
  }
  catch (err) {
    return console.error(err);
  }
}

async function createNewUser(req, res) {
  const user = new User({
    username: req.body.username,
  })

  user.save()
  .then(data => {
    res.json(data.toObject())
  })
  .catch(err => console.error(err));
}

async function addExercise(req, res) {
  // check if user exists
  let user;
  try {
    user = await User.findById(req.params._id);
    if (user) {
      user = user.toObject();
    }
    else {
      console.error("USER NOT FOUND");
      return res.status(400).send("USER NOT FOUND");
    }
  }
  catch (err) {
    return console.error(err);
  }

  // see if user already has a log, create an empty one if not
  let userLog;
  try {
    userLog = await Log.findById(req.params._id);
    userLog ||= new Log({...user});
  }
  catch (err) {
    return console.error(err);
  }

  // update log
  const newExercise = {
    description: req.body.description,
    duration: Number(req.body.duration),
    date: dateOrNow(req.body.date)
  }

  userLog.count = userLog.log.length + 1,
  userLog.log = [...userLog.log, newExercise]


  userLog.save()
  .then(() => {
    res.json({...user, ...newExercise})
  })
  .catch(err => console.error(err))
}

async function getLog(req, res) {
  // query data
  const from = new Date(req.query.from).getTime();
  const to = new Date(req.query.to).getTime();
  const limit = req.query.limit;

  let userLog;
  try {
    userLog = await Log.findById(req.params._id);
    if (userLog) {
      userLog = userLog.toObject();
    }
    else {
      console.error("USERLOG NOT FOUND");
      return res.status(400).send("USERLOG NOT FOUND");
    }
  }
  catch (err) {
    return console.error(err);
  }


  // filter logs
  if (!isNaN(from)) {
    userLog.log = userLog.log.filter((exercise) => {
      const date = new Date(exercise.date).getTime()
      return date >= from;
    })
  }
  if (!isNaN(to)) {
    userLog.log = userLog.log.filter((exercise) => {
      const date = new Date(exercise.date).getTime()
      return date <= to;
    })
  }
  if (limit !== null && limit >= 0) {
    userLog.log = userLog.log.slice(0, limit);
  }

  res.json(userLog)
}

// paths
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.get('/api/users', getAllUsers);
app.get('/api/users/:_id/logs', getLog)

app.post('/api/users', createNewUser);
app.post('/api/users/:_id/exercises', addExercise);



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
