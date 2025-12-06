import React, { useState } from "react";
import { apiBase, saveAuth } from "../../services/authService";

function isValidEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

function isStrongPassword(pw: string) {
  const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return re.test(pw);
}

export default function Signup({ onSigned }: { onSigned?: (user:any)=>void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter your name.");
    if (!isValidEmail(email)) return setError("Please enter a valid email address.");
    if (!isStrongPassword(password))
      return setError("Password must be at least 8 characters and include a symbol and a number.");

    setLoading(true);
    try {
      // collect local drafts/projects from localStorage (if any)
      let localDrafts = [];
      try {
        const raw = localStorage.getItem("rf_local_drafts");
        if (raw) localDrafts = JSON.parse(raw);
      } catch (e) {
        console.warn("rf_local_drafts parse error", e);
        localDrafts = [];
      }

      const res = await fetch(`${apiBase}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, localDrafts }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      // Save auth token + user locally
      saveAuth(data.token, data.user);

      // Clear local drafts now that server owns them (optional)
      localStorage.removeItem("rf_local_drafts");

      if (onSigned) onSigned(data.user);
    } catch (err:any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Create your ReelForge account</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="w-full p-2 border rounded"/>
        <input required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded"/>
        <input required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded"/>
        <div className="text-xs text-gray-500">
          Password must be at least 8 characters and include a number and a symbol.
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading? "..." : "Create account"}</button>
      </form>
    </div>
  );
}
