import express from "express";
const router = express.Router();

import { createCategory, createBlog, getCategories, getBlogs } from "../controllers/blog.controller.js"
import { verifyUser } from "../utils/verifyUser.js"
import { createBlogValidation } from "../utils/validationRules.js"

router.post('/create-category', verifyUser, createCategory )
router.get('/getCategories', verifyUser, getCategories)

router.post('/create-blog', verifyUser, createBlogValidation, createBlog)
router.get('/get-blogs', getBlogs)

export default router;