const mongoose = require('mongoose');

function connectToDatabase() {
  mongoose.connect(process.env.MONGO_URI, {
    dbname: 'issue-tracker',
  })
  .then(() => {
    console.log('Connected to the Database.');
  })
  .catch(err => console.error(err));
}

module.exports = connectToDatabase;