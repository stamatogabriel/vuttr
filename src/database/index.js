const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://gabriel:881221@cluster0-8qmsq.mongodb.net/test?retryWrites=true', {useNewUrlParser: true});

mongoose.Promise = global.Promise;

module.exports = mongoose;