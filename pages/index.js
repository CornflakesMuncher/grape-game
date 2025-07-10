// pages/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const playerId = localStorage.getItem("playerId");
    if (playerId) {
      router.replace("/hub");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
