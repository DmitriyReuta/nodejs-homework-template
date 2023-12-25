import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import { isEmptyBody, isValidId, isEmptyFavoriteBody } from "../../middlewares/index.js";
import {validateBody} from "../../decorators/index.js";

import { contactAddSchema, contactUpdateSchema, contactUpdateFavoriteSchema } from "../../models/Contacts.js";
const contactsRouter = express.Router()

contactsRouter.get('/', contactsController.getAll);

contactsRouter.get("/:id", isValidId, contactsController.getById);

contactsRouter.post('/', isEmptyBody, validateBody(contactAddSchema), contactsController.add);

contactsRouter.delete('/:id', isValidId, contactsController.deleteById);

contactsRouter.put('/:id', isValidId, isEmptyBody, validateBody(contactUpdateSchema), contactsController.updateById);

contactsRouter.patch("/:id/favorite", isValidId, isEmptyFavoriteBody, validateBody(contactUpdateFavoriteSchema), contactsController.updateFavoriteById);

export default contactsRouter;