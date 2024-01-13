import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";
import { HttpError } from "../helpers/index.js";

const destination = path.resolve("temp")

const storage = multer.diskStorage({
    destination,
    filename: (req, file, callback) => {
        // const uniquePreffix = nanoid()
        // const fileName = `${uniquePreffix}_${file.originalname}`;
        callback(null, file.originalname)
    }
})

const fileFilter = (req, file, callback) => {
    const extention = req.originalname.split(".").pop()
    if (extention === "exe") {
        callback(HttpError(400, ".exe not valid extantion"))
    }
}

const upload = multer({
    storage
    // fileFilter
})

export default upload