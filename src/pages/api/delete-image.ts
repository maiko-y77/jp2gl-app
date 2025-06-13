import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { publicId } = req.body;
  if (!publicId) {
    return res.status(400).json({ message: "Missing publicId" });
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return res.status(500).json({ success: false, error });
  }
}
