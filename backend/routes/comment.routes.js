import express from "express"
import {verifyUser} from "../utils/verifyUser.js"
import { createComment, getComment, updateComment } from "../controllers/comment.controller.js";
import { createCommentValidation, updateCommentValidation } from "../utils/validationRules.js"

const router = express.Router();

router.post('/create-comment/:blogId/:userId', verifyUser, createCommentValidation, createComment)
router.get('/get-comments/:blogId', getComment)
router.put('/update/:commentId/:userId', verifyUser, updateCommentValidation, updateComment )

export default router;