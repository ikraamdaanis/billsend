import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { sessionQuery } from "feature/auth/queries/session-query";
import { authClient } from "lib/auth-client";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await authClient.signOut({
        fetchOptions: {
          onResponse: async () => {
            // manually set to null to avoid unnecessary refetching
            queryClient.setQueryData(sessionQuery().queryKey, null);
            await router.invalidate();
          }
        }
      });
    }
  });
}
