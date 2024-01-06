import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import { isEmptyBody, isValidId, isEmptyFavoriteBody, authenticate } from "../../middlewares/index.js";
import {validateBody} from "../../decorators/index.js";

import { contactAddSchema, contactUpdateSchema, contactUpdateFavoriteSchema } from "../../models/Contacts.js";
const contactsRouter = express.Router()

contactsRouter.get('/', authenticate, contactsController.getAll);

contactsRouter.get("/:id", authenticate, isValidId, contactsController.getById);

contactsRouter.post('/', authenticate, isEmptyBody, validateBody(contactAddSchema), contactsController.add);

contactsRouter.delete('/:id', authenticate, isValidId, contactsController.deleteById);

contactsRouter.put('/:id', authenticate, isValidId, isEmptyBody, validateBody(contactUpdateSchema), contactsController.updateById);

contactsRouter.patch("/:id/favorite", authenticate, isValidId, isEmptyFavoriteBody, validateBody(contactUpdateFavoriteSchema), contactsController.updateFavoriteById);

export default contactsRouter;