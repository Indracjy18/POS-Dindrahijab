import joi from "joi";

// Fungsi untuk validasi data pembelian
export const purchaseValidation = (payload) => {
  const purchaseValidationSchema = joi.object({
    date: joi.date().required(), // Tanggal pembelian wajib diisi
    note: joi.string().trim().required(), // Catatan pembelian wajib diisi, tanpa spasi di awal/akhir
    userId: joi.number().required(), // ID pengguna wajib diisi dan harus berupa angka
    total: joi.number().required(), // Total harga wajib diisi dan harus berupa angka
    ppn: joi.number().required(), // Pajak (PPN) wajib diisi dan harus berupa angka
    grandTotal: joi.number().required(), // Total akhir wajib diisi dan harus berupa angka
    detail: joi.array().required(), // Detail pembelian wajib diisi dan harus berupa array
  });

  return purchaseValidationSchema.validateAsync(payload); // Melakukan validasi secara asinkron
};
