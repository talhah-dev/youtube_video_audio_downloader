"use client";

import React from "react";
import { Sparkles, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  historyCount?: number;
  onOpenHistory?: () => void;
  onQuickPaste?: () => void;
}

export function Navbar({ historyCount = 0, onOpenHistory, onQuickPaste }: NavbarProps) {
  return (
    <div className="sticky top-0 z-50 w-full bg-white">
      <header className="w-full border-b border-[#e6e6e6] h-14 bg-white flex items-center">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#000000] flex items-center justify-center">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[9px] border-l-[#ffffff] border-b-[5px] border-b-transparent ml-0.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl tracking-[-0.5px] text-[#000000]">
                StreamFlow
              </span>
              <span className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-[0.54px] bg-[#f7f7f5] text-[#000000] px-2 py-0.5 rounded-full border border-[#e6e6e6]">
                4K Media
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenHistory && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onOpenHistory}
                className="flex items-center gap-1.5 text-xs h-9 px-4 rounded-full font-medium"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>History</span>
                {historyCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#000000] text-[#ffffff] font-mono text-[10px]">
                    {historyCount}
                  </span>
                )}
              </Button>
            )}

            {onQuickPaste && (
              <Button
                variant="primary"
                size="sm"
                onClick={onQuickPaste}
                className="flex items-center gap-1.5 text-xs h-9 px-4 rounded-full font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Paste Link</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="w-full bg-[#000000] text-[#ffffff] h-9 overflow-hidden flex items-center border-b border-[#000000]">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.6px]">
          <span>★ Direct YouTube Downloader</span>
          <span>•</span>
          <span>4K UHD 60FPS Video</span>
          <span>•</span>
          <span>Studio 320 KBPS MP3 Audio</span>
          <span>•</span>
          <span>Zero Ads & Watermarks</span>
          <span>•</span>
          <span>Lossless DASH Audio Muxing</span>
          <span>•</span>
          <span>Free & Unlimited</span>
          <span>•</span>
          <span>★ Direct YouTube Downloader</span>
          <span>•</span>
          <span>4K UHD 60FPS Video</span>
          <span>•</span>
          <span>Studio 320 KBPS MP3 Audio</span>
          <span>•</span>
          <span>Zero Ads & Watermarks</span>
          <span>•</span>
          <span>Lossless DASH Audio Muxing</span>
          <span>•</span>
          <span>Free & Unlimited</span>
        </div>
      </div>
    </div>
  );
}
