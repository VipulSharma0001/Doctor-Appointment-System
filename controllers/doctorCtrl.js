const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');

const getDoctorInfoController =async(req,res)=>{
    try {
        const doctor = await doctorModel.findOne({userId:req.body.userId})
        res.status(200).send({
            success:true,
            message:"doctor data fetch success",
            data: doctor
        })
    } catch (error) {
    
        res.status(500).send({
            success:false,
            error,
            message:'error in fetchhing doctors details'
        })
    }

}
const updateProfileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body);
        res.status(200).send({
            success: true,
            message: "Doctor Profile Updated",
            data: doctor
        });
    } catch (error) {
       
        res.status(500).send({ 
            success: false,
            message: "Doctor profile update fail",
            error
        });
    }
};

const getDoctorByIdController =async(req,res)=>{
try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
        res.status(200).send({
            success: true,
            message: "single doc ifo fetched",
            data: doctor
        });
} catch (error) {
   
        res.status(500).send({ 
            success: false,
            message: "error single doctor update fail",
            error
        });
}
}
const doctorAppointmentController=async(req,res)=>{
try {
    const doctor = await doctorModel.findOne({userId:req.body.userId});
    const appointments = await appointmentModel.find({doctorId:doctor._id});
    res.status(200).send({
        success:true,
        message:'doctorAppointment fetch successfullly',
        data:appointments,
    })
} catch (error) {
   
    res.status(500).send({ 
        success: false,
        message: "error single doctor update fail",
        error
    });
}
}
const updateStausController=async(req,res)=>{
    try {
        const {appointmentId, status} = req.body
        const appointments = await appointmentModel.findByIdAndUpdate(appointmentId,{status})
        const user = await userModel.findOne({ _id: appointments.userId })
        notification = user.notification;
        user.notification.push({
            type: 'status-updated',
            message: `updated ${status}`,
            onClickPath: '/doctor-appointments',
          })
          await user.save();
          res.status(200).send({
            success:true,
            message:'Appointment updated'
          })
    } catch (error) {
       
        res.status(500).send({ 
            success: false,
            message: "error single doctor update fail",
            error
        }); 
    }

}

module.exports = {updateStausController,doctorAppointmentController,getDoctorInfoController, updateProfileController, getDoctorByIdController};
