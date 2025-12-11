import React, { useCallback, useEffect, useRef, useState } from "react";
//import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import { v4 as uuidv4 } from "uuid";
import { useDropzone } from "react-dropzone";

/*
  Editor.tsx (fixed)
  - React + TypeScript single-file editor component
  - Fixes:
    * removed browser-incompatible `require()` use
    * writes concat.txt using TextEncoder
    * safer isLoaded checks
    * revokes object URLs after download
    * clearer logs / error handling
*/

type MediaType = "video" | "audio" | "image";

type Clip = {
  id: string;
  name: string;
  type: MediaType;
  file: File;
  duration?: number; // seconds (optional — can probe)
  start?: number; // when placed on timeline
};

export default function Editor(): JSX.Element {
  const [clips, setClips] = useState<Clip[]>([]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  // Initialize ffmpeg.wasm
  useEffect(() => {
    const ffmpeg = createFFmpeg({
      log: true,
      progress: (p) => {
        setProgress(Math.round((p.ratio || 0) * 100));
      },
    });
    ffmpegRef.current = ffmpeg;

    let mounted = true;
    (async () => {
      try {
        appendLog("Loading ffmpeg core (this may take a few seconds)...");
        await ffmpeg.load();
        if (!mounted) return;
        setFfmpegReady(true);
        appendLog("ffmpeg loaded");
      } catch (e: any) {
        appendLog("Failed to load ffmpeg: " + (e?.message || String(e)));
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newClips: Clip[] = acceptedFiles.map((f) => {
      const lower = f.type.toLowerCase();
      let t: MediaType = "video";
      if (lower.startsWith("audio/")) t = "audio";
      else if (lower.startsWith("image/")) t = "image";
      else if (lower.startsWith("video/")) t = "video";

      return {
        id: uuidv4(),
        name: f.name,
        type: t,
        file: f,
      };
    });
    setClips((c) => [...c, ...newClips]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [], "audio/*": [], "image/*": [] },
  });

  // append log
  function appendLog(s: string) {
    setLogs((l) => [...l, `${new Date().toLocaleTimeString()}: ${s}`]);
  }

  // remove clip
  function removeClip(id: string) {
    setClips((c) => c.filter((x) => x.id !== id));
    if (selectedClipId === id) setSelectedClipId(null);
  }

  // reorder helper (simple move)
  function moveClip(fromIndex: number, toIndex: number) {
    setClips((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, item);
      return copy;
    });
  }

  // Export timeline to MP4 (very simple pipeline)
  async function exportTimeline() {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg) {
      appendLog("ffmpeg instance not created");
      return;
    }
    if (!ffmpeg.isLoaded()) {
      appendLog("ffmpeg not loaded yet");
      return;
    }
    if (clips.length === 0) {
      appendLog("No clips to export");
      return;
    }

    setProcessing(true);
    appendLog("Starting export...");

    const createdObjectURLs: string[] = [];

    try {
      // 1) write all files to FS
      for (const clip of clips) {
        appendLog(`Writing ${clip.name} to ffmpeg FS...`);
        const data = await fetchFile(clip.file);
        // ffmpeg.FS expects Uint8Array for binary
        await ffmpeg.FS("writeFile", clip.name, data);
      }

      // 2) create segments
      const tempSegmentNames: string[] = [];

      for (let i = 0; i < clips.length; i++) {
        const clip = clips[i];
        // safe filename in FS (not strictly necessary but avoids weird chars)
        const safeFsName = clip.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        // If file was written under original name, we used clip.name; using safeFsName when needed
        if (clip.type === "video") {
          const outName = `seg_${i}.mp4`;
          tempSegmentNames.push(outName);
          appendLog(`Transcoding video ${clip.name} -> ${outName}`);
          await ffmpeg.run("-i", clip.name, "-c:v", "libx264", "-preset", "veryfast", "-c:a", "aac", "-y", outName);
        } else if (clip.type === "image") {
          const outName = `seg_${i}.mp4`;
          tempSegmentNames.push(outName);
          appendLog(`Turning image ${clip.name} into 3s video -> ${outName}`);
          await ffmpeg.run(
            "-loop",
            "1",
            "-i",
            clip.name,
            "-t",
            "3",
            "-c:v",
            "libx264",
            "-vf",
            "scale=1280:-2,format=yuv420p",
            "-y",
            outName
          );
        } else if (clip.type === "audio") {
          const outName = `seg_${i}.mp4`;
          tempSegmentNames.push(outName);
          appendLog(`Combining audio ${clip.name} with a black background -> ${outName}`);
          // Use a 5s black background but set -shortest so it matches audio length
          await ffmpeg.run(
            "-f",
            "lavfi",
            "-i",
            "color=size=1280x720:duration=5:rate=25:color=black",
            "-i",
            clip.name,
            "-c:v",
            "libx264",
            "-c:a",
            "aac",
            "-shortest",
            "-y",
            outName
          );
        }
      }

      // write concat file (must be bytes)
      const concatList = tempSegmentNames.map((n) => `file '${n}'`).join("\n");
      const encoder = new TextEncoder();
      ffmpeg.FS("writeFile", "concat.txt", encoder.encode(concatList));

      const finalOut = `final_${Date.now()}.mp4`;
      appendLog(`Concatenating ${tempSegmentNames.length} segments -> ${finalOut}`);

      // If there is only one segment we can copy it to finalOut; but concat works too
      await ffmpeg.run("-f", "concat", "-safe", "0", "-i", "concat.txt", "-c", "copy", "-y", finalOut);

      appendLog("Reading output from FS...");
      const data = ffmpeg.FS("readFile", finalOut); // Uint8Array
      const blob = new Blob([data.buffer], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      createdObjectURLs.push(url);

      appendLog("Export complete — creating download link");
      const a = document.createElement("a");
      a.href = url;
      a.download = finalOut;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // revoke object URLs after a short delay (so download has time to start)
      setTimeout(() => {
        createdObjectURLs.forEach((u) => {
          try {
            URL.revokeObjectURL(u);
          } catch {}
        });
      }, 60_000);

      appendLog("Cleaning up temporary files in ffmpeg FS...");
      // Optional: remove temporary files from FS to free memory
      try {
        for (const n of tempSegmentNames) {
          ffmpeg.FS("unlink", n);
        }
        ffmpeg.FS("unlink", "concat.txt");
        ffmpeg.FS("unlink", finalOut);
        // also unlink original uploaded names if desired
      } catch (cleanupErr) {
        // ignore cleanup errors
      }
    } catch (e: any) {
      appendLog("Export failed: " + (e?.message || String(e)));
      console.error(e);
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  }

  // small preview selected clip
  const SelectedPreview = (): JSX.Element => {
    const clip = clips.find((c) => c.id === selectedClipId);
    if (!clip) return <div className="p-4 text-sm text-gray-500">Select a clip to preview</div>;

    const url = URL.createObjectURL(clip.file);

    // Revoke the preview url when component unmounts / selection changes to avoid leaks
    useEffect(() => {
      return () => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clip?.id]);

    if (clip.type === "image") return <img src={url} alt={clip.name} className="max-w-full rounded" />;
    if (clip.type === "audio")
      return (
        <audio controls>
          <source src={url} />
        </audio>
      );

    return (
      <video ref={videoPreviewRef} controls className="max-w-full rounded">
        <source src={url} />
      </video>
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">ReelForge — Editor (scaffold)</h2>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-6 rounded mb-6 ${isDragActive ? "border-blue-500" : "border-gray-200"}`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">Drag & drop video / audio / image files here, or click to select.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Timeline / Clips */}
        <div className="col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Timeline</h3>
            <div>
              <button
                disabled={!ffmpegReady || processing}
                onClick={exportTimeline}
                className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
              >
                {processing ? `Processing ${progress}%` : "Export"}
              </button>
            </div>
          </div>

          {/* Simple horizontal timeline list */}
          <div className="bg-gray-50 p-4 rounded">
            {clips.length === 0 ? (
              <div className="text-sm text-gray-500">No clips — add files above.</div>
            ) : (
              <div className="space-y-2">
                {clips.map((c, idx) => (
                  <div key={c.id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">{c.type}</div>
                      <div>
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeClip(c.id)} className="text-sm text-red-600">
                        Remove
                      </button>
                      <button onClick={() => setSelectedClipId(c.id)} className="text-sm text-blue-600">
                        Preview
                      </button>
                      {idx > 0 && (
                        <button onClick={() => moveClip(idx, idx - 1)} className="text-sm">
                          ↖
                        </button>
                      )}
                      {idx < clips.length - 1 && (
                        <button onClick={() => moveClip(idx, idx + 1)} className="text-sm">
                          ↘
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* logs & progress */}
          <div className="mt-4">
            <div className="text-sm text-gray-600 mb-1">Logs</div>
            <div className="h-40 overflow-auto bg-black text-white p-2 rounded text-xs">
              {logs.length === 0 ? <div className="text-gray-400">No logs yet.</div> : logs.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          </div>
        </div>

        {/* Right column: preview & ffmpeg info */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div className="mt-2 border p-3 rounded min-h-[160px] bg-white">
              <SelectedPreview />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">ffmpeg</h3>
            <div className="mt-2 bg-white p-3 rounded text-sm">
              <div>ffmpeg ready: {ffmpegReady ? "✅" : "❌"}</div>
              <div>Processing: {processing ? `Yes (${progress}%)` : "No"}</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick tests</h3>
            <div className="mt-2 bg-white p-3 rounded">
              <button
                onClick={async () => {
                  try {
                    appendLog("Checking ffmpeg wasm instance");
                    if (!ffmpegRef.current) {
                      appendLog("ffmpeg instance not created");
                      return;
                    }
                    appendLog(`ffmpeg loaded: ${ffmpegRef.current.isLoaded() ? "yes" : "no"}`);
                  } catch (e: any) {
                    appendLog("ffmpeg wasm import check failed: " + (e?.message || String(e)));
                  }
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Check ffmpeg
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
