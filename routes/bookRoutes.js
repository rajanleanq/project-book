import { Router } from "express";
import {
  filterBookList,
  getAllBookList,
  getBookById,
  getBookRecommendation,
} from "../controller/bookController.js";

const router = Router();

router
  .get("/", getAllBookList)
  .get("/search", filterBookList)
  .get("/recommendations/:userId", getBookRecommendation)
  .get("/:bookId", getBookById);

export default router;
