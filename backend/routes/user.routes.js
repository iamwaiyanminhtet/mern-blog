import express from "express";
const router = express.Router();

import { updateUserValidation } from "../utils/validationRules.js"
import { verifyUser } from "../utils/verifyUser.js"
import { getUsers , updateUser, deleteUser } from "../controllers/user.controller.js";

router.get('/get-users', verifyUser, getUsers)
router.put('/update/:userId', verifyUser, updateUserValidation, updateUser);
router.delete('/delete/:userId', verifyUser, deleteUser);

export default router;