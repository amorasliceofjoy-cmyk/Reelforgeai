import React, { useState, useEffect } from "react";
import { Sparkles, Upload as UploadIcon, Trash2, Edit2 } from "lucide-react";
import { AppleButton } from "../shared/AppleButton";
import { AppleCard } from "../shared/AppleCard";

type Trend = {
  id: string;
  title: string;
  platform: string;
  niche: string;
  hookType: string;
  description: string;
  editingTemplate: string;
  captionExample: string;
  hashtags: string;
  soundType: string;
  status: string;
  sourceUrl?: string;
  createdAt: string;
};

const PLATFORM_OPTIONS = [
  "Instagram Reels",
  "TikTok",
  "YouTube Shorts",
  "Other",
];

const HOOK_TYPES = [
  "POV",
  "Question",
  "Storytime",
  "Before / After",
  "Transformation",
  "Tutorial",
  "Relatable Meme",
];

const SOUND_TYPES = [
  "Beat Drop",
  "Chill Lo-fi",
  "Cinematic",
  "Voiceover Only",
  "Dialogue / Lip Sync",
];

const STATUS_OPTIONS = ["Rising", "Viral", "Evergreen", "Testing"];

const AdminTrendUpload: React.FC = () => {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("Instagram Reels");
  const [niche, setNiche] = useState("");
  const [hookType, setHookType] = useState("POV");
  const [description, setDescription] = useState("");
  const [editingTemplate, setEditingTemplate] = useState("");
  const [captionExample, setCaptionExample] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [soundType, setSoundType] = useState("Beat Drop");
  const [status, setStatus] = useState("Rising");
  const [sourceUrl, setSourceUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [localTrends, setLocalTrends] = useState<Trend[]>([]);

  // NEW: track which trend we are editing
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load existing trends from backend
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoadingTrends(true);
        const res = await fetch("http://localhost:5000/api/manual-trends");
        const data = await res.json();
        setLocalTrends(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setErrorMessage("Failed to load existing trends.");
      } finally {
        setLoadingTrends(false);
      }
    };

    fetchTrends();
  }, []);

  const resetForm = () => {
    setTitle("");
    setPlatform("Instagram Reels");
    setNiche("");
    setHookType("POV");
    setDescription("");
    setEditingTemplate("");
    setCaptionExample("");
    setHashtags("");
    setSoundType("Beat Drop");
    setStatus("Rising");
    setSourceUrl("");
    setEditingId(null);
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setErrorMessage(null);
  setSuccessMessage(null);

  if (!title.trim() || !description.trim() || !editingTemplate.trim()) {
    setErrorMessage(
      "Please fill at least title, description and editing template."
    );
    return;
  }

  setSaving(true);

  try {
    const payload: any = {
      title,
      platform,
      niche,
      hookType,
      description,
      editingTemplate,
      captionExample,
      hashtags,
      soundType,
      status,
      sourceUrl,
    };

    if (editingId) {
      payload.id = editingId;
    }

    const url = "http://localhost:5000/api/manual-trends";
    console.log(editingId ? "POST update URL:" : "POST create URL:", url);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text(); // read as text first
    let data: any = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch (parseErr) {
      console.error("JSON parse error. Raw response:", text);
      throw new Error("Server did not return valid JSON.");
    }

    if (!res.ok) {
      throw new Error(data?.error || "Failed to save trend");
    }

    if (editingId) {
      setLocalTrends((prev) => prev.map((t) => (t.id === editingId ? data : t)));
      setSuccessMessage("Trend updated ✅");
    } else {
      setLocalTrends((prev) => [data, ...prev]);
      setSuccessMessage("Trend saved ✅");
    }

    resetForm();
  } catch (err: any) {
    console.error(err);
    setErrorMessage(err.message || "Something went wrong while saving.");
  } finally {
    setSaving(false);
  }
};


  // NEW: start editing an existing card
  const handleEditClick = (trend: Trend) => {
    setEditingId(trend.id);
    setTitle(trend.title);
    setPlatform(trend.platform);
    setNiche(trend.niche);
    setHookType(trend.hookType || "POV");
    setDescription(trend.description);
    setEditingTemplate(trend.editingTemplate);
    setCaptionExample(trend.captionExample || "");
    setHashtags(trend.hashtags || "");
    setSoundType(trend.soundType || "Beat Drop");
    setStatus(trend.status || "Rising");
    setSourceUrl(trend.sourceUrl || "");
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  // NEW: delete trend
  const handleDeleteClick = async (id: string) => {
    const confirmDelete = window.confirm(
      "Delete this trend permanently from this session?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/manual-trends/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete trend");
      }

      setLocalTrends((prev) => prev.filter((t) => t.id !== id));

      // if we were editing this one, reset form
      if (editingId === id) {
        resetForm();
      }

      setSuccessMessage("Trend deleted 🗑️");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to delete trend.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#1B1B1E] flex items-center gap-2">
              <UploadIcon className="w-7 h-7 text-[#007AFF]" />
              Admin · {editingId ? "Edit Trend" : "Upload Trend"}
            </h1>
            <p className="text-sm text-[#63636A] mt-1">
              {editingId
                ? "Update a saved trend template."
                : "Manually add trends you discover on Instagram / TikTok so creators can reuse them."}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-[#8E8E95]">
            <Sparkles className="w-4 h-4 text-[#007AFF]" />
            <span>Step 1: Build your curated trend library</span>
          </div>
        </div>

        {/* Form */}
        <AppleCard className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Top row: title + platform + status */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#63636A] mb-1">
                  Trend Title
                </label>
                <input
                  className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white"
                  placeholder="e.g. POV: Before vs After Reaction"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#63636A] mb-1">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white"
                >
                  {PLATFORM_OPTIONS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#63636A] mb-1">
                  Trend Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Niche + Hook type + Sound type */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#63636A] mb-1">
                  Niche
                </label>
                <input
                  className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white"
                  placeholder="e.g. premium fruit cakes, fitness coaching, skincare brand"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#63636A] mb-1">
                  Hook Type
                </label>
                <select
                  value={hookType}
                  onChange={(e) => setHookType(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white"
                >
                  {HOOK_TYPES.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#63636A] mb-1">
                  Sound Type
                </label>
                <select
                  value={soundType}
                  onChange={(e) => setSoundType(e.target.value)}
                  className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white"
                >
                  {SOUND_TYPES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Source URL */}
            <div>
              <label className="block text-xs font-semibold text-[#63636A] mb-1">
                Source URL (optional)
              </label>
              <input
                className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white"
                placeholder="Paste the reel / TikTok link here (for your reference only)"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#63636A] mb-1">
                Trend Description (what happens in the video)
              </label>
              <textarea
                className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white min-h-[90px]"
                placeholder="Example: Split screen: left shows 'old you', right shows 'new you' with a quick reveal at the beat drop..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Editing Template */}
            <div>
              <label className="block text-xs font-semibold text-[#63636A] mb-1">
                Editing Template (step-by-step)
              </label>
              <textarea
                className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white min-h-[120px]"
                placeholder={`Example:
0–2s: Hook text appears with close-up shot
2–5s: Show problem / before
5–9s: Show transition synced to beat drop
9–12s: Show 'after' + reaction
12–15s: Add CTA text overlay at bottom`}
                value={editingTemplate}
                onChange={(e) => setEditingTemplate(e.target.value)}
              />
            </div>

            {/* Caption + Hashtags */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#63636A] mb-1">
                  Caption Example
                </label>
                <textarea
                  className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white min-h-[80px]"
                  placeholder="Example: 'POV: You finally stop guessing and start using a system that actually works. 👀✨ #yourhashtag'"
                  value={captionExample}
                  onChange={(e) => setCaptionExample(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#63636A] mb-1">
                  Hashtags (comma or space separated)
                </label>
                <textarea
                  className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white min-h-[80px]"
                  placeholder="#trend #beforeafter #yourbrand #yourkeyword"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                />
              </div>
            </div>

            {/* Messages + Submit */}
            {errorMessage && (
              <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="text-xs text-[#0F5132] bg-[#D1E7DD] border border-[#BADBCC] rounded-lg px-3 py-2">
                {successMessage}
              </div>
            )}

            <div className="flex justify-between items-center gap-3">
              {editingId && (
                <button
                  type="button"
                  className="text-xs text-[#8E8E95] underline"
                  onClick={resetForm}
                >
                  Cancel editing
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <AppleButton
                  variant="primary"
                  className="flex items-center gap-2"
                  type="submit"
                  disabled={saving}
                >
                  <UploadIcon className="w-4 h-4" />
                  {saving
                    ? editingId
                      ? "Updating..."
                      : "Saving..."
                    : editingId
                    ? "Update Trend"
                    : "Save Trend"}
                </AppleButton>
              </div>
            </div>
          </form>
        </AppleCard>

        {/* Local preview of recently added trends */}
        <AppleCard className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#1B1B1E]">
              Saved Trends (this session)
            </h2>
            {loadingTrends && (
              <span className="text-xs text-[#8E8E95]">Loading…</span>
            )}
          </div>
          {localTrends.length === 0 ? (
            <p className="text-xs text-[#8E8E95]">
              No trends saved yet. Add your first one above.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localTrends.map((trend) => (
                <div
                  key={trend.id}
                  className="border border-[#E5E5E8] rounded-xl bg-white p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm text-[#1B1B1E]">
                        {trend.title}
                      </h3>
                      <p className="text-[11px] text-[#63636A] line-clamp-2 mt-1">
                        {trend.description}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F7F7F8] text-[#63636A]">
                      {trend.platform}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#8E8E95]">
                    <span>{trend.niche || "No niche set"}</span>
                    <span>{trend.status}</span>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-[11px] text-[#007AFF]"
                      onClick={() => handleEditClick(trend)}
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-[11px] text-red-500"
                      onClick={() => handleDeleteClick(trend.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AppleCard>
      </div>
    </div>
  );
};

export default AdminTrendUpload;
