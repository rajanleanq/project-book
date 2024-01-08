import { Router } from "express";
import { getBookRecommendation } from "../controller/bookController.js";

const router = Router();

router
  //   .get("/books", getAllBookList)
  .get("/recommendations/:userId", getBookRecommendation);

export default router;
