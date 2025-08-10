"use client";

import { useEffect, useState } from "react";

interface MockProviderProps {
  children: React.ReactNode;
}

export function MockProvider({ children }: MockProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const initWorker = async () => {
        const { worker } = await import("@/mock/browser");
        await worker.start();
        setIsReady(true);
      };
      initWorker();
    } else {
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
