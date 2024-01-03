import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/index.js";
import User from "../models/User.js";
import 'dotenv/config';

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const [bearer, token] = authorization.split(" ");
        if (!authorization || !token || bearer !== "Bearer" ) {
            throw HttpError(401, "Not authorized");
        }

        // const [bearer, token] = authorization.split(" ");
        // if (bearer !== "Bearer") {
        //     throw HttpError(401, "Invalid token format");
        // }

        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);

        if (!user || !user.token || token !== user.token) {
            throw HttpError(401, "Unauthorized");
        }

        req.user = user;
        next();
    } catch (error) {
        next(HttpError(401, error.message));
    }
};

export default authenticate;