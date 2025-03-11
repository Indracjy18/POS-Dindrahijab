import JsonWebToken from "jsonwebtoken";
import "dotenv/config";
import { logger } from "./winston.js";

// Membuat token akses (JWT) dengan durasi yang ditentukan
const generateAccessToken = (user) => {
  const payload = { id: user.id, username: user.username };
  return JsonWebToken.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN || "1800s",
  });
};

// Membuat token refresh (JWT) dengan durasi yang lebih lama
const generateRefreshToken = (user) => {
  const payload = { id: user.id };
  return JsonWebToken.sign(payload, process.env.JWT_REFRESH_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "86400s",
  });
};

// Memverifikasi token refresh
const verifyRefreshToken = (token) => {
  try {
    console.log(" Secret saat verifikasi:", process.env.JWT_REFRESH_SECRET);
    console.log(" Token yang diterima untuk verifikasi:", token);

    const decoded = JsonWebToken.verify(token, process.env.JWT_REFRESH_SECRET);
    console.log(" Token berhasil diverifikasi:", decoded);

    return decoded;
  } catch (err) {
    console.error("❌ JWT Verify Error:", err.name, "-", err.message);
    return null;
  }
};

// Parsing payload JWT tanpa verifikasi (hanya decode bagian payload)
const parseJwt = (token) => {
  try {
    if (!token) {
      logger.error("❌ parseJwt: Token tidak tersedia!");
      return null;
    }

    const parts = token.split(".");
    if (parts.length < 3) {
      throw new Error("Invalid token format");
    }

    const base64Payload = parts[1];
    return JSON.parse(Buffer.from(base64Payload, "base64").toString());
  } catch (err) {
    logger.error(`❌ parseJwt Error: ${err.message}`);
    return null;
  }
};

// Memverifikasi token akses
const verifyAccessToken = (token) => {
  try {
    console.log("Verifying token:", token); // Debug token
    return JsonWebToken.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch (err) {
    logger.error(
      `controllers/userController.js:verifyAccessToken - ${err.message}`
    );
    return null;
  }
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  parseJwt,
  verifyAccessToken,
};
