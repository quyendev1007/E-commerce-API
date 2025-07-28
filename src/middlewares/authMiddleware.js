import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  // const token = req.headers.authorization?.split(" ")[1];

  const token = req.cookies?.accessToken;

  if (!token)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "access denied",
    });

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE
    );
    req.jwtDecoded = decoded;

    next();
  } catch (error) {
    if (error?.message?.includes("jwt expired")) {
      return res
        .status(StatusCodes.GONE)
        .json({ message: "Need to refresh token" });
    }

    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Token không hợp lệ" });
  }
};

export const isAuthorized = (role) => (req, res, next) => {
  if (!role.includes(req.jwtDecoded.role))
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Ban khong co quyen truy cap",
    });

  next();
};
