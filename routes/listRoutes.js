import { Router } from "express";
import {
  addBookToList,
  getUserBookList,
} from "../controller/listController.js";

const router = Router();

router.get("/:userId", getUserBookList).post("/add-book", addBookToList);

export default router;
