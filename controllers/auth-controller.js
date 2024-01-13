import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import fs from "fs/promises"
import path from "path";
import { HttpError } from "../helpers/index.js";
import { userLoginSchema } from "../models/User.js";
import { ctrlWrapper } from "../decorators/index.js";
import gravatar from "gravatar";
import Jimp from "jimp";

const { JWT_SECRET } = process.env;
const postersPath = path.resolve("public", "avatars")
const register = async(req, res)=> {
    const {email, password, subscription} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({...req.body, avatarURL, password: hashPassword});

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

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(postersPath, filename);
  const image = await Jimp.read(tempUpload);
  await image.resize(250, 250).write(tempUpload);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}