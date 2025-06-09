// src/components/ProductCard.tsx

type ProductCardProps = {
  name: string;
  priceJPY: number;
  priceCAD: number;
  category: string;
};

export default function ProductCard({
  name,
  priceJPY,
  priceCAD,
  category,
}: ProductCardProps) {
  return (
    <div className="border p-4 rounded shadow-sm">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm text-gray-600">カテゴリ: {category}</p>
      <p className="text-sm mt-1 font-bold text-blue-600">
        ¥{priceJPY.toLocaleString()} JPY
      </p>
      <p className="text-sm text-green-600">${priceCAD.toFixed(2)} CAD</p>
    </div>
  );
}
