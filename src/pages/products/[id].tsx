import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types/product";
import { useExchangeRate } from "@/context/ExchangeRateContext";
import Link from "next/link";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const exchangeRate = useExchangeRate();

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduct({
          id: docSnap.id,
          name: data.name,
          priceJPY: data.priceJPY,
          category: data.category,
          availableFrom: data.availableFrom,
          availableTo: data.availableTo,
          description: data.description || "",
        });
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-6">読み込み中...</div>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-700">カテゴリ: {product.category}</p>
      {exchangeRate && (
        <p className="text-blue-600 font-semibold mt-2">
          ${Math.round(product.priceJPY * exchangeRate).toFixed(2)} CAD
        </p>
      )}
      {product.description && (
        <p className="text-gray-800 mt-3 whitespace-pre-line">
          {product.description}
        </p>
      )}
      <p className="text-sm mt-1 text-gray-500">
        表示期間: {product.availableFrom.toDate().toLocaleDateString()} ～{" "}
        {product.availableTo.toDate().toLocaleDateString()}
      </p>
      <Link
        href="/"
        className="inline-block bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 mb-4"
      >
        ← 一覧に戻る
      </Link>
    </div>
  );
}
