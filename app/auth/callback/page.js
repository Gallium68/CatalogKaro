"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // The Supabase client automatically reads the login token from the URL
    // when it loads on this page. We just wait for the session, then continue.
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setErrorMsg("Your login link has expired or is invalid. Please try again.");
        setTimeout(() => router.push("/login"), 2500);
        return;
      }

      router.push("/dashboard");
    }

    checkSession();
  }, [router]);

  return (
    <div className="container" style={{ paddingTop: 100, textAlign: "center" }}>
      {errorMsg ? (
        <p style={{ color: "var(--danger)" }}>{errorMsg}</p>
      ) : (
        <p className="muted">Logging you in, one second...</p>
      )}
    </div>
  );
}
