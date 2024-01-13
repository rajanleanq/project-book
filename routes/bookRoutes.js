import { Router } from "express";
import {
  getAllBookList,
  getBookById,
  getBookRecommendation,
  searchBookList,
} from "../controller/bookController.js";

const router = Router();

router
  .get("/", getAllBookList)
  .get("/search", searchBookList)
  .get("/recommendations/:userId", getBookRecommendation)
  .get("/:bookId", getBookById);

export default router;
