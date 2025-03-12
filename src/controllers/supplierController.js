import path from "path";
import prisma from "../utils/client.js";
import { logger } from "../utils/winston.js";
import { supplierValidation } from "../validations/supplierValidation.js";
import fs from "fs";
import pdf from "pdf-creator-node";
import excelJS from "exceljs";

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

export const generatePdf = async (req, res) => {
  let pathFile = "./public/pdf";
  let fileName = "supplier.pdf";
  let filePath = path.join(pathFile, fileName);
  let html = fs.readFileSync("./src/templates/templateSupplier.html", "utf8");

  let options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "15mm",
      contents: "",
    },
    footer: {
      height: "28mm",
      contents: {
        default:
          '<span style="color:#444;">{{page}}</span>/<span>{{pages}}</span>',
      },
    },
  };

  try {
    // Hapus file lama jika sudah ada
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Ambil data supplier dari database
    const data = await prisma.supplier.findMany({});
    let suppliers = [];

    data.forEach((supplier, index) => {
      suppliers.push({
        no: index + 1,
        name:
          supplier.firstName +
          " " +
          (supplier.lastName ? supplier.lastName : ""),
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
      });
    });

    let document = {
      html: html,
      data: {
        suppliers: suppliers,
      },
      path: filePath,
    };

    // Generate PDF
    const process = await pdf.create(document, options);
    if (process) {
      return res.status(200).json({
        message: "PDF generated successfully",
        result: "/pdf/" + fileName,
      });
    }
  } catch (error) {
    logger.error(
      "controllers/supplierController.js:generatePdf - " + error.message
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const generateExcel = async (req, res) => {
  const excelReport = new excelJS.Workbook();
  const workSheet = excelReport.addWorksheet("Supplier");
  const excelPath = "./public/excel";

  try {
    // Hapus file lama jika ada
    const filePath = path.join(excelPath, "Supplier.xlsx");
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Ambil data supplier dari database
    const data = await prisma.supplier.findMany({});

    // Definisi kolom
    workSheet.columns = [
      { header: "No", key: "s_no", width: 5 },
      { header: "Name", key: "name", width: 25 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Email", key: "email", width: 35 },
    ];

    // Tambahkan data ke worksheet
    let counter = 1;
    data.forEach((supplier) => {
      supplier.s_no = counter;
      supplier.name = supplier.firstName + " " + (supplier.lastName || ""); // Tambah spasi
      workSheet.addRow(supplier);
      counter++;
    });

    // Tambahkan border dan styling
    let list = ["A", "B", "C", "D", "E"];
    for (let i = 1; i <= counter; i++) {
      list.forEach((item) => {
        workSheet.getCell(`${item}${i}`).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }

    // Styling header
    workSheet.getRow(1).eachCell((cell) => {
      cell.font = { name: "Arial", family: 2, size: 14, bold: true };
    });

    // Simpan file Excel
    await excelReport.xlsx.writeFile(filePath);

    // Kirim respons ke client
    return res.status(200).json({
      message: "success",
      result: "/excel/Supplier.xlsx",
    });
  } catch (error) {
    logger.error(
      `controllers/supplierController.js:generateExcel - ${error.message}`
    );
    return res.status(500).json({
      message: "Error generating Excel file",
      result: null,
    });
  }
};
