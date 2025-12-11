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
    if (!name.trim()) return setError("Enter name");
    if (!isValidEmail(email)) return setError("Enter a valid email");
    if (!isStrongPassword(password)) return setError("Password must be min 8 chars and include a symbol and number");

    setLoading(true);
    try {
      const rawDrafts = localStorage.getItem("rf_local_drafts");
      const localDrafts = rawDrafts ? JSON.parse(rawDrafts) : [];

      const res = await fetch(`${apiBase}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, localDrafts }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      saveAuth(data.token, data.user);
      // clear local drafts now that server owns them
      localStorage.removeItem("rf_local_drafts");
      if (onSigned) onSigned(data.user);
    } catch (err:any) {
      setError(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Create Account</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="w-full p-2 border rounded"/>
        <input required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded"/>
        <input required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded"/>
        <div className="text-xs text-gray-500">
          Password must be at least 8 characters and include a number and a symbol.
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? "..." : "Create account"}</button>
      </form>
    </div>
  );
}
