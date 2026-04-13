const express = require('express');
const {sendMailCode,sendBookingConfirmation } = require('../controllers/email.controllers');

const router = express.Router();


router.post("/send-code", sendMailCode);
router.post("/confirm-booking", sendBookingConfirmation);





module.exports = router;