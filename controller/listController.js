import List from "../model/listModel.js";
import catchAsync from "../utils/catchAsync.js";

const addBookToList = catchAsync(async (req, res) => {
  const { userId, bookId } = req.body;

  // Try to find an existing document with the same user_id
  const existingList = await List.findOne({ user_id: userId });

  if (existingList) {
    // If the document already exists, update the array by pushing the new book_id
    await List.updateOne(
      { user_id: userId },
      { $addToSet: { books: bookId } } // Using $addToSet to avoid duplicate entries
    );
    const updatedList = await List.findOne({ user_id: userId });
    res.json({ message: "Book added to list successfully", list: updatedList });
  } else {
    // If no document is found, create a new one
    const newList = await List.create({ user_id: userId, books: [bookId] });
    res.json({
      message: "Book added to list successfully",
      list: newList,
    });
  }
});

const getUserBookList = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const booklist = await List.findOne(
    { user_id: userId },
    "-user_id -_id"
  ).populate("books");
  res.json(booklist);
});

export { addBookToList, getUserBookList };
