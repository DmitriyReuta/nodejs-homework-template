import Contact from "../models/Contacts.js";

// import * as contactService from "../models/contacts/index.js";

import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import { contactUpdateSchema } from "../schemas/contact-schemas.js";

const getAll = async (req, res) => {
     const {_id: owner} = req.user;
    const { page = 1, limit = 10, favorite } = req.query;
    const skip = (page - 1) * limit;
    const filter = favorite ? { favorite: true } : {};

    const result = await Contact.find({ owner }, filter)
            .skip(skip)
            .limit(limit);

        res.json(result);
};

const getById = async (req, res) => {
    const { id: _id } = req.params;
    const {_id: owner} = req.user;
    const result =  await Contact.findById({_id, owner});
    if (!result) {
        throw HttpError(404, `Not found`);
    }

    res.json(result);
}


const add = async (req, res) => {
    const {_id: owner} = req.user;
    const result = await Contact.create({...req.body, owner});
    res.status(201).json(result);
};



const updateById = async (req, res) => {
    const { id: _id } = req.params;
    const {_id: owner} = req.user;
    const result = await Contact.findByIdAndUpdate({_id, owner}, req.body);
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
        const { id: _id } = req.params;
        const {_id: owner} = req.user;
        const result = await updateStatusContact({_id, owner}, req.body);
        res.json(result);
    } catch (error) {
        if (error.status === 400) {
            res.status(400).json({ message: "missing field favorite" });
        } else if (error.status === 404) {
            res.status(404).json({ message: "Not found" });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

const deleteById = async (req, res) => {
        const { id: _id } = req.params;
        const {_id: owner} = req.user;
    const result = await Contact.findByIdAndDelete({_id, owner});
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