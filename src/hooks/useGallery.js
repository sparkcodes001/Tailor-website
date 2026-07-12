import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export const useGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setImages([]);
      } else {
        setImages(data || []);
      }
      setLoading(false);
    };

    fetchImages();
    return () => {
      isMounted = false;
    };
  }, []);

  return { images, loading, error };
};
