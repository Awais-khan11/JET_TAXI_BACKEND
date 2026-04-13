import { Router } from 'express';
import { sendMailCode, sendBookingConfirmation } from '../controllers/email.controllers';

const router = Router();

router.post("/send-code", sendMailCode);
router.post("/confirm-booking", sendBookingConfirmation);

export default router;
