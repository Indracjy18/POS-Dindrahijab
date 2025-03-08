import bcrypt from "bcrypt";

const saltRounds = 10; // Jumlah putaran hashing untuk keamanan

// Fungsi untuk mengenkripsi (hash) password
export const encript = (password) => {
  return bcrypt.hashSync(password, saltRounds);
};

// Fungsi untuk membandingkan password dengan hash yang tersimpan
export const compare = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};
