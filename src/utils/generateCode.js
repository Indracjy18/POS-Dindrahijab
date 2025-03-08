// Membuat kode unik dengan kombinasi key dan angka acak berbasis timestamp
export const setCode = (key) => {
  const code = Math.floor(Math.random() * Date.now()); // Menghasilkan angka acak berdasarkan timestamp
  return `${key}${code}`; // Menggabungkan key dengan angka acak
};

// Membuat kode unik berbasis timestamp tanpa angka acak
export const setOrderCode = (key) => {
  const code = Math.floor(Date.now()); // Menggunakan timestamp saat ini sebagai kode unik
  return `${key}${code}`; // Menggabungkan key dengan timestamp
};
