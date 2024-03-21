import express from "express";
const router = express.Router();

import { createCategory, createBlog, getCategories, getBlogs, updateBlog } from "../controllers/blog.controller.js"
import { verifyUser } from "../utils/verifyUser.js"
import { createBlogValidation, updateBlogValidation } from "../utils/validationRules.js"

router.post('/create-category', verifyUser, createCategory )
router.get('/getCategories', verifyUser, getCategories)

router.post('/create-blog', verifyUser, createBlogValidation, createBlog)
router.get('/get-blogs', getBlogs)
router.put('/update/:blogId', verifyUser, updateBlogValidation, updateBlog )

export default router;