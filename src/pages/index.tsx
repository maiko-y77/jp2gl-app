import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import { useExchangeRate } from "@/context/ExchangeRateContext";

export default function Home() {
  const exchangeRate = useExchangeRate();
  const categories = ["魚", "肉", "野菜", "フルーツ", "スイーツ"];
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
  const visibleProducts = products
    .filter((product) =>
      selectedCategories.length === 0
        ? true
        : selectedCategories.includes(product.category)
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchKeyword.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.priceJPY - b.priceJPY;
      if (sortOrder === "desc") return b.priceJPY - a.priceJPY;
      return 0;
    });

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const now = new Date();

      const data = querySnapshot.docs
        .map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            name: d.name,
            priceJPY: d.priceJPY,
            category: d.category,
            imageUrl: d.imageUrl,
            availableFrom: d.availableFrom,
            availableTo: d.availableTo,
          } as Product;
        })
        .filter((product) => {
          const from = product.availableFrom?.toDate?.() ?? new Date(0);
          const to = product.availableTo?.toDate?.() ?? new Date(9999, 11, 31);
          return from <= now && now <= to;
        });

      setProducts(data);
    };
    fetchData();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">商品一覧</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="商品名で検索"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full md:w-96 border px-4 py-2 rounded shadow-sm"
        />
        <h2 className="text-md font-semibold mb-2">カテゴリで絞り込み</h2>
        <div className="flex flex-wrap gap-4">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={cat}
                checked={selectedCategories.includes(cat)}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedCategories((prev) =>
                    prev.includes(value)
                      ? prev.filter((c) => c !== value)
                      : [...prev, value]
                  );
                }}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <label className="mr-2 text-sm font-medium">価格で並び替え:</label>
        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value as "asc" | "desc" | "none")
          }
          className="border px-2 py-1 rounded"
        >
          <option value="none">指定なし</option>
          <option value="asc">安い順</option>
          <option value="desc">高い順</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            priceJPY={product.priceJPY}
            category={product.category}
            priceCAD={Math.round(product.priceJPY * exchangeRate)}
            imageUrl={product.imageUrl}
          />
        ))}
      </div>
    </main>
  );
}
