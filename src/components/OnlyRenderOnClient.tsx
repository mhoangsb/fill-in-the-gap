"use client";

import { useEffect, useState } from "react";

/**
 * Prevent children from rendering on the server
 *
 * Usage: to prevent hyration issue when children (a client component) return
 * different markup between rendering on the server and on the client
 */
export default function OnlyRenderOnClient({ children }: { children: React.ReactNode }) {
  const [isOnClient, setIsOnClient] = useState(false);

  useEffect(() => {
    setIsOnClient(true);
  }, []);

  if (!isOnClient) {
    return null;
  }

  return children;
}
