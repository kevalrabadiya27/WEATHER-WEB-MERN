const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();
const DB = process.env.DB;

mongoose.connect(DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Connection sucessfully 😊😊😊");
    }).catch((err) => {
        console.log(err);
    })


