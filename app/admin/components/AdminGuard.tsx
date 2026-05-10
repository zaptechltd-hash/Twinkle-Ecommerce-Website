"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "../../utils/token";

function decodeJwtPayload(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    const payload = decodeJwtPayload(token);

    const isAdmin = payload?.role === "admin";

    if (!isAdmin) {
      router.replace("/admin/login");
      return;
    }

    setAllowed(true);
  }, [router]);

  if (!allowed) return null;
  return <>{children}</>;
}