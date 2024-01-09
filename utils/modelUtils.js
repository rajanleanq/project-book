import * as tf from "@tensorflow/tfjs-node";
import Book from "../model/bookModel.js";
import { parser } from "./index.js";

//loads the csv and returns a 2D array
const ratingsCSV = parser("ratings.csv");
const booksCSV = parser("books.csv");

// const bookCSVLength = booksCSV.length;

//get the first columns from the booksCSV and extract only unique items i.e unique id of each books
// const books_id = extractUniqueItems(getColumnFromCSV(ratingsCSV, 0, 1));

//for first user
// const user_id = Array.from({ length: bookCSVLength }).fill(400);

async function loadModel() {
  try {
    const modelPath = "trained_model/model.json";
    const handler = tf.io.fileSystem(modelPath);
    const model = await tf.loadLayersModel(handler);
    return model;
  } catch (error) {
    console.log(error, "error loading the model");
  }
}

async function makeRecommendations(userId) {
  const model = await loadModel();

  //returns an array containing unique id from each document of the collection
  const books_id = await Book.distinct("id");
  const bookCSVLength = books_id.length;

  //create array of equal length as bookCSV for given userId
  const user_id = Array.from({ length: bookCSVLength }).fill(parseInt(userId));

  //create tensor from the array
  const userTensor = tf.tensor2d(user_id, [bookCSVLength, 1]);
  const bookTensor = tf.tensor2d(books_id, [bookCSVLength, 1]);

  //use the model for prediction
  const recommendations = model.predict([userTensor, bookTensor]);
  //returns a 2D array from the tensor value
  return recommendations.arraySync();
}

export { booksCSV, loadModel, makeRecommendations };
