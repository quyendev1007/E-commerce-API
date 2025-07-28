import { User } from "../models/users";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import ms from "ms";
import { generateToken, verifyToken } from "../providers/jwtProvider";

const register = async (req, res) => {
  try {
    const { username, email, password, avatar, phone } = req.body;

    const isUser = await User.findOne({ email });

    if (isUser)
      return res.status(StatusCodes.CONFLICT).json({
        message: "Email da ton tai",
      });

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashPass,
      avatar,
      phone,
    });
    newUser.password = undefined;

    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUser = await User.findOne({ email });

    if (!isUser)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Email chua duoc danh ky",
      });

    const hashPass = await bcrypt.compare(password, isUser.password);

    if (!hashPass)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "mat khau ko chinh sac",
      });

    const userInfo = {
      id: isUser._id,
      username: isUser.username,
      phone: isUser.phone,
      avatar: isUser.avatar,
      email: isUser.email,
      role: isUser.role,
    };

    const accessToken = await generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      process.env.ACCESS_TOKEN_LIFE
    );

    const refreshToken = await generateToken(
      userInfo,
      process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
      process.env.REFRESH_TOKEN_LIFE
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: ms("14 days"),
      sameSite: "none",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: ms("14 days"),
      sameSite: "none",
    });

    res.status(StatusCodes.OK).json({ ...userInfo, accessToken, refreshToken });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const clientRefreshToken = req.cookies?.refreshToken;

    if (!clientRefreshToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Refresh token het han hoac khong ton tai",
      });
    }

    const isValid = await verifyToken(
      clientRefreshToken,
      process.env.REFRESH_TOKEN_SECRET_SIGNATURE
    );

    if (!isValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Refresh token khong hop le",
      });
    }

    const userInfo = {
      id: isValid._id,
      username: isValid.username,
      phone: isValid.phone,
      avatar: isValid.avatar,
      email: isValid.email,
      role: isValid.role,
    };

    const newAccessToken = await generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      process.env.ACCESS_TOKEN_LIFE
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      maxAge: ms("14 days"),
      sameSite: "none",
    });

    return res.status(StatusCodes.OK).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Lỗi khi làm mới token",
      message: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page = 1, search = "", sortBy = "", order = "desc" } = req.query;

    const safeSortBy = sortBy?.trim() || "createdAt";

    const safeOrder = order || "desc";

    const orderValue = safeOrder === "desc" ? 1 : -1;

    const sort = { [safeSortBy]: orderValue };

    const filter = {};
    if (search.trim() !== "") {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = parseInt(page) || 1;
    const limit = 2;
    const offset = (pageNumber - 1) * limit;

    const option = {
      pageNumber,
      limit,
      offset,
      sort,
    };

    const users = await User.paginate(filter, option);

    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    user.password = undefined;
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const authController = {
  register,
  login,
  refreshToken,
  updateUser,
  getUsers,
};
