import catchAsync from "../utils/catchAsync.js";
import { booksCSV, makeRecommendations } from "../utils/modelUtils.js";

const getBookRecommendation = catchAsync(async (req, res) => {
  const { userId } = req.params;
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
});

export { getBookRecommendation };
