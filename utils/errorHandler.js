import AppError from "./appError.js";

const handleDBDuplicateFields = (err) => {
  const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate Field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  return new AppError(err.message, 400);
};

const errorHandler = (error) => {
  let errorObj = {};

  if (error.message === "Incorrect email") {
    errorObj = "The email is not registered";
  }
  if (error.message === "Incorrect password") {
    errorObj = "Incorrect password";
  }

  if (error.name === "CastError") {
    errorObj = "Record doesn't exists for the given id or the id is invalid";
  }

  if (error.name === "ValidationError") {
    errorObj = handleValidationError(error);
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
