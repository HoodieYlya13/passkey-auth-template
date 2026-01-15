"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({ error }: { error: Error }) {
  const router = useRouter();

  useEffect(() => {
    console.error("Error 404:", error);
    router.replace("/");
  }, [error, router]);

  return null;
}
