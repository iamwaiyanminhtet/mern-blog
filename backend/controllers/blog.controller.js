import Category from "../models/category.model.js";
import Blog from "../models/blog.model.js"
import { errorHandler } from "../utils/custom-error.js"
import { validationResult } from "express-validator"

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

export const getCategories = async (req, res, next) => {
    if(!req.user.isAdmin) {
        next(errorHandler(403, "You are not allowed to make this request"));
    }

    try {
        const categories = await Category.find()
        res.status(200).json(categories)   
    } catch (error) {
        next(error)
    }
}

export const createBlog = async (req, res, next) => {
    if(!req.user.isAdmin) {
        next(errorHandler(403, "You are not allowed to make this request"));
    }

    const {title, content, categoryId, userId, image} = req.body

    // check if inputs are empty
    if(!title || title === '' || !content || content === '' || !categoryId || categoryId === '') {
        return next(errorHandler(400, "All Fileds are required!"));
    }

    // validate create blog data with express-validator
    const validationError = validationResult(req);
    if(!validationError.isEmpty()) {
        next(errorHandler(400, validationError.errors[0].msg));
    }

    try {
        const blog = await Blog.create({ 
            title, 
            content, 
            slug : title.toLowerCase().split(' ').join('-').replace(/[^a-zA-Z0-9-]/g, '') ,
            categoryId, 
            userId,
            image
        })

        res.status(200).json({blog})

    } catch (error) {
        next(error)
    }
}