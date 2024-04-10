const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getDoctorInfoController, updateProfileController ,getDoctorByIdController, doctorAppointmentController, updateStausController} = require('../controllers/doctorCtrl');

//router object
const router =express.Router();

//post single doc info
router.post('/getDoctorInfo',authMiddleware,getDoctorInfoController)

//post update profile
router.post('/updateProfile',authMiddleware, updateProfileController)

//post get single doctor id
router.post('/getDoctorById',authMiddleware,getDoctorByIdController);

//get appointment

router.get(`/doctor-appointment`,authMiddleware,doctorAppointmentController)

//post appointment approve

router.post(`/update-Status`,authMiddleware,updateStausController)

module.exports = router;