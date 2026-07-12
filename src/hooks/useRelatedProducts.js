import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export const useRelatedProducts = (category, excludeId, limit = 4) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category || !excludeId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchRelated = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .neq("id", excludeId)
        .limit(limit);

      if (!isMounted) return;
      setProducts(error ? [] : data || []);
      setLoading(false);
    };

    fetchRelated();
    return () => {
      isMounted = false;
    };
  }, [category, excludeId, limit]);

  return { products, loading };
};
