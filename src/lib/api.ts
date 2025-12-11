// src/lib/api.ts
export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function request<T>(path: string, opts: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${BASE}${path}`;
  const headers: Record<string,string> = { "Content-Type": "application/json" };
  if (opts.headers) Object.assign(headers, opts.headers as Record<string,string>);
  const final: RequestInit = { ...opts, headers };
  try {
    const res = await fetch(url, final);
    const text = await res.text();
    let body: any = null;
    try { body = text ? JSON.parse(text) : null; } catch(e){ body = text; }
    if (!res.ok) return { ok: false, error: (body && body.error) || res.statusText || "Request failed" };
    return { ok: true, data: body as T };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Network error" };
  }
}

export function post<T>(path: string, data: any) {
  return request<T>(path, { method: "POST", body: JSON.stringify(data) });
}
export function get<T>(path: string, token?: string) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return request<T>(path, { method: "GET", headers });
}
