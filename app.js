import express from "express";
import {
  errorHandlerMiddleware,
  errorLoggerMiddleware,
  invalidPathHandler,
} from "./middleware/errorHandlerMiddleware.js";
import { bookRoutes } from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/books", bookRoutes);

//middlewares
app.use(errorLoggerMiddleware);
app.use(errorHandlerMiddleware);
app.use(invalidPathHandler);

app.listen(4000, () => {
  console.log("server is running on port 4000");
});
