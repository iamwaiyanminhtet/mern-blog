import Category from "../models/category.model.js";
import { errorHandler } from "../utils/custom-error.js"

export const createCategory = async (req, res, next) => {
    if (!req.user.isAdmin) {
        next(errorHandler(403, "You are not allowed to make this request"));
    }

    try {
        const category = await Category.create({
            category: req.body.category
        })

        res.status(200).json(category)
    } catch (error) {
        next(error)
    }
}

export const getCategories = async (req, res, next) => {
    if (!req.user.isAdmin) {
        next(errorHandler(403, "You are not allowed to make this request"));
    }

    try {
        const categories = await Category.find()
        res.status(200).json(categories)
    } catch (error) {
        next(error)
    }
}

export const updateCategory = async (req, res, next) => {
    if (!req.user.isAdmin) {
        next(errorHandler(403, "You are not allowed to make this request"));
    }

    try {
        const category = await Category.findByIdAndUpdate(
            req.params.categoryId,
            {
                $set: {
                    category : req.body.category
                }
            }, { new: true }
        )
        res.status(200).json(category)
    } catch (error) {
        next(error)
    }
}

export const deleteCategory = async (req, res, next) => {
    if (!req.user.isAdmin) {
        next(errorHandler(403, "You are not allowed to make this request"));
    }

    try {
        const category = await Category.findByIdAndDelete(req.params.categoryId)
        res.status(200).json(category)
    } catch (error) {
        next(error)
    }
}