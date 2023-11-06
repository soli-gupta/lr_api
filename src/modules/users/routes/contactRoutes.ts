
import { Router } from "express";
import { contactsValidation } from "../../admin/validation/contactValidation";
import { createContact } from "../controllers/ContactController";
const router = Router()

router.post('/contact', createContact);

export default router