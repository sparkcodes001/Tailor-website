import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export const useProductsByIds = (ids = []) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ids.length) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", ids);

      if (!isMounted) return;

      if (error || !data) {
        setProducts([]);
      } else {
        // preserve most-recently-viewed-first order
        setProducts(
          ids.map((id) => data.find((p) => p.id === id)).filter(Boolean),
        );
      }
      setLoading(false);
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ids)]);

  return { products, loading };
};
