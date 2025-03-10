import prisma from "../utils/client";

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
