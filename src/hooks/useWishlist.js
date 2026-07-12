import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "grandeur-wishlist";

const getStored = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState(getStored);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist]);

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  return { wishlist, isWishlisted, toggleWishlist };
};
