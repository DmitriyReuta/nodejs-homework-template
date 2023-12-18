import * as contactService from "../models/contacts/index.js";

import { HttpError } from "../helpers/index.js";

import { contactAddSchema, contactUpdateSchema } from "../schemas/contact-schemas.js";

const getAll = async (req, res, next) => {
    try {
        const result = await contactService.listContacts();

        res.json(result);
    }
    catch (error) {
        next(error);
    }
}

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await contactService.getContactById(id);
        if (!result) {
            throw HttpError(404, `Not found`);
        }

        res.json(result);
    }
    catch (error) {
        next(error);
    }
}

const add = async (req, res, next) => {
    try {
        const { error } = contactAddSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error);
        }
         const { name, email, phone } = req.body;

        const result = await contactService.addContact(name, email, phone);
        res.status(201).json(result)
    }
    catch (error) {
        next(error);
    }
}

const updateById = async (req, res, next) => {
    try {
        const { error } = contactUpdateSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error);
        }
        const { id } = req.params;
        const result = await contactService.updateContactById(id, req.body);
        if (!result) {
            throw HttpError(404, `Not found`);
        }

        res.json(result);
    }
    catch (error) {
        next(error);
    }
}

const deleteById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await contactService.removeContact(id);
        if (!result) {
            throw HttpError(404, `Not found`);
        }

        res.json({
            message: "contact deleted"
        })
    }
    catch (error) {
        next(error);
    }
}

export default {
    getAll,
    getById,
    add,
    updateById,
    deleteById,
}