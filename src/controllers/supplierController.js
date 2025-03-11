import prisma from "../utils/client.js";
import { logger } from "../utils/winston.js";
import { supplierValidation } from "../validations/supplierValidation.js";

export const getAllSupplier = async (req, res) => {
  const last_id = parseInt(req.query.last_id) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  let result = [];

  try {
    const searchPattern = `%${search}%`;

    if (last_id <= 1) {
      result = await prisma.$queryRaw`
        SELECT id, firstName, lastName, phone, email, address
        FROM Supplier
        WHERE (
          CONCAT(firstName, ' ', lastName) LIKE ${searchPattern}
          OR phone LIKE ${searchPattern}
          OR email LIKE ${searchPattern}
          OR address LIKE ${searchPattern}
        )
        ORDER BY id DESC
        LIMIT ${parseInt(limit, 10)}
      `;
    } else {
      const lastId = parseInt(last_id, 10);
      const limitValue = parseInt(limit, 10);

      result = await prisma.$queryRaw`
        SELECT id, firstName, lastName, phone, email, address
        FROM Supplier
        WHERE (
          CONCAT(firstName, ' ', lastName) LIKE ${searchPattern}
          OR phone LIKE ${searchPattern}
          OR email LIKE ${searchPattern}
          OR address LIKE ${searchPattern}
        )
        AND id < ${lastId}
        ORDER BY id DESC
        LIMIT ${limitValue}
      `;
    }

    return res.status(200).json({
      message: "success",
      result,
      lastId: result.length > 0 ? result[result.length - 1].id : 0,
      hasMore: result.length >= limit ? true : false,
    });
  } catch (error) {
    logger.error(
      "controllers/supplierController.js:getAllSupplier - " + error.message
    );

    return res.status(500).json({
      message: error.message,
      result: null,
      lastId: result.length > 0 ? result[result.length - 1].id : 0,
      hasMore: result.length >= limit ? true : false,
    });
  }
};

export const getSupplierById = async (req, res) => {
  try {
    const result = await prisma.supplier.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    return res.status(200).json({
      message: "succers",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/supplierController.js:getSupplierById - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const createSupplier = async (req, res) => {
  const { error, value } = supplierValidation(req.body); // Panggil sebagai fungsi

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }

  try {
    const result = await prisma.supplier.create({
      data: {
        firstName: value.firstName,
        lastName: value.lastName,
        phone: value.phone,
        email: value.email || null,
        address: value.address,
      },
    });

    return res.status(201).json({
      message: "Supplier created successfully",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/supplierController.js:createSupplier - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const updateSupplier = async (req, res) => {
  const { error, value } = supplierValidation(req.body); // Panggil sebagai fungsi
  if (error != null) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }
  try {
    const result = await prisma.supplier.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        firstName: value.firstName,
        lastName: value.lastName,
        phone: value.phone,
        email: value.email || null,
        address: value.address,
      },
    });
    return res.status(200).json({
      message: "Supplier updated successfully",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/supplierController:updateSupllier.js -" + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const result = await prisma.supplier.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    return res.status(200).json({
      message: "Supplier deleted successfully",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/supplierController.js:deleteSupplier - ",
      +error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};
