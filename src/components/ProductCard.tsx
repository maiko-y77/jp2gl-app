import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  id: string;
  nameEn: string;
  nameJa: string;
  priceCAD: number;
  category: string;
  imageUrl?: string;
};

export default function ProductCard({
  id,
  nameEn,
  nameJa,
  priceCAD,
  category,
  imageUrl,
}: ProductCardProps) {
  return (
    <div className="border p-4 rounded shadow-sm flex flex-col justify-between">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={nameEn}
          width={300}
          height={200}
          className="w-full h-48 object-cover mb-2 rounded"
        />
      )}
      <div>
        <h2 className="text-lg font-semibold">
          {nameEn} / {nameJa}
        </h2>

        <p className="text-sm text-gray-600">Category: {category}</p>
        {/* <p className="text-sm font-bold text-blue-600 mt-1">
          ¥{priceJPY.toLocaleString()} JPY
        </p> */}
        <p className="text-sm text-green-600">${priceCAD.toFixed(2)} CAD</p>
      </div>
      <Link
        href={`/products/${id}`}
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded text-center hover:bg-blue-600"
      >
        View Details
      </Link>
    </div>
  );
}
