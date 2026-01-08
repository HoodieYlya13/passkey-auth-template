"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { toast } from "sonner";
import { useCommon } from "@/hooks/useCommon";

function ToastLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { commonT } = useCommon();

  useEffect(() => {
    const verified = searchParams.get("verified");
    const username = searchParams.get("username");

    if (verified === "true" && username) {
      toast.success(commonT("HELLO", username));

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("verified");
      newParams.delete("username");

      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, commonT, router]);

  return null;
}

export default function MagicLinkToast() {
  return (
    <Suspense fallback={null}>
      <ToastLogic />
    </Suspense>
  );
}
