/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // ← 追加！
  images: {
    unoptimized: true, // ← Cloudinaryやimgタグ対策
  },
};

export default nextConfig;


