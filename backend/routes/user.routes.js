import express from "express";
const router = express.Router();

import { updateUserValidation } from "../utils/validationRules.js"
import { verifyUser } from "../utils/verifyUser.js"
import { updateUser } from "../controllers/user.controller.js";

router.put('/update/:userId', verifyUser, updateUserValidation, updateUser);

export default router;