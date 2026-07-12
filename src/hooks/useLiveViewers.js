import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

// Per-tab anonymous id — so one visitor with 2 tabs open doesn't count twice
const getSessionId = () => {
  let sid = sessionStorage.getItem("grandeur-session-id");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("grandeur-session-id", sid);
  }
  return sid;
};

export const useLiveViewers = (productId) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!productId) return;

    const channel = supabase.channel(`product-viewers-${productId}`, {
      config: { presence: { key: getSessionId() } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        setCount(Object.keys(channel.presenceState()).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId]);

  return count;
};
