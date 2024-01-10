import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
  },
  book_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

const List = mongoose.model("List", listSchema);

export default List;
