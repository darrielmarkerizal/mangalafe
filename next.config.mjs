/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gunakan salah satu opsi saja, tidak keduanya untuk paket yang sama
  experimental: {
    // Opsi ini membiarkan paket dijalankan sebagai external di server
    serverComponentsExternalPackages: ["sequelize", "mysql2"],
  },
};

export default nextConfig;
