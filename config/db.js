const mongoose = require('mongoose');
const color = require('colors');


const connectDB = async()=>{
try{
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`mongoose connected ${mongoose.connection.host}`.bgGreen.white);
}catch(error){
    console.log(`mongoose connection error ${error}`.bgMagenta.red);
}
}

module.exports= connectDB;