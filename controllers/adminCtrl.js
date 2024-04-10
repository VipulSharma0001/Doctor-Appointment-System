const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel')

const getAllUserController = async (req, res) => {
    try {
        const users = await userModel.find({isDoctor:false});
        res.status(200).send({
            success: true,
            message: 'users data',
            data: users,
        });
    } catch (error) {
       
        res.status(500).send({
            success: false,
            message: 'error while fetching users',
            error
        });
    }
};

const getAllDoctorController = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        res.status(200).send({
            success: true,
            message: 'doctors data',
            data: doctors,
        });
    } catch (error) {
       
        res.status(500).send({
            success: false,
            message: 'error while fetching doctors',
            error
        });
    }
};
const changeAccountStatusController = async (req, res) => {
    try {
        const { doctorId, status } = req.body; // Change 'res' to 'req'
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
        const user = await userModel.findOne({ _id: doctor.userId });
        const notification = user.notification;
        notification.push({
            type: 'doctor-account-request-update',
            message: `Your doctor account request has been ${status}`,
            onClickPath: '/notification'
        });
        user.isDoctor = status === 'approve' ? true : false; // Corrected assignment
        await user.save();
        res.status(201).send({
            success: true,
            message: 'Account status updated',
            data: doctor
        });
    } catch (error) {
        
        res.status(500).send({
            success: false,
            message: "Approval failed",
            error
        });
    }
};

module.exports = { getAllDoctorController, getAllUserController,changeAccountStatusController };
