import { useEffect, useState } from "react";

const STORAGE_KEY = "grandeur-recently-viewed";
const MAX_ITEMS = 8;

const getStored = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const useRecentlyViewed = (currentProductId) => {
  const [ids, setIds] = useState(getStored);

  useEffect(() => {
    if (!currentProductId) return;
    setIds((prev) => {
      const next = [
        currentProductId,
        ...prev.filter((id) => id !== currentProductId),
      ].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, [currentProductId]);

  return ids.filter((id) => id !== currentProductId);
};
