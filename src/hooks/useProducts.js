import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

// ── Single product by id ──────────────────────────
export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setProduct(null);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  return { product, loading, error };
};

// ── Full list, optional featured filter ──────────
export const useProducts = ({ featuredOnly = false } = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (featuredOnly) {
        query = query.eq("featured", true);
      }

      const { data, error: fetchError } = await query;

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [featuredOnly]);

  return { products, loading, error };
};
