const express = require('express');
const { loginController, registerController, authController ,applyDoctorController,getAllNotificationController,deleteAllNotificationController,bookingAvailabiltyController ,getAllDoctorController, bookAppointmentController, userAppointmentController} = require('../controllers/userCtrl');
const authMiddleware = require('../middleware/authMiddleware');




const router =  express.Router();

//login router
router.post('/login', loginController);

//register router
router.post('/register', registerController); 

//Auth/post

router.post('/getUserData', authMiddleware, authController)

//Apply Doctor || POST
router.post('/apply-doctor', authMiddleware, applyDoctorController)

//get all notification || POST
router.post('/get-all-notification', authMiddleware, getAllNotificationController)

//delete all notification
router.post('/delete-all-notification',authMiddleware,deleteAllNotificationController)

//get all doc 
router.get('/getAllDoctor',authMiddleware,getAllDoctorController)

//book appointment
router.post('/book-appointment',authMiddleware,bookAppointmentController)
 
//availability cntroller
router.post('/booking-availability',authMiddleware, bookingAvailabiltyController)

//user-appointment
router.get('/user-appointment',authMiddleware,userAppointmentController)

//export
module.exports = router;