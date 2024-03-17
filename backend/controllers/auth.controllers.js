import { validationResult } from "express-validator";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { errorHandler } from "../utils/custom-error.js";

dotenv.config();

export const signUp = async (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;

    // check if inputs are empty
    if(!username || username === '' || !email || email === '' || !password || password === '' || !confirmPassword || confirmPassword === '') {
        return next(errorHandler(400, "All Fileds are required!"));
    }

    // validate signup data with express-validator
    const validationError = validationResult(req);
    if(!validationError.isEmpty()) {
        next(errorHandler(400, validationError.errors[0].msg));
    }

    // create user in db
    try {
        const hashPassword = bcryptjs.hashSync(password, 10);

        await User.create({
            username,
            email : email.toLowerCase(),
            password : hashPassword 
        });

        res.status(200).json({message : "Sign up successfully"});
    } catch (error) {
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    // check if inputs are empty
    if(!email || email === '' || !password || password === '') {
        return res.json({message : "All Fields are required"});
    }

    // validate signin data with express-validator
    const validationError = validationResult(req);
    if(!validationError.isEmpty()) {
        next(errorHandler(400, validationError.errors[0].msg));
    }

    try {
        // check if user is in db
        const isUser = await User.findOne({ email : email.toLowerCase() });
        if(!isUser) {
            return next(errorHandler(400, 'Wrong Credentials'));
        }

        // check password
        const validPassword = bcryptjs.compareSync(password, isUser.password)
        if(!validPassword) {
            return next(errorHandler(400, 'Wrong Credentials'));
        }

        // create jwt token
        const token = jwt.sign({id : isUser._id, isAdmin : isUser.isAdmin}, process.env.JWT_SECRET_KEY)

        // remove password
        const { password:pass , ...user } = isUser._doc;

        res.status(200).cookie('access_token', token, {httpOnly : true}).json(user);

    } catch (error) {
        next(error);
    }
}