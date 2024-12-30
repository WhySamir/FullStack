const asyncHandler = (reqHandler) => {
  return (req, res, next) => {
    Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err));
  };
};
export { asyncHandler };

// const asyncHandler2 = () => {};
// const asyncHandler2 = (fnc) => { () => {}; }

//without promise
// const asyncHandler2 = (fnc) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
