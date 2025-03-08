import winston from "winston";
import "winston-daily-rotate-file";

// Konfigurasi transport untuk menyimpan log dalam file harian
const transport = new winston.transports.DailyRotateFile({
  filename: "./logs/app-%DATE%.log", // Format nama file log berdasarkan tanggal
  datePattern: "YYYY-MM-DD", // Pola tanggal untuk rotasi file log
  zippedArchive: true, // Mengarsipkan file log lama dalam format zip
  maxSize: "1m", // Ukuran maksimal log sebelum rotasi (1MB)
  maxFiles: "14d", // Menyimpan log selama 14 hari sebelum dihapus
  level: "error", // Hanya menyimpan log dengan level "error" ke file
  handleExceptions: true, // Menangani error yang tidak tertangani
});

// Konfigurasi logger utama
export const logger = winston.createLogger({
  level: "silly", // Level logging terendah (mencatat semua level)
  format: winston.format.combine(
    winston.format.json({ space: 2 }), // Format JSON dengan indentasi
    winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }), // Format timestamp
    winston.format.label({ label: "[LOGGER]" }), // Label log
    winston.format.printf(
      (info) =>
        ` ${info.label} ${info.timestamp} ${info.level} : ${info.message}` // Format output log
    )
  ),
  transports: [
    // Transport untuk menampilkan log di console dengan warna
    new winston.transports.Console({
      level: "silly",
      handleExceptions: true,
      format: winston.format.combine(winston.format.colorize({ all: true })),
    }),
    transport, // Transport untuk menyimpan log ke file
  ],
});
