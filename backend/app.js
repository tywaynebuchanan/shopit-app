const express = require('express');
const app = express();
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoutes");
const orderRoute = require("./routes/orderRoute");
const DB = require('../backend/database/dbconfig');
var cookieParser = require('cookie-parser')
const AppErrorMiddleware = require('./middleware/errors');

app.use(express.json());
app.use(cookieParser());

//Database Connection 
DB.on('error', (err)=>{
    console.log(err)
})

DB.once('open',()=>{
    console.log("DB connected success");
})



app.get("/",(req,res)=>{
    res.status(200).send("This is the home route");
})

//Routes
app.use("/api/v1",productRoute);
app.use("/api/v1",userRoute);
app.use("/api/v1",orderRoute);

//Middleware to handle errors
app.use(AppErrorMiddleware);

module.exports = app;