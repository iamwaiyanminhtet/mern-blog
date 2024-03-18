import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/custom-error.js";
import { sendBackUserData } from "../utils/send-back-user-data.js";
import bcryptjs from "bcryptjs";


export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'));
    }

    const { username, email, password, pfp } = req.body;

    const curUser = await User.findOne({_id : req.params.userId})

    if(username === curUser.username || email === curUser.email) {
        return next(errorHandler(404, 'No Change has made.'));
    }

    // validate signup data with express-validator
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        next(errorHandler(400, validationError.errors[0].msg));
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    pfp: req.body.pfp,
                }
            }, { new: true }
        )
        const { password:pass, ...user } = updatedUser._doc
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}