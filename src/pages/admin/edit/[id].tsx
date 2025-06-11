import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types/product";
import withAuth from "@/lib/withAuth";
import Link from "next/link";

function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [priceJPY, setPriceJPY] = useState("");
  const [category, setCategory] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduct({ id: docSnap.id, ...data } as Product);
        setName(data.name);
        setPriceJPY(data.priceJPY.toString());
        setCategory(data.category);
        setAvailableFrom(
          data.availableFrom.toDate().toISOString().split("T")[0]
        );
        setAvailableTo(data.availableTo.toDate().toISOString().split("T")[0]);
        setDescription(data.description || "");
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || typeof id !== "string") return;
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, {
      name,
      priceJPY: Number(priceJPY),
      category,
      description,
      availableFrom: Timestamp.fromDate(new Date(availableFrom)),
      availableTo: Timestamp.fromDate(new Date(availableTo)),
    });
    alert("更新しました");
    router.push("/admin");
  };

  if (!product) return <div className="p-6">読み込み中...</div>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">商品編集</h1>
      <Link
        href="/admin"
        className="text-sm bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
      >
        ダッシュボードに戻る
      </Link>
      <form onSubmit={handleUpdate} className="space-y-4">
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium">販売終了日</label>
          <input
            type="date"
            value={availableTo}
            onChange={(e) => setAvailableTo(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          保存
        </button>
      </form>
    </div>
  );
}

export default withAuth(EditProduct);
