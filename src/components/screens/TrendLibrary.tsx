import React, { useState, useMemo, useEffect } from "react";
import { Search, Sparkles, PlayCircle } from "lucide-react";
import { AppleCard } from "../shared/AppleCard";
import { AppleButton } from "../shared/AppleButton";

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

type TrendLibraryProps = {
  onUseTemplate?: (trend: Trend) => void;
};

const TrendLibrary: React.FC<TrendLibraryProps> = ({ onUseTemplate }) => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [nicheFilter, setNicheFilter] = useState<string>("");

  // ✅ Fetch from backend on mount
useEffect(() => {
  const fetchTrends = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/api/manual-trends");
      const text = await res.text();
      let data: any = null;

      try {
        data = text ? JSON.parse(text) : [];
      } catch (parseErr) {
        console.error("TrendLibrary JSON parse error. Raw:", text);
        throw new Error("Server did not return valid JSON.");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load trends");
      }

      setTrends(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load trends");
    } finally {
      setLoading(false);
    }
  };

  fetchTrends();
}, []);

  const filteredTrends = useMemo(() => {
    return trends.filter((trend) => {
      const matchesSearch =
        !search.trim() ||
        trend.title.toLowerCase().includes(search.toLowerCase()) ||
        trend.description.toLowerCase().includes(search.toLowerCase()) ||
        trend.niche.toLowerCase().includes(search.toLowerCase());

      const matchesPlatform =
        platformFilter === "All" || trend.platform === platformFilter;

      const matchesStatus =
        statusFilter === "All" || trend.status === statusFilter;

      const matchesNiche =
        !nicheFilter.trim() ||
        trend.niche.toLowerCase().includes(nicheFilter.toLowerCase());

      return (
        matchesSearch &&
        matchesPlatform &&
        matchesStatus &&
        matchesNiche
      );
    });
  }, [trends, search, platformFilter, statusFilter, nicheFilter]);

  const platformOptions = [
    "All",
    "Instagram Reels",
    "TikTok",
    "YouTube Shorts",
    "Other",
  ];
  const statusOptions = ["All", "Rising", "Viral", "Evergreen", "Testing"];

  const handleUseTemplateNow = (trend: Trend) => {
  if (typeof onUseTemplate === "function") {
    onUseTemplate(trend);
  } else {
    console.warn("onUseTemplate is not provided. Trend:", trend);
  }
};

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-semibold text-[#1B1B1E] flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-[#007AFF]" />
              Trend Library
            </h1>
            <p className="text-sm text-[#63636A] mt-1">
              Browse curated short-form trends with ready-to-use editing templates.
            </p>
          </div>
          {loading && (
            <span className="text-xs text-[#8E8E95]">Loading trends…</span>
          )}
        </div>

        {/* Filters */}
        <AppleCard className="p-5 space-y-4">
          <div className="grid md:grid-cols-[2fr,1fr,1fr] gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#63636A] mb-1">
                Search trends
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#8E8E95] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  className="w-full rounded-lg border border-[#E5E5E8] pl-9 pr-3 py-2 text-sm bg-white"
                  placeholder="Search by title, description or niche..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#63636A] mb-1">
                Platform
              </label>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white"
              >
                {platformOptions.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#63636A] mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white"
              >
                {statusOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#63636A] mb-1">
              Filter by niche
            </label>
            <input
              className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white"
              placeholder="e.g. premium fruit cakes, fitness, skincare, coaching..."
              value={nicheFilter}
              onChange={(e) => setNicheFilter(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-[11px] text-red-500">
              {error}
            </p>
          )}

          <p className="text-[11px] text-[#8E8E95]">
            These trends are manually curated. You can send any template directly into AI
            Draft using the button on each card.
          </p>
        </AppleCard>

        {/* Trend Cards */}
        {filteredTrends.length === 0 && !loading ? (
          <div className="text-center text-sm text-[#8E8E95] mt-6">
            No trends match your filters yet. Try clearing search or add trends in the
            Admin section.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {filteredTrends.map((trend) => (
              <AppleCard
                key={trend.id}
                className="p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-semibold text-[#1B1B1E]">
                      {trend.title}
                    </h2>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F7F7F8] text-[#63636A]">
                        {trend.platform}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E5F5FF] text-[#007AFF]">
                        {trend.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#63636A] line-clamp-3">
                    {trend.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px] text-[#8E8E95]">
                    {trend.niche && (
                      <span className="px-2 py-0.5 rounded-full bg-[#F7F7F8]">
                        {trend.niche}
                      </span>
                    )}
                    {trend.hookType && (
                      <span className="px-2 py-0.5 rounded-full bg-[#F7F7F8]">
                        Hook: {trend.hookType}
                      </span>
                    )}
                    {trend.soundType && (
                      <span className="px-2 py-0.5 rounded-full bg-[#F7F7F8]">
                        Sound: {trend.soundType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <details className="text-xs text-[#63636A]">
                    <summary className="cursor-pointer text-[#007AFF] font-medium">
                      View editing template
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap text-[11px] bg-[#F7F7F8] rounded-lg p-2">
                      {trend.editingTemplate}
                    </pre>
                  </details>

                  {trend.captionExample && (
                    <details className="text-xs text-[#63636A]">
                      <summary className="cursor-pointer text-[#007AFF] font-medium">
                        View caption & hashtags
                      </summary>
                      <div className="mt-2 space-y-2 bg-[#F7F7F8] rounded-lg p-2">
                        <p className="text-[11px] text-[#1B1B1E]">
                          {trend.captionExample}
                        </p>
                        {trend.hashtags && (
                          <p className="text-[10px] text-[#63636A]">
                            {trend.hashtags}
                          </p>
                        )}
                      </div>
                    </details>
                  )}

                  <div className="flex justify-between items-center">
                    {trend.sourceUrl ? (
                      <a
                        href={trend.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#007AFF]"
                      >
                        <PlayCircle className="w-3 h-3" />
                        View reference reel
                      </a>
                    ) : (
                      <span className="text-[10px] text-[#8E8E95]">
                        No source link saved
                      </span>
                    )}

                    <AppleButton
                      variant="secondary"
                      className="px-3 py-1 h-auto text-[11px]"
                      onClick={() => handleUseTemplateNow(trend)}
                    >
                      Use this template
                    </AppleButton>
                  </div>
                </div>
              </AppleCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendLibrary;
