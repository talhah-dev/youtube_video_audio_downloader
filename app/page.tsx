"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { UrlInputForm } from "@/components/url-input-form";
import { VideoCard } from "@/components/video-card";
import { FormatSelector } from "@/components/format-selector";
import { FeatureGrid } from "@/components/feature-grid";
import { HistoryDrawer } from "@/components/history-drawer";
import { DownloadToast } from "@/components/download-toast";
import { SessionModal } from "@/components/session-modal";
import { VideoMetadata, HistoryItem } from "@/lib/types";

export default function Home() {
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [toastState, setToastState] = useState<{
    isVisible: boolean;
    type: "video" | "audio";
    quality: string;
  }>({
    isVisible: false,
    type: "video",
    quality: "",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("streamflow_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
      const savedCookie = localStorage.getItem("streamflow_yt_cookie");
      if (savedCookie && savedCookie.trim()) {
        setHasActiveSession(true);
        document.cookie = `streamflow_yt_cookie=${encodeURIComponent(savedCookie.trim())}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch {}
  }, []);

  const saveHistoryItem = (item: HistoryItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== item.id);
      const updated = [item, ...filtered].slice(0, 15);
      try {
        localStorage.setItem("streamflow_history", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("streamflow_history");
    } catch {}
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem("streamflow_history", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentUrl(url);

    try {
      const savedCookie = typeof window !== "undefined" ? localStorage.getItem("streamflow_yt_cookie") || "" : "";
      const res = await fetch("/api/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(savedCookie ? { "x-youtube-cookie": savedCookie } : {}),
        },
        body: JSON.stringify({ url, cookie: savedCookie }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process video");
      }

      setMetadata(data);

      saveHistoryItem({
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        channelTitle: data.channelTitle,
        duration: data.duration,
        url: data.url,
        timestamp: Date.now(),
      });
    } catch (err: any) {
      const msg = err?.message || "An unexpected error occurred";
      setError(msg);
      if (
        msg.toLowerCase().includes("bot") ||
        msg.toLowerCase().includes("sign in") ||
        msg.toLowerCase().includes("player")
      ) {
        setIsSessionModalOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionSaved = () => {
    try {
      const saved = localStorage.getItem("streamflow_yt_cookie");
      setHasActiveSession(Boolean(saved && saved.trim()));
      if (currentUrl && saved && saved.trim()) {
        handleAnalyze(currentUrl);
      }
    } catch {}
  };

  const handleDownloadStarted = (type: "video" | "audio", quality: string) => {
    setToastState({
      isVisible: true,
      type,
      quality,
    });
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#000000] flex flex-col font-sans selection:bg-[#dceeb1] selection:text-[#000000]">
      <Navbar
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        hasActiveSession={hasActiveSession}
        onOpenSession={() => setIsSessionModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col items-center space-y-12">
        <div className="w-full text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.6px] bg-[#f4ecd6] text-[#000000] px-4 py-1.5 rounded-full border border-[#000000] font-semibold">
            <span>● FAST YOUTUBE MEDIA EXTRACTOR</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-[-1.5px] sm:tracking-[-2px] text-[#000000] leading-[1.05]">
            Download YouTube in{" "}
            <span className="font-bold underline decoration-[#dceeb1] decoration-wavy decoration-2">
              4K & Studio MP3
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#000000] max-w-xl mx-auto font-normal opacity-85 leading-relaxed tracking-[-0.2px]">
            Direct streaming downloads for ultra high-definition video and 320 kbps lossless audio. No registration, no ads, no wait times.
          </p>
        </div>

        <UrlInputForm
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          error={error}
          onOpenSession={() => setIsSessionModalOpen(true)}
        />

        {metadata && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-300">
            <VideoCard metadata={metadata} />
            <FormatSelector
              metadata={metadata}
              onDownloadStarted={handleDownloadStarted}
            />
          </div>
        )}

        <FeatureGrid />
      </main>

      <footer className="w-full border-t border-[#e6e6e6] bg-[#ffffff] py-14 text-xs text-[#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-2xl font-bold tracking-[-0.5px] text-[#000000]">
              StreamFlow
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[0.5px] text-[#666666]">
              A Technical & Joyful YouTube Media Engine
            </p>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.5px]">
            <span>4K 2160P</span>
            <span>•</span>
            <span>1080P FHD</span>
            <span>•</span>
            <span>320 KBPS MP3</span>
            <span>•</span>
            <span>DASH MUXING</span>
          </div>
        </div>
      </footer>

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={history}
        onSelectItem={(url) => handleAnalyze(url)}
        onClearHistory={handleClearHistory}
        onDeleteItem={handleDeleteHistoryItem}
      />

      <DownloadToast
        isVisible={toastState.isVisible}
        type={toastState.type}
        quality={toastState.quality}
        onClose={() => setToastState((prev) => ({ ...prev, isVisible: false }))}
      />

      <SessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        onSaved={handleSessionSaved}
      />
    </div>
  );
}
