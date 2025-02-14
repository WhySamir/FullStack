//asyncHandler accepts a function (reqHandler) as an argument.
// reqHandler is typically an asynchronous function that handles an Express route (like getCurrentUser
//asyncHandler returns new function that takes (req, res, next) as arguments.
//wrapping reqHandler in asyncHandler ensures that any errors are automatically caught and passed to the next middleware without requiring explicit
const asyncHandler = (reqHandler) => {
  return (req, res, next) => {
    Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err));
  };
};
export { asyncHandler };

// const asyncHandler2 = () => {};
// const asyncHandler2 = (fnc) =>  () => {};

//without promise
// const asyncHandler2 = (fnc) => async (req, res, next) => {
//   try {
//     await fnc(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
