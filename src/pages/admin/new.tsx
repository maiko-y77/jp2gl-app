// src/pages/admin/new.tsx
import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/router";
import Link from "next/link";
import { uploadImageToCloudinary } from "@/lib/uploadImage";

export default function NewProduct() {
  const [nameEn, setNameEn] = useState("");
  const [nameJa, setNameJa] = useState("");
  const [priceJPY, setPriceJPY] = useState("");
  const [category, setCategory] = useState("Vegetables/野菜");
  const router = useRouter();
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      let publicId = "";
      if (imageFile) {
        const result = await uploadImageToCloudinary(imageFile);
        imageUrl = result.imageUrl;
        publicId = result.publicId;
      }
      await addDoc(collection(db, "products"), {
        nameEn,
        nameJa,
        priceJPY: Number(priceJPY),
        category,
        description,
        imageUrl, // ← 保存
        publicId,
        availableFrom: Timestamp.fromDate(new Date(availableFrom)),
        availableTo: Timestamp.fromDate(new Date(availableTo)),
        createdAt: Timestamp.now(),
      });

      alert("登録完了！");
      router.push("/admin");
    } catch (err) {
      console.error("登録失敗", err);
      alert("登録に失敗しました");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">商品を登録</h1>
      <Link
        href="/admin"
        className="text-sm bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
      >
        ダッシュボードに戻る
      </Link>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">商品名（英語）</label>
          <input
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">商品名（日本語）</label>
          <input
            type="text"
            value={nameJa}
            onChange={(e) => setNameJa(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">価格（JPY）</label>
          <input
            type="number"
            value={priceJPY}
            onChange={(e) => setPriceJPY(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">商品画像</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
            className="w-full border px-3 py-2 rounded"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-32 h-auto rounded"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">カテゴリ</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Seafoods/魚介類">Seafoods/魚介類</option>
            <option value="Meat/肉類">Meat/肉類</option>
            <option value="Vegetables/野菜">Vegetables/野菜</option>
            <option value="Fruit/果物">Fruit/果物</option>
            <option value="Sweets/スイーツ">Sweets/スイーツ</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">販売開始日</label>
          <input
            type="date"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">販売終了日</label>
          <input
            type="date"
            value={availableTo}
            onChange={(e) => setAvailableTo(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          登録
        </button>
      </form>
    </div>
  );
}
