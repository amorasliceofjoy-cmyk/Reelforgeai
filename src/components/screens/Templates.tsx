import React, { useState } from 'react';
import { AppleButton } from '../shared/AppleButton';
import { AppleCard } from '../shared/AppleCard';
import { AppleInput } from '../shared/AppleInput';
import { Search, X, Play, Clock } from 'lucide-react';

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const templates = [
    { id: 1, title: 'Quick Cut Energy', duration: '15s', tag: 'Trending', category: 'Food' },
    { id: 2, title: 'Story Arc', duration: '30s', tag: 'Popular', category: 'Creator' },
    { id: 3, title: 'Product Showcase', duration: '20s', tag: 'New', category: 'Product' },
    { id: 4, title: 'Before/After', duration: '25s', tag: 'Viral', category: 'Fitness' },
    { id: 5, title: 'Tutorial Format', duration: '45s', tag: 'Educational', category: 'Business' },
    { id: 6, title: 'Transformation', duration: '30s', tag: 'Trending', category: 'Beauty' },
    { id: 7, title: 'Day in the Life', duration: '60s', tag: 'Popular', category: 'Creator' },
    { id: 8, title: 'Recipe Quick', duration: '20s', tag: 'Viral', category: 'Food' },
    { id: 9, title: 'Unboxing Pro', duration: '35s', tag: 'New', category: 'Product' },
  ];

  const tagColors: { [key: string]: string } = {
    'Trending': 'bg-[#007AFF]/10 text-[#007AFF]',
    'Popular': 'bg-[#34C759]/10 text-[#34C759]',
    'New': 'bg-[#FF9500]/10 text-[#FF9500]',
    'Viral': 'bg-[#FF2D55]/10 text-[#FF2D55]',
    'Educational': 'bg-[#5856D6]/10 text-[#5856D6]',
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E5E8]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-semibold text-[#1B1B1E]">Template Library</h1>
          <p className="text-[#63636A] mt-1">Choose a template to start your reel</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-[#8E8E95] absolute left-4 top-1/2 -translate-y-1/2" />
            <AppleInput placeholder="Search templates..." className="w-full pl-12" />
          </div>
          <select className="h-11 px-4 rounded-xl bg-white border border-[#E5E5E8] text-[#1B1B1E] focus:border-[#007AFF] focus:outline-none">
            <option>All Categories</option>
            <option>Food</option>
            <option>Business</option>
            <option>Creator</option>
            <option>Product</option>
            <option>Fitness</option>
            <option>Beauty</option>
          </select>
        </div>
      </div>

      {/* Template Grid */}
      <div className="max-w-7xl mx-auto px-8 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <AppleCard
              key={template.id}
              hover
              className="p-6 cursor-pointer"
              onClick={() => setSelectedTemplate(template.id)}
            >
              {/* Thumbnail */}
              <div className="aspect-[9/16] bg-gradient-to-br from-[#007AFF]/10 to-[#339AFF]/5 rounded-xl mb-4 relative overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 text-[#007AFF] ml-1" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-[#1B1B1E]">{template.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-[#8E8E95]">
                    <Clock className="w-4 h-4" />
                    {template.duration}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${tagColors[template.tag]}`}>
                    {template.tag}
                  </span>
                  <span className="text-sm text-[#8E8E95]">{template.category}</span>
                </div>
              </div>
            </AppleCard>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <AppleCard className="max-w-2xl w-full p-8 relative">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F7F7F8] hover:bg-[#E5E5E8] flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-[#63636A]" />
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Preview */}
              <div>
                <div className="aspect-[9/16] bg-gradient-to-br from-[#007AFF]/10 to-[#339AFF]/5 rounded-xl flex items-center justify-center">
                  <Play className="w-16 h-16 text-[#007AFF]" />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-[#1B1B1E] mb-2">
                    {templates.find(t => t.id === selectedTemplate)?.title}
                  </h2>
                  <p className="text-[#63636A]">
                    A high-energy template designed to capture attention in the first 3 seconds and maintain engagement throughout.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-[#E5E5E8]">
                    <span className="text-[#63636A]">Duration</span>
                    <span className="font-medium text-[#1B1B1E]">
                      {templates.find(t => t.id === selectedTemplate)?.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#E5E5E8]">
                    <span className="text-[#63636A]">Category</span>
                    <span className="font-medium text-[#1B1B1E]">
                      {templates.find(t => t.id === selectedTemplate)?.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[#63636A]">Clips Required</span>
                    <span className="font-medium text-[#1B1B1E]">3-5</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <AppleButton variant="primary" className="w-full">
                    Use Template
                  </AppleButton>
                  <AppleButton variant="secondary" className="w-full">
                    Preview Demo
                  </AppleButton>
                </div>
              </div>
            </div>
          </AppleCard>
        </div>
      )}
    </div>
  );
}
