import Book from "../model/bookModel.js";
import catchAsync from "../utils/catchAsync.js";
import { makeRecommendations } from "../utils/modelUtils.js";

const getBookRecommendation = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = req.query.result || 5;
  const recommendations = await makeRecommendations(userId);

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
    .slice(0, result);

  //returns the book list whose id is contained in the recommendedBookIdSorted array
  const bookList = await Book.find({ id: recommendedBookIdSorted });

  //sorts the booklist based on the ordering of recommendedBookIdSorted
  const books = recommendedBookIdSorted.map((bookId) =>
    bookList.find((book) => book.id === bookId)
  );

  res.json({
    count: books.length,
    books: books,
  });
});

const getAllBookList = catchAsync(async (req, res) => {
  let page = (req.query.page >= 1 ? req.query.page : 1) - 1;
  const resultsPerPage = req.query.results || 10;

  const totalCount = await Book.countDocuments();
  const books = await Book.find()
    .limit(resultsPerPage)
    .skip(resultsPerPage * page);
  res.json({ totalCount, count: books.length, page: page + 1, books });
});

const getBookById = catchAsync(async (req, res) => {
  const bookId = req.params.bookId;
  const book = await Book.findById(bookId);
  res.json({ book });
});

const filterBookList = catchAsync(async (req, res) => {
  const author = req.query.author;
  const books = await Book.find({ authors: author });
  res.json({ books });
});

export { filterBookList, getAllBookList, getBookById, getBookRecommendation };
