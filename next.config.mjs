/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["wheat-fish-905221.hostingersite.com"],
  },
  // Gunakan salah satu opsi saja, tidak keduanya untuk paket yang sama
  experimental: {
    // Opsi ini membiarkan paket dijalankan sebagai external di server
    serverComponentsExternalPackages: ["sequelize", "mysql2"],
  },
};

export default nextConfig;
