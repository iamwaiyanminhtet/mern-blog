import express from "express";
const router = express.Router();

import { createCategory, createBlog } from "../controllers/blog.controller.js"
import { verifyUser } from "../utils/verifyUser.js"
import { createBlogValidation } from "../utils/validationRules.js"

router.post('/create-category', verifyUser, createCategory )
router.post('/create-post', verifyUser, createBlogValidation, createBlog)

export default router;