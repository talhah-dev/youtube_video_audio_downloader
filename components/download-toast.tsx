"use client";

import React from "react";
import { DownloadCloud, Check, X } from "lucide-react";

interface DownloadToastProps {
  isVisible: boolean;
  type: "video" | "audio";
  quality: string;
  onClose: () => void;
}

export function DownloadToast({ isVisible, type, quality, onClose }: DownloadToastProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="flex items-center gap-3.5 bg-[#000000] text-[#ffffff] border border-[#000000] rounded-full px-5 py-3 shadow-[0_4px_0_#000000] max-w-sm">
        <div className="h-8 w-8 rounded-full bg-[#ffffff] text-[#000000] flex items-center justify-center shrink-0">
          <DownloadCloud className="w-4 h-4 animate-bounce" />
        </div>

        <div className="flex flex-col min-w-0 pr-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.5px] text-[#ffffff] flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#dceeb1]" />
            Download Started
          </span>
          <span className="font-sans text-xs text-[#cccccc] truncate">
            Streaming {quality} {type === "video" ? "MP4" : "MP3"}
          </span>
        </div>

        <button
          onClick={onClose}
          className="text-[#888888] hover:text-[#ffffff] p-1 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
