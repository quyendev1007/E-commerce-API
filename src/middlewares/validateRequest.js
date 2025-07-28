import { StatusCodes } from "http-status-codes";

export const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: true,
  });
  if (error)
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Du lieu khong hop le",
      details: error.details.map((err) => err.message),
    });

  next();
};
