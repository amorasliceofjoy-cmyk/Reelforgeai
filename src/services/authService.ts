// authService.ts
export const apiBase = "http://localhost:5000";

export function saveAuth(token: string, user: any) {
  localStorage.setItem("rf_token", token);
  localStorage.setItem("rf_user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("rf_token");
  localStorage.removeItem("rf_user");
}

export function getAuthToken(): string | null {
  return localStorage.getItem("rf_token");
}

export function getCurrentUser(): any | null {
  const u = localStorage.getItem("rf_user");
  return u ? JSON.parse(u) : null;
}

export async function fetchMe(token: string) {
  const res = await fetch(`${apiBase}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}
