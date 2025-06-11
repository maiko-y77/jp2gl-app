import Link from "next/link";

type ProductCardProps = {
  id: string;
  name: string;
  priceJPY: number;
  priceCAD: number;
  category: string;
};

export default function ProductCard({
  id,
  name,
  priceJPY,
  priceCAD,
  category,
}: ProductCardProps) {
  return (
    <div className="border p-4 rounded shadow-sm flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-600">カテゴリ: {category}</p>
        {/* <p className="text-sm font-bold text-blue-600 mt-1">
          ¥{priceJPY.toLocaleString()} JPY
        </p> */}
        <p className="text-sm text-green-600">${priceCAD.toFixed(2)} CAD</p>
      </div>
      <Link
        href={`/products/${id}`}
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded text-center hover:bg-blue-600"
      >
        詳細を見る
      </Link>
    </div>
  );
}
