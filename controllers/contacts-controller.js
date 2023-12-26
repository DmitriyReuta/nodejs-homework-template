import Contact from "../models/Contacts.js";

// import * as contactService from "../models/contacts/index.js";

import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import { contactUpdateSchema } from "../schemas/contact-schemas.js";

const getAll = async (req, res) => {
    const result = await Contact.find({}, "-createdAt -updatedAt");

    res.json(result);
}

const getById = async (req, res) => {
        const { id } = req.params;
        const result = await Contact.findById(id);
        if (!result) {
            throw HttpError(404, `Not found`);
        }

        res.json(result);
}


const add = async (req, res) => {
     try {
        const { error } = contactAddSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
       const { name, email, phone } = req.body;
   const result = await Contact.create(name, email, phone);

         res.status(201).json(result)
          }
    catch (error) {
        next(error);
    }
}



const updateById = async (req, res) => {
    
        const { id } = req.params;
        const result = await Contact.findByIdAndUpdate(id, req.body);
        if (!result) {
            throw HttpError(404, `Not found`);
        }

        res.json(result);
}

const updateStatusContact = async (id, body) => {
    try {
        const { error } = contactUpdateSchema.validate(body);
        if (error) {
            throw HttpError(400, "missing field favorite");
        }

        const contact = await Contact.findByIdAndUpdate(id, { favorite: body.favorite });

        if (!contact) {
            throw HttpError(404, "Not found");
        }

        return contact;
    } catch (error) {
        throw error;
    }
};

const updateFavoriteById = async (req, res) => {
     try {
        const { id } = req.params;
        const result = await updateStatusContact(id, req.body);
        res.json(result);
    } catch (error) {
        if (error.statusCode === 400) {
            res.status(400).json({ message: "missing field favorite" });
        } else if (error.statusCode === 404) {
            res.status(404).json({ message: "Not found" });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

const deleteById = async (req, res) => {

        const { id } = req.params;
        const result = await Contact.findByIdAndDelete(id);
        if (!result) {
            throw HttpError(404, `Not found`);
        }

        res.json({
            message: "contact deleted"
        })
}

export default {
   getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    updateFavoriteById: ctrlWrapper(updateFavoriteById),
    deleteById: ctrlWrapper(deleteById),
}