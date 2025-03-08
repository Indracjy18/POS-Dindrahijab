import joi from "joi";

// Fungsi untuk validasi data supplier
export const supplierValidation = (payload) => {
  const supplierValidationSchema = joi.object({
    firstName: joi.string().trim().required(), // Nama depan wajib diisi, tanpa spasi di awal/akhir
    lastName: joi.string().trim().allow(null).allow(""), // Nama belakang boleh kosong atau null
    phone: joi.string().trim().required(), // Nomor telepon wajib diisi
    email: joi.string().trim().allow(null).allow(""), // Email boleh kosong atau null
    address: joi.string().trim().required(), // Alamat wajib diisi
  });

  return supplierValidationSchema.validate(payload); // Melakukan validasi payload
};
