import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

export default function withAuth<P>(WrappedComponent: React.ComponentType<P>) {
  return function Protected(props: P) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setAuthenticated(true);
        } else {
          router.push("/login");
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }, [router]);

    if (loading) return <div className="p-6">確認中...</div>;
    if (!authenticated) return null;

    return <WrappedComponent {...props} />;
  };
}
