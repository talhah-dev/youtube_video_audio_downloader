import React from "react";
import { Sparkles, Headphones, Zap, ShieldCheck, Gauge, Smartphone } from "lucide-react";

export function FeatureGrid() {
  const blocks = [
    {
      bg: "bg-[#c5b0f4]",
      textColor: "text-[#000000]",
      borderColor: "border-[#000000]",
      eyebrow: "RESOLUTION",
      title: "4K UHD & 60 FPS",
      desc: "Full resolution preserved straight from YouTube CDN servers with zero compression.",
      icon: Sparkles,
    },
    {
      bg: "bg-[#dceeb1]",
      textColor: "text-[#000000]",
      borderColor: "border-[#000000]",
      eyebrow: "AUDIO ENGINE",
      title: "320 KBPS MP3",
      desc: "Studio-grade audio conversion extracted directly from original AAC audio streams.",
      icon: Headphones,
    },
    {
      bg: "bg-[#f4ecd6]",
      textColor: "text-[#000000]",
      borderColor: "border-[#000000]",
      eyebrow: "FAST MUXING",
      title: "Lossless DASH Sync",
      desc: "FFmpeg pipeline combines video and audio on-the-fly without quality degradation.",
      icon: Zap,
    },
    {
      bg: "bg-[#c8e6cd]",
      textColor: "text-[#000000]",
      borderColor: "border-[#000000]",
      eyebrow: "DIRECT PIPE",
      title: "Instant Streaming",
      desc: "Downloads begin immediately without server queueing or intermediate waiting screens.",
      icon: Gauge,
    },
    {
      bg: "bg-[#efd4d4]",
      textColor: "text-[#000000]",
      borderColor: "border-[#000000]",
      eyebrow: "CLEAN & SAFE",
      title: "No Sign-up or Ads",
      desc: "Completely private media extractor with no invasive popups, redirect ads, or telemetry.",
      icon: ShieldCheck,
    },
    {
      bg: "bg-[#1f1d3d]",
      textColor: "text-[#ffffff]",
      borderColor: "border-[#000000]",
      eyebrow: "UNIVERSAL",
      title: "Cross-Device Ready",
      desc: "Works on desktop, tablet, and mobile browsers with native standard file downloads.",
      icon: Smartphone,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pt-12 pb-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="font-mono text-xs uppercase tracking-[0.6px] text-[#000000] font-semibold block mb-2">
          BUILT FOR CREATORS
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-[-1px] text-[#000000]">
          Engineering Behind the Downloads
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blocks.map((block, idx) => {
          const Icon = block.icon;
          return (
            <div
              key={idx}
              className={`rounded-[24px] border ${block.borderColor} ${block.bg} ${block.textColor} p-8 flex flex-col justify-between shadow-[0_3px_0_#000000]`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.6px] px-3 py-1 rounded-full border border-current opacity-85">
                    {block.eyebrow}
                  </span>
                  <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold tracking-[-0.4px] mb-3 leading-snug">
                  {block.title}
                </h3>

                <p className="text-sm font-normal opacity-90 leading-relaxed">
                  {block.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
