"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleEmailLogin(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: 80 }}>
      <Link href="/" className="brand" style={{ marginBottom: 32, display: "inline-flex" }}>
        CatalogKaro<span className="brand-dot">.</span>
      </Link>

      <div className="card">
        <h2>Log in or sign up</h2>
        <p className="muted" style={{ marginBottom: 24 }}>
          A new account is created automatically the first time you log in.
        </p>

        <button onClick={handleGoogleLogin} className="btn btn-outline" style={{ width: "100%", marginBottom: 20 }}>
          Continue with Google
        </button>

        <div style={{ textAlign: "center", color: "var(--ink-soft)", fontSize: 13, margin: "4px 0 20px" }}>
          or with email
        </div>

        {status === "sent" ? (
          <p style={{ color: "var(--leaf-dark)", fontWeight: 500 }}>
            We've sent a link to {email}. Check your inbox and click the link to log in.
          </p>
        ) : (
          <form onSubmit={handleEmailLogin}>
            <div className="field">
              <label className="label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                required
                className="input"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {status === "error" && (
              <p style={{ color: "var(--danger)", fontSize: 13, marginBottom: 14 }}>{errorMsg}</p>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send login link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
