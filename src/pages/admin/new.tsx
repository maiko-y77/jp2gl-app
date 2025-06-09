// src/pages/admin/new.tsx
import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/router";

export default function NewProduct() {
  const [name, setName] = useState("");
  const [priceJPY, setPriceJPY] = useState("");
  const [category, setCategory] = useState("野菜");
  const router = useRouter();
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), {
        name,
        priceJPY: Number(priceJPY),
        category,
        availableFrom: Timestamp.fromDate(new Date(availableFrom)),
        availableTo: Timestamp.fromDate(new Date(availableTo)),
        createdAt: Timestamp.now(),
      });
      alert("登録完了！");
      router.push("/"); // 一覧に戻す or /admin にも可
    } catch (err) {
      console.error("登録失敗", err);
      alert("登録に失敗しました");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">商品を登録</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">商品名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label className="block text-sm font-medium">カテゴリ</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="魚">魚</option>
            <option value="肉">肉</option>
            <option value="野菜">野菜</option>
            <option value="フルーツ">フルーツ</option>
            <option value="スイーツ">スイーツ</option>
          </select>
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
