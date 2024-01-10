import { Router } from "express";
import {
  filterBookList,
  getAllBookList,
  getBookById,
  getBookRecommendation,
  searchBookList,
} from "../controller/bookController.js";

const router = Router();

router
  .get("/", getAllBookList)
  .get("/search", searchBookList)
  .get("/filter", filterBookList)
  .get("/recommendations/:userId", getBookRecommendation)
  .get("/:bookId", getBookById);

export default router;
