import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function FirestoreTest() {
  const [products, setProducts] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const names = querySnapshot.docs.map((doc) => doc.id);
      setProducts(names);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Firestore接続テスト</h1>
      <ul className="list-disc pl-5">
        {products.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
