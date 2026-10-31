"use client";

import React, { useState } from "react";
import { Link as LinkIcon, Sparkles, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UrlInputFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  error?: string | null;
}

const SAMPLE_URLS = [
  { label: "Rick Astley 4K", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", color: "bg-[#dceeb1]" },
  { label: "Sintel 4K Movie", url: "https://www.youtube.com/watch?v=eRsGyueVLvQ", color: "bg-[#c5b0f4]" },
  { label: "Big Buck Bunny 4K", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", color: "bg-[#f4ecd6]" },
];

export function UrlInputForm({ onAnalyze, isLoading, error }: UrlInputFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAnalyze(url.trim());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        onAnalyze(text.trim());
      }
    } catch {}
  };

  const handleClear = () => {
    setUrl("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full"
      >
        <div className="flex items-center bg-white border border-[#000000] rounded-full p-1.5 shadow-[0_2px_0_#000000] transition-all">
          <div className="flex items-center justify-center pl-4 pr-1 text-[#000000]">
            <LinkIcon className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube link (e.g. https://www.youtube.com/watch?v=...)"
            className="w-full bg-transparent px-3 py-3 text-sm md:text-base text-[#000000] placeholder:text-[#888888] focus:outline-none font-sans"
            disabled={isLoading}
          />

          <div className="flex items-center gap-1.5 pr-1">
            {url && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-[#000000] hover:bg-[#f7f7f5] rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handlePaste}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs h-9 px-4 rounded-full"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#000000]" />
              <span>Paste</span>
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="default"
              isLoading={isLoading}
              className="h-10 md:h-11 px-6 md:px-8 min-w-[90px] sm:min-w-[105px] rounded-full font-semibold flex items-center justify-center gap-2"
            >
              <span>Fetch</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </form>

      {error && (
        <div className="w-full mt-4 px-5 py-3 rounded-2xl bg-[#efd4d4] border border-[#000000] text-[#000000] text-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#000000]" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="w-full flex items-center gap-2 mt-5 flex-wrap justify-center sm:justify-start">
        <span className="font-mono text-xs uppercase tracking-[0.54px] text-[#000000] font-semibold mr-1">
          Try Link:
        </span>
        {SAMPLE_URLS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setUrl(sample.url);
              onAnalyze(sample.url);
            }}
            className={`font-mono text-[11px] uppercase tracking-[0.5px] px-3.5 py-1.5 rounded-full ${sample.color} text-[#000000] border border-[#000000] font-medium hover:opacity-85 transition-opacity`}
          >
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
}
