import React from 'react';
import { AppleButton } from '../shared/AppleButton';
import { AppleCard } from '../shared/AppleCard';
import { Sparkles, Zap, Target, Video, Dumbbell, Palette } from 'lucide-react';

export default function Landing() {
  const categories = [
    { name: 'Food', icon: '🍽️' },
    { name: 'Business', icon: '💼' },
    { name: 'Creator', icon: '🎬' },
    { name: 'Product', icon: '📦' },
    { name: 'Fitness', icon: '💪' },
    { name: 'Beauty', icon: '💄' },
  ];

  const steps = [
    { number: '01', title: 'Upload Your Clips', description: 'Drag and drop raw footage from your library' },
    { number: '02', title: 'AI Creates Hooks', description: 'Get 3 viral-worthy hooks generated instantly' },
    { number: '03', title: 'Export & Share', description: 'Download your polished reel in seconds' },
  ];

  const templates = [
    { title: 'Quick Cut Energy', duration: '15s', tag: 'Trending' },
    { title: 'Story Arc', duration: '30s', tag: 'Popular' },
    { title: 'Product Showcase', duration: '20s', tag: 'New' },
    { title: 'Before/After', duration: '25s', tag: 'Viral' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-[#E5E5E8] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-6 h-6 text-[#007AFF]" />
            <span className="text-xl font-semibold text-[#1B1B1E]">ReelForge AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-[#3A3A3F] hover:text-[#007AFF] transition-colors">Templates</a>
            <a href="#" className="text-[#3A3A3F] hover:text-[#007AFF] transition-colors">Pricing</a>
            <a href="#" className="text-[#3A3A3F] hover:text-[#007AFF] transition-colors">Resources</a>
          </div>
          <div className="flex gap-3">
            <AppleButton variant="secondary">Sign In</AppleButton>
            <AppleButton variant="primary">Get Started</AppleButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#007AFF]/10 rounded-full">
              <Sparkles className="w-4 h-4 text-[#007AFF]" />
              <span className="text-sm text-[#007AFF]">AI-Powered Video Editing</span>
            </div>
            <h1 className="text-6xl font-semibold text-[#1B1B1E] leading-tight">
              From Raw Clip to Viral Reel — Instantly.
            </h1>
            <p className="text-xl text-[#63636A]">
              AI-powered editing built for creators. Fast, clean, premium.
            </p>
            <div className="flex gap-4">
              <AppleButton variant="primary" className="text-lg px-8 py-4">
                Try 3 Free Exports
              </AppleButton>
              <AppleButton variant="secondary" className="text-lg px-8 py-4">
                See Demo
              </AppleButton>
            </div>
          </div>

          {/* Device Mockup */}
          <div className="relative">
            <AppleCard className="p-8 aspect-[9/16] max-w-sm mx-auto bg-gradient-to-br from-[#007AFF]/5 to-[#339AFF]/10">
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-[#007AFF] rounded-2xl flex items-center justify-center">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-[#63636A]">Preview Mockup</p>
                </div>
              </div>
            </AppleCard>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-[#1B1B1E] mb-4">
            Built for Every Creator Type
          </h2>
          <p className="text-lg text-[#63636A]">
            Optimized templates for your niche
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <AppleCard key={category.name} hover className="p-6 text-center">
              <div className="text-4xl mb-3">{category.icon}</div>
              <p className="font-medium text-[#1B1B1E]">{category.name}</p>
            </AppleCard>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-[#1B1B1E] mb-4">
            How It Works
          </h2>
          <p className="text-lg text-[#63636A]">
            Three simple steps to viral content
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <AppleCard key={step.number} className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#007AFF] text-white rounded-2xl flex items-center justify-center text-2xl font-semibold">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-[#1B1B1E] mb-2">{step.title}</h3>
              <p className="text-[#63636A]">{step.description}</p>
            </AppleCard>
          ))}
        </div>
      </section>

      {/* Popular Templates */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-[#1B1B1E] mb-4">
            Popular Templates
          </h2>
          <p className="text-lg text-[#63636A]">
            Start with proven viral formats
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <AppleCard key={template.title} hover className="p-6">
              <div className="aspect-[9/16] bg-gradient-to-br from-[#007AFF]/10 to-[#339AFF]/5 rounded-xl mb-4" />
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-[#1B1B1E]">{template.title}</h4>
                <span className="text-sm text-[#8E8E95]">{template.duration}</span>
              </div>
              <span className="inline-block px-3 py-1 bg-[#007AFF]/10 text-[#007AFF] rounded-full text-sm">
                {template.tag}
              </span>
            </AppleCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E5E8] mt-20">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-5 h-5 text-[#007AFF]" />
                <span className="font-semibold text-[#1B1B1E]">ReelForge AI</span>
              </div>
              <p className="text-sm text-[#63636A]">
                AI-powered video editing for modern creators
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-[#1B1B1E] mb-3">Product</h5>
              <ul className="space-y-2 text-sm text-[#63636A]">
                <li><a href="#" className="hover:text-[#007AFF]">Templates</a></li>
                <li><a href="#" className="hover:text-[#007AFF]">Pricing</a></li>
                <li><a href="#" className="hover:text-[#007AFF]">Features</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-[#1B1B1E] mb-3">Resources</h5>
              <ul className="space-y-2 text-sm text-[#63636A]">
                <li><a href="#" className="hover:text-[#007AFF]">Blog</a></li>
                <li><a href="#" className="hover:text-[#007AFF]">Tutorials</a></li>
                <li><a href="#" className="hover:text-[#007AFF]">Support</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-[#1B1B1E] mb-3">Company</h5>
              <ul className="space-y-2 text-sm text-[#63636A]">
                <li><a href="#" className="hover:text-[#007AFF]">About</a></li>
                <li><a href="#" className="hover:text-[#007AFF]">Contact</a></li>
                <li><a href="#" className="hover:text-[#007AFF]">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#E5E5E8] text-center text-sm text-[#8E8E95]">
            © 2025 ReelForge AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
