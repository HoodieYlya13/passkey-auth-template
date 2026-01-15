"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { toast } from "sonner";
import { useCommon } from "@/hooks/useCommon";
import { useErrors } from "@/hooks/useErrors";

function ToastLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { commonT } = useCommon();
  const { errorT } = useErrors();

  useEffect(() => {
    const username = searchParams.get("username");
    const error = searchParams.get("error");

    if (username || error) {
      if (username) toast.success(commonT("HELLO", username));

      if (error) toast.error(errorT(error));

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("username");
      newParams.delete("error");

      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [searchParams, commonT, errorT, router]);

  return null;
}

export default function QueryParamsToast() {
  return (
    <Suspense fallback={null}>
      <ToastLogic />
    </Suspense>
  );
}
