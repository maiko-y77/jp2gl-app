import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Product } from "@/types/product";
import withAuth from "@/lib/withAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { fetchExchangeRateJPYtoCAD } from "@/lib/currency";

function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          name: d.name,
          priceJPY: d.priceJPY,
          category: d.category,
          availableFrom: d.availableFrom,
          availableTo: d.availableTo,
        } as Product;
      });
      setProducts(data);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRate = async () => {
      const rate = await fetchExchangeRateJPYtoCAD();
      setExchangeRate(rate);
    };
    fetchRate();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = confirm("この商品を本当に削除しますか？");
    if (!ok) return;
    await deleteDoc(doc(db, "products", id));
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {exchangeRate && (
        <div className="text-sm text-gray-600 mb-4">
          現在の為替レート:{" "}
          <strong>1 CAD ≒ {(1 / exchangeRate).toFixed(2)} JPY</strong>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">出品者ダッシュボード</h1>
          {userEmail && (
            <p className="text-sm text-gray-600 mt-1">
              ログイン中: {userEmail}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/new"
            className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            商品登録
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          >
            ログアウト
          </button>
        </div>
      </div>
      <ul className="space-y-4">
        {products.map((product) => (
          <li key={product.id} className="border p-4 rounded shadow-sm">
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-600">
              ¥{product.priceJPY} / {product.category}
            </p>
            <p className="text-xs text-gray-400">
              {product.availableFrom?.toDate().toLocaleDateString()} ～{" "}
              {product.availableTo?.toDate().toLocaleDateString()}
            </p>
            <div className="flex gap-4 mt-3">
              <Link
                href={`/admin/edit/${product.id}`}
                className="text-sm bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
              >
                編集
              </Link>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withAuth(AdminDashboard);
