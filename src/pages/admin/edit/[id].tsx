import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/types/product";
import withAuth from "@/lib/withAuth";
import Link from "next/link";
import { uploadImageToCloudinary } from "@/lib/uploadImage";

function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [nameEn, setNameEn] = useState("");
  const [nameJa, setNameJa] = useState("");
  const [priceJPY, setPriceJPY] = useState("");
  const [category, setCategory] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduct({ id: docSnap.id, ...data } as Product);
        setNameEn(data.nameEn || "");
        setNameJa(data.nameJa || "");
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

    let updatedImageUrl = product?.imageUrl || "";
    let updatedPublicId = product?.publicId || "";

    // 古い画像を削除
    if (imageFile && product?.publicId) {
      try {
        await fetch("/api/delete-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: product.publicId }),
        });
      } catch (err) {
        console.error("旧画像の削除に失敗", err);
      }
    }

    // 新しい画像をアップロード
    if (imageFile) {
      try {
        const result = await uploadImageToCloudinary(imageFile);
        updatedImageUrl = result.imageUrl;
        updatedPublicId = result.publicId;
      } catch (err) {
        console.error("画像アップロード失敗", err);
        alert("画像のアップロードに失敗しました");
        return;
      }
    }

    await updateDoc(docRef, {
      nameEn,
      nameJa,
      priceJPY: Number(priceJPY),
      category,
      description,
      availableFrom: Timestamp.fromDate(new Date(availableFrom)),
      availableTo: Timestamp.fromDate(new Date(availableTo)),
      imageUrl: updatedImageUrl,
      publicId: updatedPublicId,
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

          {product.imageUrl && !imagePreview && (
            <img
              src={product.imageUrl}
              alt="current"
              className="w-32 mb-2 rounded"
            />
          )}

          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="w-32 mb-2 rounded"
            />
          )}

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
        </div>

        <div>
          <label className="block text-sm font-medium">カテゴリ</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Seafoods/魚介">Seafoods/魚介</option>
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
