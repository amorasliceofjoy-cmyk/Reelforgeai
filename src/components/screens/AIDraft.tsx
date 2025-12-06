import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Check } from "lucide-react";
import { AppleButton } from "../shared/AppleButton";
import { AppleCard } from "../shared/AppleCard";

type AIDraftProps = {
  initialCategory?: string | null;
  initialTrend?: any; // comes from App.tsx
};

type HookOption = {
  id: string;
  label: string;
  title: string;
  text: string;
  engagement: string; // "92%"
  color: string;
};

const DEFAULT_HOOKS: HookOption[] = [
  {
    id: "hook1",
    label: "Story",
    title: "This almost failed…",
    text: "I was about to give up on this idea until I tried this one tiny change.",
    engagement: "92%",
    color: "#007AFF",
  },
  {
    id: "hook2",
    label: "Secret",
    title: "Nobody talks about this…",
    text: "The secret ingredient that completely changes how your results look on camera.",
    engagement: "88%",
    color: "#34C759",
  },
  {
    id: "hook3",
    label: "Curiosity",
    title: "Watch this twice…",
    text: "You’ll only spot the difference on the second watch – and that’s the whole point.",
    engagement: "85%",
    color: "#FF9500",
  },
];

const AIDraft: React.FC<AIDraftProps> = ({ initialCategory , initialTrend }) => {
  const [creatorType, setCreatorType] = useState("Content Creator");
  const [length, setLength] = useState("30s");
  const [description, setDescription] = useState("");
  const [draft, setDraft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [hooks] = useState<HookOption[]>(DEFAULT_HOOKS);
  const [selectedHook, setSelectedHook] = useState<string>(DEFAULT_HOOKS[0].id);

  // ✅ This will run when initialCategory changes and pre-fill things
  useEffect(() => {
    if (initialCategory) {
      setCreatorType(initialCategory); // will match the dropdown label
      if (!description) {
        setDescription(
          `Create a reel idea for a ${initialCategory} account. Focus on something engaging and visual.`
        );
      }
    }
    // we intentionally don't add `description` to the dependency array
    // to avoid constantly overwriting user's input
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCategory]);

  const handleGenerate = async () => {
    if (!description.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/ai-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorType,
          length,
          description,
          category: initialCategory ?? creatorType,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate draft");
      }

      const data = await res.json();
      setDraft(data.draft);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleAccept = () => {
    if (draft) {
      alert("Draft accepted ✅ (later we can send this to Editor screen)");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E5E8]">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#1B1B1E] flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-[#007AFF]" />
              AI Draft Ready
            </h1>
            <p className="text-[#63636A] mt-1">
              Review your AI-generated reel draft
            </p>

            {/* Meta controls */}
            <div className="mt-4 flex flex-wrap gap-3 items-center">
              <select
                value={creatorType}
                onChange={(e) => setCreatorType(e.target.value)}
                className="rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white"
              >
                <option>Food Vlogger</option>
                <option>Business Owner</option>
                <option>Content Creator</option>
                <option>Product Seller</option>
                <option>Chef</option>
                <option>Baker</option>
              </select>

              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="rounded-lg border border-[#E5E5E8] px-3 py-2 text-sm bg-white"
              >
                <option>6s</option>
                <option>15s</option>
                <option>30s</option>
                <option>45s</option>
                <option>60s</option>
              </select>

              <div className="flex-1 min-w-[220px]">
                <textarea
                  className="w-full rounded-lg border border-[#E5E5E8] px-3 py-2 text-xs bg-white"
                  placeholder="Describe your reel idea here, then click Regenerate to get a fresh AI draft..."
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 mt-2">
                {error}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <AppleButton
              variant="secondary"
              className="flex items-center gap-2"
              onClick={handleRegenerate}
              //disabled={loading || !description.trim()}
            >
              <RefreshCw className="w-4 h-4" />
              {loading ? "Generating..." : "Regenerate"}
            </AppleButton>
            <AppleButton
              variant="primary"
              className="flex items-center gap-2"
              onClick={handleAccept}
              disabled={!draft}
            >
              <Check className="w-4 h-4" />
              Accept Draft
            </AppleButton>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Left: Hook Selection & Timeline */}
          <div className="space-y-6">
            {/* Hook Cards */}
            <div>
              <h2 className="text-xl font-semibold text-[#1B1B1E] mb-4">
                Choose Your Hook
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {hooks.map((hook) => (
                  <AppleCard
                    key={hook.id}
                    hover
                    className={`p-6 cursor-pointer border-2 transition-all ${
                      selectedHook === hook.id
                        ? "border-[#007AFF] shadow-md"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedHook(hook.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: hook.color }}
                      >
                        {hook.label}
                      </span>
                      {selectedHook === hook.id && (
                        <div className="w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-[#1B1B1E] mb-2">
                      {hook.title}
                    </h4>
                    <p className="text-[#63636A] text-sm mb-4 italic">
                      "{hook.text}"
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#F7F7F8] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: hook.color,
                            width: hook.engagement,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-[#63636A]">
                        {hook.engagement}
                      </span>
                    </div>
                  </AppleCard>
                ))}
              </div>
            </div>

            {/* Timeline Preview */}
            <AppleCard className="p-8">
              <h2 className="text-xl font-semibold text-[#1B1B1E] mb-4">
                Timeline Preview
              </h2>
              <div className="space-y-4">
                {/* Video Track */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#63636A]">
                      Video Track
                    </span>
                    <span className="text-sm text-[#8E8E95]">
                      {length}
                    </span>
                  </div>
                  <div className="h-16 bg-[#F7F7F8] rounded-xl flex items-stretch gap-1 p-1">
                    <div className="flex-[3] bg-[#007AFF]/20 rounded-lg" />
                    <div className="flex-[7] bg-[#34C759]/20 rounded-lg" />
                    <div className="flex-[2] bg-[#FF9500]/20 rounded-lg" />
                  </div>
                </div>

                {/* Text Track */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#63636A]">
                      Text Overlays
                    </span>
                  </div>
                  <div className="h-12 bg-[#F7F7F8] rounded-xl flex items-stretch gap-1 p-1">
                    <div className="flex-[2] bg-transparent" />
                    <div className="flex-[4] bg-[#1B1B1E]/20 rounded-lg" />
                    <div className="flex-[2] bg-transparent" />
                    <div className="flex-[4] bg-[#1B1B1E]/20 rounded-lg" />
                  </div>
                </div>

                {/* Audio Track */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#63636A]">
                      Background Music
                    </span>
                  </div>
                  <div className="h-12 bg-[#F7F7F8] rounded-xl flex items-center px-4">
                    <div className="flex-1 flex items-center gap-1">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-[#007AFF]/30 rounded-full"
                          style={{ height: `${20 + Math.random() * 80}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AppleCard>
          </div>

          {/* Right: Caption & Suggestions */}
          <div className="space-y-6">
            {/* Captions */}
            <AppleCard className="p-6">
              <h3 className="font-semibold text-[#1B1B1E] mb-4">
                Generated Caption
              </h3>
              <div className="p-4 bg-[#F7F7F8] rounded-xl mb-4">
                <p className="text-[#1B1B1E] mb-3">
                  {draft
                    ? draft
                    : "✨ Your AI caption + script will appear here after you describe your idea above and click Regenerate."}
                </p>
                <p className="text-sm text-[#63636A]">
                  Character count: {draft ? draft.length : 0}/2200
                </p>
              </div>
              <AppleButton variant="secondary" className="w-full">
                Edit Caption
              </AppleButton>
            </AppleCard>

            {/* Hashtags */}
            <AppleCard className="p-6">
              <h3 className="font-semibold text-[#1B1B1E] mb-4">
                Suggested Hashtags
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "#transformation",
                  "#beforeafter",
                  "#resultsdriven",
                  "#secretingredient",
                  "#reelstips",
                  "#contentcreator",
                  "#viralreel",
                  "#shortformvideo",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-[#007AFF]/10 text-[#007AFF] rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </AppleCard>

            {/* Thumbnail Suggestions */}
            <AppleCard className="p-6">
              <h3 className="font-semibold text-[#1B1B1E] mb-4">
                Thumbnail Options
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((thumb) => (
                  <div
                    key={thumb}
                    className="aspect-video bg-gradient-to-br from-[#007AFF]/10 to-[#339AFF]/5 rounded-lg border-2 border-transparent hover:border-[#007AFF] cursor-pointer transition-all"
                  >
                    <div className="w-full h-full flex items-center justify-center text-sm text-[#8E8E95]">
                      Frame {thumb}
                    </div>
                  </div>
                ))}
              </div>
            </AppleCard>

            {/* Performance Prediction */}
            <AppleCard className="p-6">
              <h3 className="font-semibold text-[#1B1B1E] mb-4">
                Performance Prediction
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#63636A]">
                      Viral Potential
                    </span>
                    <span className="text-sm font-medium text-[#34C759]">
                      High
                    </span>
                  </div>
                  <div className="h-2 bg-[#F7F7F8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#34C759] rounded-full"
                      style={{ width: "82%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#63636A]">
                      Engagement Score
                    </span>
                    <span className="text-sm font-medium text-[#007AFF]">
                      8.7/10
                    </span>
                  </div>
                  <div className="h-2 bg-[#F7F7F8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#007AFF] rounded-full"
                      style={{ width: "87%" }}
                    />
                  </div>
                </div>
              </div>
            </AppleCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDraft;
