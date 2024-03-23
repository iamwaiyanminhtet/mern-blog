import { isValidObjectId } from "mongoose";
import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/custom-error.js"
import { validationResult } from "express-validator"
import mongoose from "mongoose";

export const createComment = async (req, res, next) => {
    if (!req.user) {
        return next(errorHandler(403, "You are not allowed to comment on this post"))
    }


    if (!req.body.comment) {
        return next(errorHandler(400, "All fileds are required."))
    }


    // validate signup data with express-validator
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        return next(errorHandler(400, validationError.errors[0].msg));
    }

    try {
        if (req.params.isReply === "false") {
            const newComment = await Comment.create({
                comment: req.body.comment,
                userId: req.params.userId,
                blogId: req.params.blogId
            })

            const comment = await Comment.findById(newComment._id).populate(['userId'])
            return res.status(200).json(comment)
        }

        if (req.params.isReply === "true") {
            const parentComment = await Comment.findById(req.params.parentCommentId)

            // create a new comment
            const newComment = await Comment.create({
                comment: req.body.comment,
                userId: req.params.userId,
                blogId: req.params.blogId,
                isReply: true,
                parentCommentId: req.params.parentCommentId
            })

            // save reply id to parent comment
            parentComment.replies.push(newComment._id)
            await parentComment.save();

            const comments = await Comment.find({ blogId: req.params.blogId }).populate(['userId', {
                path: "replies",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "userId",
                    model: "User"
                }
            }]).sort({ createdAt: -1 })
            return res.status(200).json(comments)
        }
    } catch (error) {
        next(error)
    }
}

export const getComment = async (req, res, next) => {
    try {
        const comments = await Comment.find({ blogId: req.params.blogId }).populate(['userId', {
            path: "replies",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "userId",
                model: "User"
            }
        }]).sort({ createdAt: -1 })
        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}

export const updateComment = async (req, res, next) => {

    if (!req.user) {
        return next(errorHandler(403, "You are not allowed to update this comment"))
    }

    try {
        const comment = await Comment.find({ _id: req.params.commentId });
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }

        if (req.user.isAdmin || comment.userId === new mongoose.Types.ObjectId(req.params.userId)) {
            const editedComment = await Comment.findByIdAndUpdate(
                req.params.commentId,
                {
                    $set: {
                        comment: req.body.comment,
                    }
                },
                { new: true }
            );
            // normal comment update
            if (req.params.isReply === "false") {
                return res.status(200).json(editedComment);
            }

            // reply comment update
            if (req.params.isReply === "true") {
                const comment = await Comment.find({ parentCommentId: editedComment.parentCommentId }).populate(['userId', {
                    path: "replies",
                    options: { sort: { createdAt: -1 } },
                    populate: {
                        path: "userId",
                        model: "User"
                    }
                }]).sort({ createdAt: -1 })
                res.status(200).json(comment)
            }
        } else {
            return next(
                errorHandler(403, 'You are not allowed to edit this comment')
            );
        }
    } catch (error) {
        next(error);
    }
}

export const likeComment = async (req, res, next) => {
    if (!req.user) {
        return next(errorHandler(403, "You are not allowed to like this post"))
    }

    try {
        const comment = await Comment.findById(req.params.commentId).populate('userId');

        if (!comment) {
            return next(errorHandler(404, "Comment Not Found"));
        }

        const userIndex = comment.likes.indexOf(req.params.userId);

        if (userIndex === -1) {
            comment.likes.push(req.user.id)
        } else {
            comment.likes.splice(userIndex, 1)
        }

        await comment.save();
        res.status(200).json(comment);

    } catch (error) {
        next(error)
    }
}