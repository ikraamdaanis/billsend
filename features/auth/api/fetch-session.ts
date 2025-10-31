import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "lib/auth";

export const fetchSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await auth.api.getSession({
      headers: getRequest().headers
    });

    if (!session) return null;

    const organizations = await auth.api.listOrganizations({
      headers: getRequest().headers
    });

    return { ...session.user, organizations };
  }
);
