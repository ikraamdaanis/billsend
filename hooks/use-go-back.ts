import { useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
import type { ValidRoute } from "types";

export function useGoBack({ to }: { to: ValidRoute }) {
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();

  return {
    goBack: () => {
      if (canGoBack) {
        router.history.back();
      } else {
        navigate({ to });
      }
    }
  };
}
