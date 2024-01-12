import { Router } from "express";
import {
  addBookToList,
  checkIfBookIsInList,
  getUserBookList,
  removeBookFromList,
} from "../controller/listController.js";

const router = Router();

router
  .get("/:userId/:bookId", checkIfBookIsInList)
  .get("/:userId", getUserBookList)
  .post("/add-book", addBookToList)
  .patch("/:userId/:bookId", removeBookFromList);

export default router;
