import React, { useState } from 'react';
import { AppleButton } from '../shared/AppleButton';
import { AppleCard } from '../shared/AppleCard';
import { AppleInput } from '../shared/AppleInput';
import { Upload as UploadIcon, Film, X } from 'lucide-react';

export default function Upload() {
  const [projectName, setProjectName] = useState('My Reel Project');
  const [uploadedClips, setUploadedClips] = useState<string[]>([]);
  const [reelLength, setReelLength] = useState('30');
  const [brandKitEnabled, setBrandKitEnabled] = useState(false);

  const handleFileUpload = () => {
    // Simulate file upload
    setUploadedClips([...uploadedClips, `Clip ${uploadedClips.length + 1}`]);
  };

  const removeClip = (index: number) => {
    setUploadedClips(uploadedClips.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E5E8]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-semibold text-[#1B1B1E]">Upload & Project Setup</h1>
          <p className="text-[#63636A] mt-1">Upload your clips and configure your project</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Left: Upload Area */}
          <div className="space-y-6">
            {/* Upload Zone */}
            <AppleCard className="p-8">
              <div
                onClick={handleFileUpload}
                className="border-2 border-dashed border-[#D5D5D9] rounded-2xl p-12 text-center cursor-pointer hover:border-[#007AFF] hover:bg-[#007AFF]/5 transition-all"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-[#007AFF]/10 rounded-2xl flex items-center justify-center">
                  <UploadIcon className="w-10 h-10 text-[#007AFF]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1B1B1E] mb-2">
                  Drag & Drop Your Clips
                </h3>
                <p className="text-[#63636A] mb-4">
                  or click to browse files
                </p>
                <p className="text-sm text-[#8E8E95]">
                  Supports MP4, MOV, AVI • Max 500MB per file
                </p>
              </div>
            </AppleCard>

            {/* Uploaded Clips */}
            {uploadedClips.length > 0 && (
              <AppleCard className="p-6">
                <h3 className="font-semibold text-[#1B1B1E] mb-4">
                  Uploaded Clips ({uploadedClips.length})
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {uploadedClips.map((clip, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video bg-gradient-to-br from-[#007AFF]/10 to-[#339AFF]/5 rounded-xl flex items-center justify-center">
                        <Film className="w-8 h-8 text-[#007AFF]" />
                      </div>
                      <button
                        onClick={() => removeClip(index)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#1B1B1E]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <p className="text-sm text-[#63636A] mt-2">{clip}</p>
                    </div>
                  ))}
                </div>
              </AppleCard>
            )}
          </div>

          {/* Right: Project Settings */}
          <div className="space-y-6">
            <AppleCard className="p-6">
              <h3 className="font-semibold text-[#1B1B1E] mb-6">Project Settings</h3>

              <div className="space-y-6">
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-[#1B1B1E] mb-2">
                    Project Name
                  </label>
                  <AppleInput
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Reel Length */}
                <div>
                  <label className="block text-sm font-medium text-[#1B1B1E] mb-2">
                    Target Reel Length
                  </label>
                  <div className="flex gap-2">
                    {['15', '30', '60', '90'].map((length) => (
                      <button
                        key={length}
                        onClick={() => setReelLength(length)}
                        className={`flex-1 py-2 rounded-xl transition-all ${
                          reelLength === length
                            ? 'bg-[#007AFF] text-white'
                            : 'bg-[#F7F7F8] text-[#1B1B1E] hover:bg-[#E5E5E8]'
                        }`}
                      >
                        {length}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <label className="block text-sm font-medium text-[#1B1B1E] mb-2">
                    Aspect Ratio
                  </label>
                  <select className="w-full h-11 px-4 rounded-xl bg-[#F7F7F8] border border-[#E5E5E8] text-[#1B1B1E] focus:border-[#007AFF] focus:outline-none">
                    <option>9:16 (Vertical - Instagram/TikTok)</option>
                    <option>1:1 (Square)</option>
                    <option>16:9 (Horizontal)</option>
                  </select>
                </div>

                {/* Brand Kit Toggle */}
                <div className="flex items-center justify-between p-4 bg-[#F7F7F8] rounded-xl">
                  <div>
                    <p className="font-medium text-[#1B1B1E]">Use Brand Kit</p>
                    <p className="text-sm text-[#63636A]">Apply your colors & fonts</p>
                  </div>
                  <button
                    onClick={() => setBrandKitEnabled(!brandKitEnabled)}
                    className={`w-12 h-7 rounded-full transition-all ${
                      brandKitEnabled ? 'bg-[#007AFF]' : 'bg-[#D5D5D9]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                        brandKitEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </AppleCard>

            {/* Quick Stats */}
            <AppleCard className="p-6">
              <h4 className="font-semibold text-[#1B1B1E] mb-4">Quick Info</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#63636A]">Clips Uploaded</span>
                  <span className="font-medium text-[#1B1B1E]">{uploadedClips.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#63636A]">Total Duration</span>
                  <span className="font-medium text-[#1B1B1E]">{uploadedClips.length * 12}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#63636A]">Storage Used</span>
                  <span className="font-medium text-[#1B1B1E]">{uploadedClips.length * 45}MB</span>
                </div>
              </div>
            </AppleCard>

            {/* Action Button */}
            <AppleButton
              variant="primary"
              className="w-full py-4 text-lg"
              onClick={() => {}}
            >
              Generate AI Draft
            </AppleButton>
          </div>
        </div>
      </div>
    </div>
  );
}
