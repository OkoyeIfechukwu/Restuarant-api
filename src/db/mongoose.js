const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const connectToDatabase = () => {
    mongoose.connect(process.env.MongoDb_Connection_Url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    });

    console.log('Database connected successfully');

    mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
};


module.exports= connectToDatabase;
