const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    firstName: {
        type: String,
        required: [true, "first name is required"]
    },
    lastName: {
        type: String,
        required: [true, "last nam erequired"]
    },
    phone: {
        type: String,
        required: [true, "phone is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    website:{
        type:String,
    },
    address:{
        type: String,
        required: [true, "Address is required"],
    },
    specialization:{
        type: String,
        required: [true, "specialization is required"],
    },
    experience:{
        type: String,
        required: [true, "experience is required"],
    },
    feesPerCunsaltation:{
        type: Number,
        required: [true, "fee is required"],
    },
    status:{
        type:String,
        default:'pending',
    },
    timing:{
        type: Object,
        required: [true, "fee is required"],
    }
},{timestamps:true}
)


const doctorModel = mongoose.model('doctors', doctorSchema);
module.exports = doctorModel;