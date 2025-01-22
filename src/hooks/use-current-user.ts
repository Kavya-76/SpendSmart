import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();

  // Return `null` while session is loading to prevent showing stale data
  if (status === "loading") {
    return null;
  }

  // Return the user once the session is fully resolved
  return session?.user || null;
};
