const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const router =  require('./src/routes/routes');

const app = express();
const port = process.env.PORT || 6000;
const connectToDb = require('./src/db/mongoose');


dotenv.config();
connectToDb();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use('/', router);


app.listen(port, () =>{
    console.log(`App running on ${port}`)
})

