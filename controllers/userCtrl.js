const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const doctorModel = require('../models/doctorModel')
const appointmentModel = require('../models/appointmentModel');
const moment = require('moment');
// Register controller
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({ message: 'User already exists', success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Registration successful", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: `Register Controller ${error.message}` });
  }
};

// Login controller
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
      res.status(200).send({ message: `login failed`, success: false })
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) res.status(200).send({ message: `email id or password is incurrect`, success: false })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.status(200).send({ message: `login successful`, success: true, token })

  } catch (error) {
   
      res.status(500).send({ message: `Login controller ${error.message}`, success: false })
  }
};

//authController

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
  
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};


//apply doctor contl
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" })
    await newDoctor.save()
    const adminUser = await userModel.findOne({ isAdmin: true })
    const notification = adminUser.notification
    notification.push({
      type: 'apply-doctor-request',
      message: `${newDoctor.firstName}${newDoctor.lastName} Hash Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onclickPath: '/admin/doctors'
      }
    })
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: 'Doctor Account  applied Successfully'
    })

  } catch (error) {
   
    res.status(5000).send({
      success: false,
      error,
      message: "error while applying for doctor"
    })
  }
}

//notification controller
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId })
    const seennotification = user.seennotification
    const notification = user.notification
    seennotification.push(...notification)
    user.notification = []
    user.seennotification = notification
    const updateUser = await user.save()
    res.status(200).send({
      success: true,
      message: 'all notification marked as read',
      data: updateUser
    })

  } catch (error) {
   
      res.status(500).send({
        message: 'error in notification',
        success: false,
        error
      })
  }

}
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId })
    user.seennotification = [];
    const updateUser = await user.save();
    updateUser.password = undefined;
    res.status(200).send({
      success: true,
      message: 'deleted successfully',
      data: updateUser
    })
  } catch (error) {

      res.status(500).send({
        message: 'error in notification',
        success: false,
        error
      })
  }
}

const getAllDoctorController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approve" });
    res.status(200).send({
      success: true,
      message: "Doctor lists fetched successfully",
      data: doctors
    })
  } catch (error) {
   
    res.status(500).send({
      success: false,
      message: "error in getting doc detail",
      error

    })
  }
}

const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, 'DD-MM-YY').toISOString();
    req.body.time = moment(req.body.time, 'HH:mm').toISOString();
    req.body.status = 'pending'
    const newAppointment = new appointmentModel(req.body)
    await newAppointment.save()
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId })
    user.notification.push({
      type: 'new-Appointment-request',
      message: `a new appointment request from ${req.body.userInfo.name}`,
      onClickPath: '/user/appointments'
    })
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Book Successfully",
      data: newAppointment
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in getting doc detail",
      error

    })
  }
}

const bookingAvailabiltyController = async (req, res) => {
  try {
    const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
    const fromTime = moment(req.body.time, 'HH-mm').subtract(1, 'hours').toISOString();
    const toTime = moment(req.body.time, 'HH-mm').add(1, 'hours').toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime, $lte: toTime
      }
    })
    if (appointments.length > 0) {
      return res.status(200).send({
        message: 'appointments not available at this time',
        success: true
      });
    } else {
      return res.status(200).send({
        message: 'appointment available at this time',
        success: true,
      })
    }
  } catch (error) {
   
    res.status(500).send({
      success: false,
      message: "error in booking detail",
      error

    })
  }
}
const userAppointmentController=async(req,res)=>{
try {
  const appointments = await appointmentModel.find({userId:req.body.userId})
  res.status(200).send({
    success:true,
    message:"user appointment fetch succesfully",
data:appointments
  })
} catch (error) {
 
    res.status(500).send({
      success: false,
      message: "error in user appointment detail",
      error

    })
}
}

module.exports = { userAppointmentController,loginController, registerController, authController, applyDoctorController, getAllNotificationController, deleteAllNotificationController, getAllDoctorController, bookAppointmentController, bookingAvailabiltyController };
