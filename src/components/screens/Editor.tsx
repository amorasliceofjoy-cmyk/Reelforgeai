import React, { useState, useEffect, useRef } from "react";
import { AppleButton } from "../shared/AppleButton";
import { AppleCard } from "../shared/AppleCard";
import {
  Film,
  Type,
  Subtitles,
  Music,
  Layout,
  Palette,
  Undo2,
  Redo2,
  Save,
  Download,
  Play,
  Pause,
} from "lucide-react";

// Trend type
type Trend = {
  id: string;
  title: string;
  description: string;
  editingTemplate: string;
  niche?: string;
  hookType?: string;
  soundType?: string;
  platform?: string;
};

type EditorProps = {
  initialTrend?: Trend | null;
};

export default function Editor({ initialTrend }: EditorProps) {
  const [activeTool, setActiveTool] = useState("media");
  const [isPlaying, setIsPlaying] = useState(false);

  // Editor state
  const [projectTitle, setProjectTitle] = useState("My Reel Project");
  const [timelineBlocks, setTimelineBlocks] = useState<
    { id: string; label: string; text: string }[]
  >([]);
  const [notes, setNotes] = useState("");

  // UI state for editing
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");
  const dragItemId = useRef<string | null>(null);

  // Keep initial trend in sync
  useEffect(() => {
    if (!initialTrend) return;

    setProjectTitle(initialTrend.title || "My Reel Project");
    setNotes(initialTrend.description || "");

    if (initialTrend.editingTemplate) {
      const lines = initialTrend.editingTemplate
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      const blocks = lines.map((line, index) => {
        const [label, ...rest] = line.split(":");
        return {
          id: `block-${index}-${Date.now()}`,
          label: (label || `part ${index + 1}`).trim(),
          text: (rest.length ? rest.join(":") : "").trim() || line,
        };
      });

      setTimelineBlocks(blocks);
    }
  }, [initialTrend]);

  // --- Drag & Drop handlers (native HTML5) ---
  const onDragStart = (e: React.DragEvent, id: string) => {
    dragItemId.current = id;
    e.dataTransfer.effectAllowed = "move";
    // small transparent drag image improves UX
    const img = document.createElement("div");
    img.style.width = "1px";
    img.style.height = "1px";
    document.body.appendChild(img);
    // @ts-ignore
    e.dataTransfer.setDragImage(img, 0, 0);
    setTimeout(() => document.body.removeChild(img), 0);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDropOn = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = dragItemId.current;
    if (!sourceId) return;
    if (sourceId === targetId) return;

    const fromIndex = timelineBlocks.findIndex((b) => b.id === sourceId);
    const toIndex = timelineBlocks.findIndex((b) => b.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = [...timelineBlocks];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setTimelineBlocks(next);
    dragItemId.current = null;
  };

  // If dropped on empty area append to end
  const onDropToEnd = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceId = dragItemId.current;
    if (!sourceId) return;
    const fromIndex = timelineBlocks.findIndex((b) => b.id === sourceId);
    if (fromIndex === -1) return;
    const next = [...timelineBlocks];
    const [moved] = next.splice(fromIndex, 1);
    next.push(moved);
    setTimelineBlocks(next);
    dragItemId.current = null;
  };

  // --- Inline edit handlers ---
  const startEditing = (blockId: string, currentText: string) => {
    setEditingBlockId(blockId);
    setDraftText(currentText);
    // focus handled by input's autoFocus
  };

  const saveEditing = () => {
    if (!editingBlockId) return;
    setTimelineBlocks((prev) =>
      prev.map((b) => (b.id === editingBlockId ? { ...b, text: draftText } : b))
    );
    setEditingBlockId(null);
    setDraftText("");
  };

  const cancelEditing = () => {
    setEditingBlockId(null);
    setDraftText("");
  };

  // Remove a block
  const removeBlock = (id: string) => {
    setTimelineBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  // Add a new block at the end
  const addBlock = () => {
    const nextIndex = timelineBlocks.length + 1;
    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      label: `${nextIndex * 2 - 2}–${nextIndex * 2}s`,
      text: "New clip",
    };
    setTimelineBlocks((prev) => [...prev, newBlock]);
  };

  // Simple local "caption generator" - replaceable with AI later
  const generateCaption = () => {
    if (!timelineBlocks.length) {
      return "A quick reel — watch the transformation!";
    }
    // take first 3 meaningful texts and stitch
    const texts = timelineBlocks.map((b) => b.text.replace(/[\r\n]+/g, " ").trim());
    const top = texts.filter(Boolean).slice(0, 3).join(" • ");
    const hashtag = "#reel #viral";
    const caption = `${top} — watch till the end! ${hashtag}`;
    // show in notes for convenience
    setNotes(caption);
  };

  // Tools UI (unchanged)
  const tools = [
    { id: "media", label: "Media", icon: Film },
    { id: "text", label: "Text", icon: Type },
    { id: "subtitles", label: "Subtitles", icon: Subtitles },
    { id: "music", label: "Music", icon: Music },
    { id: "templates", label: "Templates", icon: Layout },
    { id: "brand", label: "Brand Kit", icon: Palette },
  ];

  return (
    <div className="h-screen bg-[#1B1B1E] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-[#3A3A3F] border-b border-[#63636A] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-white" />
            <span className="font-semibold text-white">ReelForge AI</span>
          </div>
          <div className="h-6 w-px bg-[#63636A]" />
          <span className="text-sm text-[#B5B5BD]">{projectTitle}</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-[#63636A]/30 transition-colors" title="Undo (not implemented)">
            <Undo2 className="w-5 h-5 text-white" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[#63636A]/30 transition-colors" title="Redo (not implemented)">
            <Redo2 className="w-5 h-5 text-white" />
          </button>
          <div className="h-6 w-px bg-[#63636A] mx-2" />
          <button
            onClick={() => {
              // placeholder save - you can POST project to backend here
              // e.g. POST /api/save-project with timelineBlocks, notes, projectTitle
              alert("Project saved locally (placeholder).");
            }}
            className="px-4 py-2 rounded-lg bg-[#63636A]/30 text-white hover:bg-[#63636A]/50 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#007AFF] text-white hover:bg-[#0066DD] transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-[#3A3A3F] border-r border-[#63636A] flex flex-col">
          <div className="grid grid-cols-3 gap-1 p-2 bg-[#1B1B1E] border-b border-[#63636A]">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`flex flex-col items-center gap-1 py-3 rounded-lg transition-all ${
                    activeTool === tool.id
                      ? "bg-[#007AFF] text-white"
                      : "text-[#B5B5BD] hover:bg-[#63636A]/30"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{tool.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTool === "media" && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white mb-3">Media Clips</h3>
                {[1, 2, 3, 4].map((clip) => (
                  <div
                    key={clip}
                    className="aspect-video bg-[#63636A]/20 rounded-lg cursor-pointer hover:bg-[#63636A]/40 transition-colors flex items-center justify-center"
                  >
                    <Film className="w-8 h-8 text-[#8E8E95]" />
                  </div>
                ))}
              </div>
            )}

            {activeTool === "text" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Text Overlays</h3>
                <button
                  onClick={() =>
                    setTimelineBlocks((prev) => [
                      ...prev,
                      {
                        id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                        label: `${(prev.length + 1) * 2 - 2}–${(prev.length + 1) * 2}s`,
                        text: "New text overlay",
                      },
                    ])
                  }
                  className="w-full py-3 border-2 border-dashed border-[#63636A] rounded-lg text-[#B5B5BD] hover:border-[#007AFF] hover:text-[#007AFF] transition-colors"
                >
                  + Add Text Block
                </button>
              </div>
            )}

            {activeTool === "subtitles" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Subtitle Styles</h3>
                <div className="space-y-2">
                  {["Bold Modern", "Minimal Clean", "Neon Pop"].map((style) => (
                    <button
                      key={style}
                      className="w-full p-3 bg-[#63636A]/20 rounded-lg text-left text-white hover:bg-[#007AFF] transition-colors"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col bg-[#1B1B1E]">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative">
              <div className="w-[360px] aspect-[9/16] bg-gradient-to-br from-[#007AFF]/10 to-[#339AFF]/5 rounded-3xl shadow-2xl overflow-hidden border-8 border-[#3A3A3F]">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-[#007AFF]/20 rounded-2xl flex items-center justify-center">
                      <Play className="w-10 h-10 text-[#007AFF]" />
                    </div>
                    <p className="text-[#8E8E95]">Preview</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-[#007AFF] text-white flex items-center justify-center hover:bg-[#0066DD] transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div
            className="bg-[#3A3A3F] border-t border-[#63636A] p-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropToEnd}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm text-[#B5B5BD]">Timeline</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={addBlock}
                  className="text-xs px-3 py-1 rounded-lg border border-[#63636A] text-[#B5B5BD] hover:bg-[#63636A]/20"
                >
                  + Add Block
                </button>
                <button
                  onClick={generateCaption}
                  className="text-xs px-3 py-1 rounded-lg bg-[#007AFF] text-white hover:bg-[#0066DD]"
                >
                  Generate Caption
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {timelineBlocks.length > 0 ? (
                timelineBlocks.map((block) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, block.id)}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDropOn(e, block.id)}
                    className="flex items-start gap-4 bg-[#63636A]/20 rounded-lg p-3"
                  >
                    <div className="w-16 text-xs font-bold text-[#007AFF]">{block.label}</div>

                    {/* Editable area */}
                    <div className="flex-1">
                      {editingBlockId === block.id ? (
                        <div className="space-y-2">
                          <textarea
                            autoFocus
                            value={draftText}
                            onChange={(e) => setDraftText(e.target.value)}
                            className="w-full rounded-md p-2 text-sm bg-[#1B1B1E] text-white border border-[#4B4B4F]"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={cancelEditing}
                              className="text-xs px-2 py-1 rounded-lg border border-[#63636A] text-[#B5B5BD]"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={saveEditing}
                              className="text-xs px-2 py-1 rounded-lg bg-[#007AFF] text-white"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-4">
                          <div
                            onDoubleClick={() => startEditing(block.id, block.text)}
                            className="text-xs text-white break-words"
                          >
                            {block.text}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditing(block.id, block.text)}
                              className="text-xs px-2 py-1 rounded-md text-[#B5B5BD] border border-transparent hover:border-[#007AFF]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => removeBlock(block.id)}
                              className="text-xs px-2 py-1 rounded-md text-red-400 border border-transparent hover:bg-red-500/10"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#8E8E95]">No template loaded yet. Choose a trend from Trend Library.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-[#3A3A3F] border-l border-[#63636A] p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-white mb-4">Notes</h3>

          <textarea
            className="w-full h-40 bg-[#63636A]/20 text-white border border-[#63636A] rounded-lg p-3 text-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
