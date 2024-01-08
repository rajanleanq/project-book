import * as tf from "@tensorflow/tfjs-node";
import express from "express";
import { extractUniqueItems, getColumnFromCSV, parser } from "./utils/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//loads the csv and returns a 2D array
const ratingsCSV = parser("./ratings.csv");
const booksCSV = parser("./books.csv");

const bookCSVLength = booksCSV.length;

//get the first columns from the booksCSV and extract only unique items i.e unique id of each books
const books_id = extractUniqueItems(getColumnFromCSV(ratingsCSV, 0, 1));

//for first user
const user_id = Array.from({ length: bookCSVLength }).fill(400);

async function loadModel() {
  try {
    const modelPath = "./model/model.json";
    const handler = tf.io.fileSystem(modelPath);
    const model = await tf.loadLayersModel(handler);
    return model;
  } catch (error) {
    console.log(error, "error loading the model");
  }
}

async function makeRecommendations(userData, bookData) {
  const model = await loadModel();
  //create tensor from the array
  const userTensor = tf.tensor2d(user_id, [bookCSVLength, 1]);
  const bookTensor = tf.tensor2d(books_id, [bookCSVLength, 1]);

  //use the model for prediction
  const recommendations = model.predict([userTensor, bookTensor]);
  //returns a 2D array from the tensor value
  return recommendations.arraySync();
}

app.post("/recommendations", async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    const recommendations = await makeRecommendations(userId, bookId);

    //converts the 2D array into 1D array
    const recommendedBookId = recommendations.flat();

    //sort the recommendedBookId in descending order and get the sorted indices array: similar to arr.argsort() of numpy
    const recommendedBookIdSorted = recommendedBookId
      .map((_, index) => index)
      .sort(function (a, b) {
        if (recommendedBookId[a] < recommendedBookId[b]) {
          return 1;
        } else if (recommendedBookId[a] > recommendedBookId[b]) {
          return -1;
        } else {
          return 0;
        }
      })
      .slice(0, 5);

    //returns the sorted predictions in descending order
    let sortedArr = recommendedBookIdSorted.map(
      (index) => recommendedBookId[index]
    );

    //filter the books whose id is contained in the recommendedBookIdSorted Array
    const books = booksCSV.filter((innerArray) =>
      recommendedBookIdSorted.includes(parseInt(innerArray[0]))
    );

    //formats the data from booksArray and returns an array of object
    const formattedBooks = books.map((innerArray) => {
      return {
        id: innerArray[0],
        isbn: innerArray[5],
        author: innerArray[7],
        published_year: innerArray[8],
        original_title: innerArray[9],
        title: innerArray[10],
        language: innerArray[11],
        average_rating: innerArray[12],
        ratings_count: innerArray[13],
        ratings_1: innerArray[16],
        ratings_2: innerArray[17],
        ratings_3: innerArray[18],
        ratings_4: innerArray[19],
        ratings_5: innerArray[20],
        image_url: innerArray[21],
        small_image_url: innerArray[22],
      };
    });

    res.json({
      books: formattedBooks,
    });
  } catch (error) {
    console.log(error, "error");
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.listen(4000, () => {
  console.log("server is running on port 4000");
});
