import { Router } from "express";
import { activeAndDeactiveContact, contactList, deleteContact } from "../../admin/controllers/adminContactController";
import auth from "../../admin/middelware/admin_auth";

const router = Router();

router.get('/contact-list', auth, contactList);
router.get('/update-status-contact', auth, activeAndDeactiveContact);
router.get('/delete-contact/:id', auth, deleteContact);


export default router;