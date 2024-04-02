export const errorHandler = (err, req, res, next) => {
  if (process.env.MODE !== "production") {
    return res
      .status(err.statusCode || 500)
      .json({ ...err, message: err.message, stack: err.stack });
  }

  res.status(err.statusCode || 500).json({ ...err, message: err.message });
};
