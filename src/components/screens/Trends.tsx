import React, { useState } from "react";
import { Sparkles, TrendingUp } from "lucide-react";
import { AppleButton } from "../shared/AppleButton";
import { AppleCard } from "../shared/AppleCard";

const Trends: React.FC = () => {
  const [creatorType, setCreatorType] = useState("Content Creator");
  const [niche, setNiche] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["Instagram Reels"]);
  const [goal, setGoal] = useState("growth");
  const [trendsText, setTrendsText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePlatform = (platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleGenerateTrends = async () => {
    setLoading(true);
    setError(null);
    setTrendsText(null);

    try {
      const res = await fetch("http://localhost:5000/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorType,
          niche,
          platforms,
          goal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate trends");
      }

      setTrendsText(data.trends);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const platformOptions = ["Instagram Reels", "TikTok", "YouTube Shorts"];

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#1B1B1E] flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-[#007AFF]" />
              Trends AI
            </h1>
            <p className="text-sm text-[#63636A] mt-1">
              Get AI-generated ideas inspired by current short-form trends for your niche.
            </p>
          </div>
        </div>

        {/* Controls */}
        <AppleCard className="p-6 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#63636A] mb-1">
                Creator Type
              </label>
              <select
                value={creatorType}
                onChange={(e) => setCreatorType(e.target.value)}
                className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white"
              >
                <option>Food Vlogger</option>
                <option>Business Owner</option>
                <option>Content Creator</option>
                <option>Product Seller</option>
                <option>Chef</option>
                <option>Baker</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#63636A] mb-1">
                Main Niche
              </label>
              <input
                className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white"
                placeholder="e.g. premium fruit cakes, fitness coaching, skincare brand..."
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#63636A] mb-1">
                Content Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white"
              >
                <option value="growth">Grow followers</option>
                <option value="sales">Drive sales</option>
                <option value="engagement">Boost engagement</option>
                <option value="authority">Build authority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#63636A] mb-1">
              Platforms
            </label>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    platforms.includes(p)
                      ? "bg-[#007AFF] text-white border-[#007AFF]"
                      : "bg-white text-[#1B1B1E] border-[#E5E5E8]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
            <p className="text-xs text-[#8E8E95]">
              Trends AI suggests patterns & templates inspired by current short-form content – not
              exact live trending audio.
            </p>
            <AppleButton
              variant="primary"
              className="flex items-center gap-2"
              onClick={handleGenerateTrends}
              disabled={loading}
            >
              <Sparkles className="w-4 h-4" />
              {loading ? "Analyzing..." : "Generate Trend Ideas"}
            </AppleButton>
          </div>

          {error && (
            <p className="text-xs text-red-500 mt-2">
              {error}
            </p>
          )}
        </AppleCard>

        {/* Results */}
        {trendsText && (
          <AppleCard className="p-6">
            <h2 className="text-xl font-semibold text-[#1B1B1E] mb-3">
              Trend Ideas & Editing Templates
            </h2>
            <p className="text-xs text-[#8E8E95] mb-4">
              These are AI-generated ideas inspired by common patterns on {platforms.join(", ")}.
              Always adapt them to your brand and audience.
            </p>
            <div className="bg-[#F7F7F8] rounded-2xl p-4 text-sm whitespace-pre-wrap text-[#1B1B1E]">
              {trendsText}
            </div>
          </AppleCard>
        )}
      </div>
    </div>
  );
};

export default Trends;
