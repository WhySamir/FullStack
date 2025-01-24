import { ApiError } from "../utlis/ApiError.js";
import { ApiResponds } from "../utlis/ApiResponds.js";

import { asyncHandler } from "../utlis/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  // Build the healthcheck response
  const response = new ApiResponds(
    200,
    null, // No additional data
    "Service is running"
  );

  // Send the OK status with the JSON response
  res.status(200).json(response);
});

export { healthcheck };
