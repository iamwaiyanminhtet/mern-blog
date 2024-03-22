import express from "express"
import {verifyUser} from "../utils/verifyUser.js"
import { createComment, getComment } from "../controllers/comment.controller.js";
import { createCommentValidation } from "../utils/validationRules.js"

const router = express.Router();

router.post('/create-comment/:blogId/:userId', verifyUser, createCommentValidation, createComment)
router.get('/get-comments/:blogId', getComment)

export default router;