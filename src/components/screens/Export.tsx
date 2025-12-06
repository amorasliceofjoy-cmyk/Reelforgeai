import React, { useState } from 'react';
import { AppleButton } from '../shared/AppleButton';
import { AppleCard } from '../shared/AppleCard';
import { Download, Copy, Check } from 'lucide-react';

export default function Export() {
  const [format, setFormat] = useState('MP4');
  const [fps, setFps] = useState('30');
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);

  const caption = `✨ You won't believe this transformation! The secret ingredient nobody talks about. Here's what 10 years taught me about getting real results. 💪

#transformation #beforeafter #resultsdriven #secretingredient #10yearschallenge #viralreel #contentcreator #reelstips`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E5E8]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-semibold text-[#1B1B1E]">Export Your Reel</h1>
          <p className="text-[#63636A] mt-1">Configure export settings and download</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-[1fr,500px] gap-8">
          {/* Left: Export Settings */}
          <div className="space-y-6">
            {/* Format */}
            <AppleCard className="p-6">
              <h3 className="font-semibold text-[#1B1B1E] mb-4">Export Format</h3>
              <div className="grid grid-cols-3 gap-3">
                {['MP4', 'MOV', 'WEBM'].map((formatOption) => (
                  <button
                    key={formatOption}
                    onClick={() => setFormat(formatOption)}
                    className={`py-3 rounded-xl transition-all ${
                      format === formatOption
                        ? 'bg-[#007AFF] text-white'
                        : 'bg-[#F7F7F8] text-[#1B1B1E] hover:bg-[#E5E5E8]'
                    }`}
                  >
                    {formatOption}
                  </button>
                ))}
              </div>
            </AppleCard>

            {/* Quality Settings */}
            <AppleCard className="p-6">
              <h3 className="font-semibold text-[#1B1B1E] mb-4">Quality Settings</h3>
              
              <div className="space-y-4">
                {/* Resolution */}
                <div>
                  <label className="block text-sm font-medium text-[#1B1B1E] mb-2">
                    Resolution
                  </label>
                  <select className="w-full h-11 px-4 rounded-xl bg-[#F7F7F8] border border-[#E5E5E8] text-[#1B1B1E] focus:border-[#007AFF] focus:outline-none">
                    <option>1080p (1920x1080)</option>
                    <option>720p (1280x720)</option>
                    <option>4K (3840x2160)</option>
                  </select>
                </div>

                {/* FPS */}
                <div>
                  <label className="block text-sm font-medium text-[#1B1B1E] mb-2">
                    Frame Rate (FPS)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['24', '30', '60', '120'].map((fpsOption) => (
                      <button
                        key={fpsOption}
                        onClick={() => setFps(fpsOption)}
                        className={`py-2 rounded-xl transition-all ${
                          fps === fpsOption
                            ? 'bg-[#007AFF] text-white'
                            : 'bg-[#F7F7F8] text-[#1B1B1E] hover:bg-[#E5E5E8]'
                        }`}
                      >
                        {fpsOption}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bitrate */}
                <div>
                  <label className="block text-sm font-medium text-[#1B1B1E] mb-2">
                    Bitrate
                  </label>
                  <select className="w-full h-11 px-4 rounded-xl bg-[#F7F7F8] border border-[#E5E5E8] text-[#1B1B1E] focus:border-[#007AFF] focus:outline-none">
                    <option>High (10 Mbps)</option>
                    <option>Medium (5 Mbps)</option>
                    <option>Low (2 Mbps)</option>
                  </select>
                </div>
              </div>
            </AppleCard>

            {/* Additional Options */}
            <AppleCard className="p-6">
              <h3 className="font-semibold text-[#1B1B1E] mb-4">Additional Options</h3>
              
              <div className="space-y-4">
                {/* Subtitles */}
                <div className="flex items-center justify-between p-4 bg-[#F7F7F8] rounded-xl">
                  <div>
                    <p className="font-medium text-[#1B1B1E]">Include Subtitles</p>
                    <p className="text-sm text-[#63636A]">Burn subtitles into video</p>
                  </div>
                  <button
                    onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                    className={`w-12 h-7 rounded-full transition-all ${
                      subtitlesEnabled ? 'bg-[#007AFF]' : 'bg-[#D5D5D9]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                        subtitlesEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Watermark */}
                <div className="flex items-center justify-between p-4 bg-[#F7F7F8] rounded-xl">
                  <div>
                    <p className="font-medium text-[#1B1B1E]">Watermark</p>
                    <p className="text-sm text-[#63636A]">Add ReelForge branding</p>
                  </div>
                  <button
                    onClick={() => setWatermarkEnabled(!watermarkEnabled)}
                    className={`w-12 h-7 rounded-full transition-all ${
                      watermarkEnabled ? 'bg-[#007AFF]' : 'bg-[#D5D5D9]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                        watermarkEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </AppleCard>

            {/* File Info */}
            <AppleCard className="p-6">
              <h3 className="font-semibold text-[#1B1B1E] mb-4">Export Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#63636A]">Estimated File Size</span>
                  <span className="font-medium text-[#1B1B1E]">42.5 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#63636A]">Duration</span>
                  <span className="font-medium text-[#1B1B1E]">30s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#63636A]">Export Time</span>
                  <span className="font-medium text-[#1B1B1E]">~2 minutes</span>
                </div>
              </div>
            </AppleCard>
          </div>

          {/* Right: Preview & Caption */}
          <div className="space-y-6">
            {/* Preview */}
            <AppleCard className="p-6">
              <h3 className="font-semibold text-[#1B1B1E] mb-4">Preview</h3>
              <div className="aspect-[9/16] bg-gradient-to-br from-[#007AFF]/10 to-[#339AFF]/5 rounded-xl flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-[#007AFF] rounded-2xl flex items-center justify-center">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-[#63636A]">Ready to export</p>
                </div>
              </div>

              <AppleButton variant="primary" className="w-full py-4 text-lg flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Export & Download
              </AppleButton>
            </AppleCard>

            {/* Caption */}
            <AppleCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1B1B1E]">Caption</h3>
                <button
                  onClick={handleCopyCaption}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                    captionCopied
                      ? 'bg-[#34C759] text-white'
                      : 'bg-[#F7F7F8] text-[#1B1B1E] hover:bg-[#E5E5E8]'
                  }`}
                >
                  {captionCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 bg-[#F7F7F8] rounded-xl max-h-60 overflow-y-auto">
                <p className="text-[#1B1B1E] whitespace-pre-wrap">{caption}</p>
              </div>
              <div className="mt-3 text-xs text-[#8E8E95]">
                Character count: {caption.length}/2200
              </div>
            </AppleCard>

            {/* Platform Recommendations */}
            <AppleCard className="p-6">
              <h3 className="font-semibold text-[#1B1B1E] mb-4">Platform Tips</h3>
              <div className="space-y-3">
                <div className="p-3 bg-[#F7F7F8] rounded-lg">
                  <p className="text-sm font-medium text-[#1B1B1E] mb-1">Instagram Reels</p>
                  <p className="text-xs text-[#63636A]">Best time to post: 6-9 PM</p>
                </div>
                <div className="p-3 bg-[#F7F7F8] rounded-lg">
                  <p className="text-sm font-medium text-[#1B1B1E] mb-1">TikTok</p>
                  <p className="text-xs text-[#63636A]">Best time to post: 7-11 AM</p>
                </div>
                <div className="p-3 bg-[#F7F7F8] rounded-lg">
                  <p className="text-sm font-medium text-[#1B1B1E] mb-1">YouTube Shorts</p>
                  <p className="text-xs text-[#63636A]">Best time to post: 12-3 PM</p>
                </div>
              </div>
            </AppleCard>
          </div>
        </div>
      </div>
    </div>
  );
}
