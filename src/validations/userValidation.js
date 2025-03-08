import joi from "joi";

// Fungsi untuk validasi data saat registrasi user
export const userValidation = (payload) => {
  const userValidationSchema = joi.object({
    name: joi.string().trim().required(), // Nama harus string, tanpa spasi di awal/akhir, wajib diisi
    userName: joi.string().min(4).trim().required(), // Username minimal 4 karakter, wajib diisi
    password: joi.string().min(4).max(15).required(), // Password 4-15 karakter, wajib diisi
    role: joi.string().required(), // Role harus string, wajib diisi
    confirmPassword: joi
      .any()
      .equal(joi.ref("password")) // Harus sama dengan password
      .required()
      .label("Confirm Password")
      .messages({
        "any.only": "{{#label}} not same as password", // Pesan jika tidak sama dengan password
        "any.required": "{{#label}} is required", // Pesan jika tidak diisi
      }),
  });

  return userValidationSchema.validate(payload); // Melakukan validasi payload
};

// Fungsi untuk validasi data saat update user
export const userUpdateValidation = (payload) => {
  const userUpdateValidationSchema = joi.object({
    userName: joi.string().min(4).trim().required(), // Username minimal 4 karakter, wajib diisi
    password: joi.string().allow(null).allow(""), // Password boleh kosong atau null (jika tidak ingin mengubah)
    confirmPassword: joi
      .any()
      .equal(joi.ref("password")) // Harus sama dengan password jika diisi
      .required()
      .label("Confirm Password")
      .messages({
        "any.only": "{{#label}} not same as password", // Pesan jika tidak sama dengan password
        "any.required": "{{#label}} is required", // Pesan jika tidak diisi
      }),
    name: joi.string().trim().required(), // Nama harus string, tanpa spasi di awal/akhir, wajib diisi
    role: joi.string().trim().required(), // Role harus string, wajib diisi
  });

  return userUpdateValidationSchema.validate(payload); // Melakukan validasi payload
};
