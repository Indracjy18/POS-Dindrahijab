import { compare } from "bcrypt";
import { encript } from "../utils/bcrypt.js";
import prisma from "../utils/client.js";
import { logger } from "../utils/winston.js";
import {
  userUpdateValidation,
  userValidation,
} from "../validations/userValidation.js";
import {
  generateAccessToken,
  generateRefreshToken,
  parseJwt,
  verifyRefreshToken,
} from "../utils/jwt.js";

export const createUser = async (req, res) => {
  const { error, value } = userValidation(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }
  try {
    const result = await prisma.user.create({
      data: {
        name: value.name,
        userName: value.userName,
        password: encript(value.password),
        role: value.role,
      },
    });
    result.password = "xxxxxxxxxxxxxxxxxx";
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error("controllers/userController.js:createUser - " + error.message);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const updateUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
      result: null,
    });
  }
  // data validation
  const { error, value } = userUpdateValidation(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }
  let pass = user.password;
  if (value.password && value.password.length > 0) {
    pass = encript(value.password);
  }
  try {
    const result = await prisma.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: value.name,
        userName: value.userName,
        password: pass,
        role: value.role,
      },
    });
    result.password = "xxxxxxxxxxxxxxxxxx";
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error("controllers/userController.js:updateUser - " + error.message);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const result = await prisma.user.findUnique({
      where: {
        userName: req.body.userName,
      },
    });
    if (result) {
      if (compare(req.body.password, result.password)) {
        // generate token
        result.password = "xxxxxxxxxxxxxxxxxx";
        const accessToken = generateAccessToken(result);
        const refreshToken = generateRefreshToken(result);
        return res.status(200).json({
          message: "Login success",
          result,
          accessToken,
          refreshToken,
        });
      } else {
        return res.status(500).json({
          message: "password not match",
          result: null,
        });
      }
    } else {
      return res.status(500).json({
        message: "User not found",
        result: null,
      });
    }
  } catch (error) {
    logger.error("controllers/userController.js:loginUser - " + error.message);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const result = await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    result.password = "xxxxxxxxxxxxxxxxxx";
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error("controllers/userController.js:deleteUser - " + error.message);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const result = await prisma.user.findMany({});
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error("controllers/userController.js:getAllUser - " + error.message);
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const result = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    result.password = "xxxxxxxxxxxxxxxxxx";
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/userController.js:getUserById - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const setRefreshToken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Verify token failed", result: null });
    }

    // Decode token tanpa verifikasi untuk debugging
    const decodedToken = parseJwt(token);
    console.log("Decoded Token:", decodedToken);

    const verify = verifyRefreshToken(token); // Verifikasi token
    console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET);

    if (!verify || !verify.id) {
      return res
        .status(401)
        .json({ message: "Invalid token, missing user ID", result: null });
    }

    console.log("Token verify result:", verify);

    const user = await prisma.user.findUnique({
      where: { id: verify.id },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found", result: null });
    }

    user.password = "xxxxxxxxxxxxxxxxxx";

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(200).json({
      message: "Refresh success",
      result: user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error(
      "controllers/userController.js:setRefreshToken - " + error.message
    );
    return res.status(500).json({ message: error.message, result: null });
  }
};
