import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import corsMiddleware from "./middleware/corsMiddleware.js";
import {
  errorHandlerMiddleware,
  errorLoggerMiddleware,
  invalidPathHandler,
} from "./middleware/errorHandlerMiddleware.js";
import { bookRoutes } from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(corsMiddleware());
//routes
app.use("/books", bookRoutes);

//middlewares
app.use(errorLoggerMiddleware);
app.use(errorHandlerMiddleware);
app.use(invalidPathHandler);

mongoose.connect(process.env.DB_URL).then(() => {
  console.log("Successfully connected to Database");
  app.listen(4000, () => {
    console.log("server is running on port 4000");
  });
});
