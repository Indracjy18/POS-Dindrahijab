import "dotenv/config";
import { productValidation } from "../validations/productValidation.js";
import { setCode } from "../utils/generateCode.js";
import { logger } from "../utils/winston.js";
import prisma from "../utils/client.js";
import path from "path";

export const createProduct = async (req, res) => {
  const fileMaxSize = process.env.FILE_MAX_SIZE;
  const allowFileExt = process.env.FILE_EXTENSION;
  const msgFileSize = process.env.FILE_MAX_MESSAGE;

  const { error, value } = productValidation(req.body);
  if (error != null) {
    return res
      .status(400)
      .json({ message: error.details[0].message, result: null });
  }
  if (req.file === null || req.file === undefined) {
    return res
      .status(400)
      .json({ message: "No file was uploaded", result: null });
  }

  //kalo ssemuanya lolos
  const file = req.files.file; // file yang di apload
  const fileSize = req.data.length; // definisi ukuran file
  const ext = path.extname(file.name); // extensi file
  const fileName = file.md5 + ext; // menghindari agar file terduplikat
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowType = allowFileExt;

  if (!allowType.includes(ext.toLowerCase())) {
    return res.status(422).json({
      message: "Invalid file type",
      result: null,
    });
  }
  if (fileSize > fileMaxSize) {
    return res.status(422).json({
      message: msgFileSize,
      result: null,
    });
  }
  try {
    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to upload file",
          result: null,
        });
      }
    });
    const result = await prisma.product.create({
      data: {
        code: setCode("PRD-"),
        barcode: value.barcode ? value.barcode : null,
        productName: value.productName,
        image: fileName,
        url: url,
        qty: value.qty,
        price: value.price,
        kategoryId: value.kategoryId,
        supplierId: value.supplierId,
      },
    });
    return res.status(200).json({
      message: "Product created successfully",
      result: result,
    });
  } catch (error) {
    logger.error(
      "controllers/productController.js:createProduct - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};
