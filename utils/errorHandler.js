import AppError from "./appError.js";

const handleDBDuplicateFields = (err) => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate Field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const errorHandler = (error) => {
  let errorObj = {};

  if (error.message === "Incorrect email") {
    const message = "The email is not registered";
    errorObj = new AppError(message, 400);
  }
  if (error.message === "Incorrect password") {
    const message = "Incorrect password";
    errorObj = new AppError(message, 400);
  }

  if (error.name === "CastError") {
    const message =
      "Record doesn't exists for the given id or the id is invalid";
    errorObj = new AppError(message, 400);
    errorObj.isOperational = false;
  }

  if (error.name === "ValidationError") {
    errorObj = new AppError(error.message, 400);
  }

  if (error.code === 11000) {
    errorObj = handleDBDuplicateFields(error);
  }

  if (error.message.includes("user validation failed")) {
    Object.values(error.errors).forEach((item) => {
      errorObj[item.path] = item.properties.message;
    });
  }

  return errorObj;
};

export default errorHandler;
