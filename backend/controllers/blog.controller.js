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

export const getBlogs = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex || 0)
        const limit = parseInt(req.query.limit || 5)
        const sorting = req.query.sorting === "asc" ? 1 : -1;

        const blogs = await Blog.find({
            ...(req.query.userId && { userId : req.query.userId }),
            ...(req.query.categoryId && { category : req.query.categoryId }),
            ...(req.query.blogId && { _id : req.query.blogId }),
            ...(req.query.slug && { slug : req.query.slug }),
            ...(req.query.searchTerm && {
                $or : [
                    {title : {$regex : req.query.searchTerm, $options : "i"}},
                    {content : {$regex : req.query.searchTerm, $options : "i"}},
                ]
            }),
        }).sort({updatedAt : sorting}).skip(startIndex).limit(limit).populate(['userId', 'categoryId']);

        const totalBlogs = await Blog.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
          );
      
        const lastMonthBlogs = await Blog.countDocuments({createdAt : { $gte : oneMonthAgo }})

        res.status(200).json({
            blogs,
            totalBlogs,
            lastMonthBlogs,
        })
    } catch (error) {
        next(error)
    }
}

export const updateBlog = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to update this blog'));
    }

    const {title, content, categoryId, image} = req.body

    const curBlog = await Blog.findOne({_id : req.params.blogId})

    if(title === curBlog.title && content === curBlog.content && categoryId === curBlog.categoryId) {
        return next(errorHandler(400, 'No Change has made.'));
    }

    // validate signup data with express-validator
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        next(errorHandler(400, validationError.errors[0].msg));
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.blogId,
            {
                $set: {
                    title,
                    content,
                    categoryId,
                    image,
                }
            }, { new: true }
        )
        res.status(200).json(updatedBlog);
    } catch (error) {
        next(error)
    }
}