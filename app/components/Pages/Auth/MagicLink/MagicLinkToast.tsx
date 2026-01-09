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
    const username = searchParams.get("username");

    if (username) {
      toast.success(commonT("HELLO", username));

      const newParams = new URLSearchParams(searchParams.toString());
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
