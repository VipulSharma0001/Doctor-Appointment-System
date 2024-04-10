
const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path')
// Config
require('dotenv').config();


//connect db

connectDB();

// Rest object
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev')); // Use 'dev' format for morgan

// Routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

//static file
app.get(express.static(path.join(__dirname,'./client/build')))

app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,"./client/build/index.html"));
});

// Port
const port = process.env.PORT || 8080;

// App listens on PORT
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_MODE} mode on PORT ${process.env.PORT}`.bgCyan.bgWhite);
});
