import { HttpError } from "../helpers/index.js";

export const isEmptyBody = (req, res, next)=> {
    const {length} = Object.keys(req.body);
    if(!length) {
        return next(HttpError(400, "Body must have fields"));
    }
    next();
}

export const isEmptyFavoriteBody = (req, res, next) => {
    const { length } = Object.keys(req.body);
    if (!length || !req.body.hasOwnProperty('favorite')) {
        return next(HttpError(400, "missing field favorite"));
    }
    next();
};