const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const error = true;
  const message = err.message || "BACKEND ERROR";
  const extraDetails = err.extraDetails || "Error from Backend";

  return res
    .status(status)
    .json({ statusCode: status, error, message, extraDetails });
};

export default errorMiddleware;
