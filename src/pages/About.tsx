import {
  AlertTriangle,
  Sparkles,
  Layers,
  Eye,
  Heart,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Page Title & Demo Environment Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#15221B]">
            About RoadsterAI
          </h1>
          <p className="text-sm text-[#5C6E63] mt-0.5">
            Smarter roads. Safer communities.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F4D9] border border-[#D2E4BE] text-[#2C5A20] text-xs font-semibold self-start sm:self-auto shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2C5A20]" />
          Demo Environment
        </span>
      </div>

      {/* Hero Banner with Integrated Road Photography */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0C2E24] text-white border border-[#0E382B] shadow-sm min-h-[220px] flex items-center">
        {/* Road photo on right with gradient mask */}
        <div className="absolute right-0 top-0 bottom-0 w-3/5 sm:w-1/2 opacity-60">
          <img
            src="https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80"
            alt="Urban road infrastructure"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C2E24] via-[#0C2E24]/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-10 max-w-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C8F169] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20L10 4H14L20 20H15L12 12L9 20H4Z" fill="#0C2E24" />
                <path d="M12 15V18" stroke="#C8F169" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">RoadsterAI</h2>
              <p className="text-[10px] text-[#A6CDB3]">Smart Road Damage Reporter</p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-normal">
            We use the power of open-source AI and community reporting to build smarter, safer and more resilient cities.
          </p>
        </div>
      </div>

      {/* 4 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* The Problem */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E6DC] shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#FFEBEE] border border-[#FFCDD2] flex items-center justify-center text-[#D32F2F] mb-3">
              <AlertTriangle size={18} />
            </div>
            <h3 className="text-sm font-bold text-[#15221B]">The Problem</h3>
            <p className="text-xs text-[#55655C] leading-relaxed mt-1">
              Road damage leads to accidents, higher maintenance costs and reduced quality of life.
            </p>
          </div>
        </div>

        {/* Our Solution */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E6DC] shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#E8F4D9] border border-[#D2E4BE] flex items-center justify-center text-[#2D5A20] mb-3">
              <Sparkles size={18} />
            </div>
            <h3 className="text-sm font-bold text-[#15221B]">Our Solution</h3>
            <p className="text-xs text-[#55655C] leading-relaxed mt-1">
              AI-assisted detection, easy reporting, and data-driven prioritization.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E6DC] shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#E3F2FD] border border-[#BBDEFB] flex items-center justify-center text-[#1976D2] mb-3">
              <Layers size={18} />
            </div>
            <h3 className="text-sm font-bold text-[#15221B]">How It Works</h3>
            <p className="text-xs text-[#55655C] leading-relaxed mt-1">
              1. Capture (upload photo)<br />
              2. Analyze (AI simulation)<br />
              3. Report (submit & track)
            </p>
          </div>
        </div>

        {/* Open Source AI Vision */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E6DC] shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#EDE7F6] border border-[#D1C4E9] flex items-center justify-center text-[#5E35B1] mb-3">
              <Eye size={18} />
            </div>
            <h3 className="text-sm font-bold text-[#15221B]">Open Source AI Vision</h3>
            <p className="text-xs text-[#55655C] leading-relaxed mt-1">
              We aim to integrate open-source computer vision models in the future to enable real-time, accurate damage detection.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 pb-4 border-t border-[#E2E6DC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A8B80]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#0E382B] flex items-center justify-center text-[#C8F169] text-[10px] font-bold">
            R
          </div>
          <span className="font-bold text-[#15221B]">RoadsterAI</span>
          <span>· Smart Road Damage Reporter</span>
        </div>
        <p className="flex items-center gap-1 font-medium">
          Built with <Heart size={13} className="text-red-500 fill-red-500" /> for safer roads.
        </p>
      </div>
    </div>
  );
}
