export function loadLocalDrafts(): any[] {
  try {
    const raw = localStorage.getItem("rf_local_drafts");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalDraft(draft: any) {
  const arr = loadLocalDrafts();
  arr.unshift(draft);
  localStorage.setItem("rf_local_drafts", JSON.stringify(arr.slice(0, 10))); // keep last 10
}

export function clearLocalDrafts() {
  localStorage.removeItem("rf_local_drafts");
}
