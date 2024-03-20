import express from "express";
const router = express.Router();

import { createCategory, createBlog, getCategories } from "../controllers/blog.controller.js"
import { verifyUser } from "../utils/verifyUser.js"
import { createBlogValidation } from "../utils/validationRules.js"

router.post('/create-category', verifyUser, createCategory )
router.get('/getCategories', verifyUser, getCategories)
router.post('/create-blog', verifyUser, createBlogValidation, createBlog)

export default router;