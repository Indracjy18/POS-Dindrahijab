import joi from "joi";

// Fungsi untuk validasi data produk
export const productValidation = (payload) => {
  const productValidationSchema = joi.object({
    barcode: joi.string().trim().allow(null).allow(""), // Barcode boleh kosong atau null
    productName: joi.string().trim().required(), // Nama produk wajib diisi
    image: joi.string().trim().allow(null).allow(""), // Gambar produk boleh kosong atau null
    url: joi.string().trim().allow(null).allow(""), // URL boleh kosong atau null
    qty: joi.number().required(), // Jumlah produk wajib diisi dan harus angka
    price: joi.number().required(), // Harga produk wajib diisi dan harus angka
    kategoryId: joi.number().required(), // ID kategori wajib diisi dan harus angka
    supplierId: joi.number().required(), // ID supplier wajib diisi dan harus angka
    file: joi.any().allow(null).allow(""), // File boleh kosong atau null (misalnya untuk upload gambar)
  });

  return productValidationSchema.validate(payload); // Melakukan validasi payload
};
