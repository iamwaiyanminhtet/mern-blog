import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/custom-error.js"
import { validationResult } from "express-validator"

export const createComment = async (req, res, next) => {
    if(!req.user) {
        return next(errorHandler(403, "You are not allowed to comment on this post"))
    }


    if(!req.body.comment) {
        return next(errorHandler(400, "All fileds are required."))
    }


    // validate signup data with express-validator
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        return next(errorHandler(400, validationError.errors[0].msg));
    }

    try {
        const newComment = await Comment.create({
            comment : req.body.comment,
            userId : req.params.userId,
            blogId : req.params.blogId
        })

        const comment = await Comment.findById(newComment._id).populate(['userId'])
        res.status(200).json(comment)
    } catch (error) {
        next(error)
    }
}

export const getComment = async (req, res, next) => {
    if(!req.user) {
        return next(errorHandler(403, "You are not allowed to comment on this post"))
    }

    try {
        const comments = await Comment.find({blogId : req.params.blogId}).populate(['userId', {
            path : "replies",
            populate : {
                path : "userId",
                model : "User"
            }
        }])
        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}