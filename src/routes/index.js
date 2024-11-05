import { Router } from "express";
import {
    greeting,
    generatePaymentLink,
    sendPaymentConfirmation,
    tokenVerify,
} from "../controllers/index.js";

const router = Router();

router.get("/", greeting);
router.post("/crear-link-pago", generatePaymentLink);
router.post("/webhook", sendPaymentConfirmation);
router.get("/descargar/:token", tokenVerify);

export default router;
