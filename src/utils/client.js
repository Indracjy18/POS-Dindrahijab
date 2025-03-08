import { PrismaClient } from "@prisma/client";

// Inisialisasi instance Prisma Client untuk berinteraksi dengan database
const prisma = new PrismaClient();

export default prisma; // Mengekspor instance Prisma agar bisa digunakan di file lain
