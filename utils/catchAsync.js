//function wrapper to catch the errors in asynchronous code block
const catchAsync = (handler) => {
  return (req, res, next) => {
    handler(req, res).catch(next);
  };
};

export default catchAsync;
