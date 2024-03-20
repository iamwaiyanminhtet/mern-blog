import Category from "../models/category.model.js";
import Blog from "../models/blog.model.js"
import { errorHandler } from "../utils/custom-error.js"

export const createCategory = async (req, res, next) => {
    if(!req.user.isAdmin) {
        next(errorHandler(403, "You are not allowed to make this request"));
    }

    try {
        await Category.create({
            category : req.body.category
        })
    
        res.status(200).json({message : "New category has created."})   
    } catch (error) {
        next(error)
    }
}

export const createBlog = async (req, res, next) => {
    if(!req.user.isAdmin) {
        next(errorHandler(403, "You are not allowed to make this request"));
    }

    const {title, content, category, userId} = req.body

    // check if inputs are empty
    if(!title || title === '' || !content || content === '' || !category || category === '' || !userId || userId === '') {
        return next(errorHandler(400, "All Fileds are required!"));
    }

    // validate create blog data with express-validator
    const validationError = validationResult(req);
    if(!validationError.isEmpty()) {
        next(errorHandler(400, validationError.errors[0].msg));
    }

    try {
        const blog = await Blog.create({ title, content, category, userId })

        res.status(200).json({blog})

    } catch (error) {
        next(error)
    }
}