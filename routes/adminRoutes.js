const express = require('express');
const { getAllDoctorController ,getAllUserController,changeAccountStatusController} = require('../controllers/adminCtrl');
const authMiddleware = require('../middleware/authMiddleware');

//router object
const router =express.Router();


//getAllUser
router.get('/getAllUsers',authMiddleware,getAllUserController)

//getAlldoctor
router.get('/getAllDoctors',authMiddleware,getAllDoctorController)

//status aproval
router.post('/chageAccountStatus',authMiddleware,changeAccountStatusController)

//export
module.exports = router;