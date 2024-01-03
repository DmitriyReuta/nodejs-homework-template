import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import User from "../models/User.js";

import { HttpError } from "../helpers/index.js";

import { userLoginSchema } from "../models/User.js";

import { ctrlWrapper } from "../decorators/index.js";

const {JWT_SECRET} = process.env;

const register = async(req, res)=> {
    const {email, password, subscription} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...req.body, password: hashPassword});

   res.status(201).json({
        user: {
            subscription: newUser.subscription,
            email: newUser.email,
        }
    });
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { error } = userLoginSchema.validate({ email, password });
        if (error) {
            throw HttpError(400, error.message);
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw HttpError(401, "Email or password is wrong");
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw HttpError(401, "Email or password is wrong");
        }

        const { _id: id, subscription } = user;

        const payload = {
            id,
            subscription,
        };

         const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
        await User.findByIdAndUpdate(id, { token });

        res.json({
            token,
            user: {
                email,
                subscription,
            },
        });
    } catch (error) {
        next(error);
    }
};


const getCurrent = async(req, res)=> {
    const {subscription, email} = req.user;

    res.json({
        email,
        subscription,
    })
}

const logout = async(req, res)=> {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.status(204).json()
}

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
}