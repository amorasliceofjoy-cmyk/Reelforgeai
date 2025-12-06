import React from 'react';
import { AppleButton } from '../shared/AppleButton';
import { AppleInput } from '../shared/AppleInput';
import { AppleCard } from '../shared/AppleCard';

export function DesignSystem() {
  const colors = [
    { name: 'Gray/0', hex: '#FFFFFF', var: 'gray-0' },
    { name: 'Gray/50', hex: '#F7F7F8', var: 'gray-50' },
    { name: 'Gray/100', hex: '#F2F2F3', var: 'gray-100' },
    { name: 'Gray/200', hex: '#E5E5E8', var: 'gray-200' },
    { name: 'Gray/300', hex: '#D5D5D9', var: 'gray-300' },
    { name: 'Gray/400', hex: '#B5B5BD', var: 'gray-400' },
    { name: 'Gray/500', hex: '#8E8E95', var: 'gray-500' },
    { name: 'Gray/600', hex: '#63636A', var: 'gray-600' },
    { name: 'Gray/700', hex: '#3A3A3F', var: 'gray-700' },
    { name: 'Gray/900', hex: '#1B1B1E', var: 'gray-900' },
    { name: 'Accent/Blue', hex: '#007AFF', var: 'accent-blue' },
    { name: 'Accent/Blue Light', hex: '#339AFF', var: 'accent-blue-light' },
  ];

  const typography = [
    { name: 'Display', size: '48px', weight: '600' },
    { name: 'H1', size: '36px', weight: '600' },
    { name: 'H2', size: '28px', weight: '600' },
    { name: 'H3', size: '22px', weight: '600' },
    { name: 'Body', size: '17px', weight: '400' },
    { name: 'Body Small', size: '15px', weight: '400' },
    { name: 'Caption', size: '13px', weight: '400' },
  ];

  const spacing = [4, 8, 12, 16, 20, 24, 32, 48];

  return (
    <div className="min-h-screen bg-[#F7F7F8] p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-5xl font-semibold text-[#1B1B1E] mb-2">Design System</h1>
          <p className="text-lg text-[#63636A]">ReelForge AI - Apple-style Design Tokens</p>
        </div>

        {/* Colors */}
        <section>
          <h2 className="text-3xl font-semibold text-[#1B1B1E] mb-6">Colors</h2>
          <AppleCard className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {colors.map((color) => (
                <div key={color.name} className="space-y-3">
                  <div 
                    className="h-24 rounded-xl border border-[#E5E5E8]" 
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <p className="font-medium text-[#1B1B1E]">{color.name}</p>
                    <p className="text-sm text-[#8E8E95]">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </AppleCard>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-3xl font-semibold text-[#1B1B1E] mb-6">Typography</h2>
          <AppleCard className="p-8">
            <div className="space-y-6">
              {typography.map((type) => (
                <div key={type.name} className="flex items-baseline gap-8 border-b border-[#E5E5E8] pb-6 last:border-0">
                  <div className="w-32">
                    <p className="font-medium text-[#1B1B1E]">{type.name}</p>
                    <p className="text-sm text-[#8E8E95]">{type.size}</p>
                  </div>
                  <p style={{ fontSize: type.size, fontWeight: type.weight }} className="text-[#1B1B1E]">
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              ))}
            </div>
          </AppleCard>
        </section>

        {/* Spacing */}
        <section>
          <h2 className="text-3xl font-semibold text-[#1B1B1E] mb-6">Spacing Tokens</h2>
          <AppleCard className="p-8">
            <div className="space-y-4">
              {spacing.map((space) => (
                <div key={space} className="flex items-center gap-4">
                  <span className="w-12 font-medium text-[#1B1B1E]">{space}px</span>
                  <div 
                    className="h-8 bg-[#007AFF] rounded" 
                    style={{ width: `${space * 4}px` }}
                  />
                </div>
              ))}
            </div>
          </AppleCard>
        </section>

        {/* Components */}
        <section>
          <h2 className="text-3xl font-semibold text-[#1B1B1E] mb-6">Components</h2>
          
          {/* Buttons */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#1B1B1E] mb-4">Buttons</h3>
            <AppleCard className="p-8">
              <div className="flex flex-wrap gap-4">
                <AppleButton variant="primary">Primary Button</AppleButton>
                <AppleButton variant="secondary">Secondary Button</AppleButton>
              </div>
              <div className="mt-6 p-4 bg-[#F7F7F8] rounded-xl">
                <p className="text-sm text-[#63636A]">
                  <strong>Primary:</strong> Blue background (#007AFF), 12px radius, 12px×20px padding<br/>
                  <strong>Secondary:</strong> White background, Gray/300 border
                </p>
              </div>
            </AppleCard>
          </div>

          {/* Input */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#1B1B1E] mb-4">Input / Textfield</h3>
            <AppleCard className="p-8">
              <AppleInput placeholder="Enter text here..." className="w-full max-w-md" />
              <div className="mt-6 p-4 bg-[#F7F7F8] rounded-xl">
                <p className="text-sm text-[#63636A]">
                  44px height, 12px radius, Gray/50 background
                </p>
              </div>
            </AppleCard>
          </div>

          {/* Cards */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#1B1B1E] mb-4">Card / Base</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <AppleCard className="p-6">
                <h4 className="text-lg font-semibold text-[#1B1B1E] mb-2">Template Card</h4>
                <p className="text-[#63636A]">White background, 16px radius, soft shadow</p>
              </AppleCard>
              <AppleCard className="p-6" hover>
                <h4 className="text-lg font-semibold text-[#1B1B1E] mb-2">Media Card (Hover)</h4>
                <p className="text-[#63636A]">Hover state with elevated shadow</p>
              </AppleCard>
            </div>
          </div>

          {/* Modal */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#1B1B1E] mb-4">Modal / Center</h3>
            <AppleCard className="p-8">
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#E5E5E8]">
                  <h4 className="text-xl font-semibold text-[#1B1B1E] mb-4">Modal Title</h4>
                  <p className="text-[#63636A] mb-6">Modal content goes here with consistent padding and styling.</p>
                  <div className="flex gap-3">
                    <AppleButton variant="primary" className="flex-1">Confirm</AppleButton>
                    <AppleButton variant="secondary" className="flex-1">Cancel</AppleButton>
                  </div>
                </div>
              </div>
            </AppleCard>
          </div>
        </section>

        {/* Layout Grids */}
        <section>
          <h2 className="text-3xl font-semibold text-[#1B1B1E] mb-6">Layout Grids</h2>
          
          <div className="space-y-6">
            {/* Desktop Grid */}
            <div>
              <h3 className="text-xl font-semibold text-[#1B1B1E] mb-4">Desktop (1440px)</h3>
              <AppleCard className="p-8">
                <div className="space-y-2">
                  <p className="text-[#63636A]"><strong>Width:</strong> 1440px</p>
                  <p className="text-[#63636A]"><strong>Columns:</strong> 12</p>
                  <p className="text-[#63636A]"><strong>Margins:</strong> 120px</p>
                  <p className="text-[#63636A]"><strong>Gutters:</strong> 24px</p>
                </div>
                <div className="mt-6 grid grid-cols-12 gap-6">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-16 bg-[#007AFF]/10 rounded" />
                  ))}
                </div>
              </AppleCard>
            </div>

            {/* Mobile Grid */}
            <div>
              <h3 className="text-xl font-semibold text-[#1B1B1E] mb-4">Mobile (390px)</h3>
              <AppleCard className="p-8">
                <div className="space-y-2">
                  <p className="text-[#63636A]"><strong>Width:</strong> 390px</p>
                  <p className="text-[#63636A]"><strong>Columns:</strong> 4</p>
                  <p className="text-[#63636A]"><strong>Margins:</strong> 16px</p>
                </div>
                <div className="mt-6 grid grid-cols-4 gap-4 max-w-sm">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-[#007AFF]/10 rounded" />
                  ))}
                </div>
              </AppleCard>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
