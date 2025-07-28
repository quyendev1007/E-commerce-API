import jwt from "jsonwebtoken";

export const generateToken = async (userInfo, secretSignature, expiresIn) => {
  try {
    return jwt.sign(userInfo, secretSignature, { expiresIn: expiresIn });
  } catch (error) {
    throw new Error("Lỗi khi tạo token: " + error.message);
  }
};

export const verifyToken = async (token, secretSignature) => {
  try {
    return jwt.verify(token, secretSignature);
  } catch (error) {
    throw new Error("Token không hợp lệ hoặc đã hết hạn: " + error.message);
  }
};
