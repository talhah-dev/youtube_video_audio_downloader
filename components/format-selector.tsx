"use client";

import React, { useState } from "react";
import { Download, Film, Music, HardDrive, ArrowDownToLine, Check } from "lucide-react";
import { VideoMetadata, VideoFormatOption, AudioFormatOption } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface FormatSelectorProps {
  metadata: VideoMetadata;
  onDownloadStarted?: (type: "video" | "audio", quality: string) => void;
}

export function FormatSelector({ metadata, onDownloadStarted }: FormatSelectorProps) {
  const [activeTab, setActiveTab] = useState<"video" | "audio">("video");
  const [downloadingItem, setDownloadingItem] = useState<string | null>(null);

  const handleDownloadVideo = (format: VideoFormatOption) => {
    const itemKey = `video-${format.itag}`;
    setDownloadingItem(itemKey);
    onDownloadStarted?.("video", format.resolution);

    const savedCookie = typeof window !== "undefined" ? localStorage.getItem("streamflow_yt_cookie") || "" : "";
    const query = new URLSearchParams({
      url: metadata.url,
      type: "video",
      itag: format.itag.toString(),
      format: format.container || "mp4",
      title: metadata.title,
      ...(savedCookie ? { cookie: savedCookie } : {}),
    });

    const downloadUrl = `/api/download?${query.toString()}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${metadata.title}.${format.container || "mp4"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingItem(null);
    }, 4000);
  };

  const handleDownloadAudio = (format: AudioFormatOption) => {
    const itemKey = `audio-${format.bitrate}-${format.container}`;
    setDownloadingItem(itemKey);
    onDownloadStarted?.("audio", format.bitrate);

    const savedCookie = typeof window !== "undefined" ? localStorage.getItem("streamflow_yt_cookie") || "" : "";
    const query = new URLSearchParams({
      url: metadata.url,
      type: "audio",
      itag: format.itag.toString(),
      format: format.container,
      bitrate: format.bitrate,
      title: metadata.title,
      ...(savedCookie ? { cookie: savedCookie } : {}),
    });

    const downloadUrl = `/api/download?${query.toString()}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${metadata.title}.${format.container}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingItem(null);
    }, 4000);
  };

  return (
    <div className="w-full bg-[#f7f7f5] border border-[#e6e6e6] rounded-[24px] p-6 sm:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e6e6e6] pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.6px] text-[#000000] font-semibold block mb-1">
            Output Format
          </span>
          <h3 className="text-2xl font-bold tracking-[-0.3px] text-[#000000]">
            Select Download Quality
          </h3>
        </div>

        <div className="flex items-center gap-2 p-1 bg-[#ffffff] rounded-full border border-[#e6e6e6]">
          <button
            type="button"
            onClick={() => setActiveTab("video")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.54px] font-mono transition-all ${
              activeTab === "video"
                ? "bg-[#000000] text-[#ffffff]"
                : "bg-transparent text-[#000000] hover:bg-[#f7f7f5]"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video (MP4)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("audio")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.54px] font-mono transition-all ${
              activeTab === "audio"
                ? "bg-[#000000] text-[#ffffff]"
                : "bg-transparent text-[#000000] hover:bg-[#f7f7f5]"
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Audio (MP3)</span>
          </button>
        </div>
      </div>

      {activeTab === "video" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metadata.videoFormats.map((format) => {
            const isDownloading = downloadingItem === `video-${format.itag}`;
            const is4k = format.resolution.includes("2160p");
            const is1080p = format.resolution.includes("1080p");

            return (
              <div
                key={format.itag}
                className="flex flex-col justify-between p-6 rounded-[24px] bg-[#ffffff] border border-[#e6e6e6] hover:border-[#000000] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[#000000] tracking-[-0.5px]">
                        {format.resolution}
                      </span>
                      {format.fps && format.fps >= 60 && (
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#000000] text-[#ffffff]">
                          {format.fps}FPS
                        </span>
                      )}
                    </div>

                    {is4k ? (
                      <span className="font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#ff3d8b] text-[#ffffff]">
                        4K ULTRA
                      </span>
                    ) : is1080p ? (
                      <span className="font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#dceeb1] text-[#000000] border border-[#000000]">
                        FULL HD
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2 mb-6 font-mono text-xs text-[#000000]">
                    <span className="uppercase font-semibold px-2.5 py-0.5 rounded-full bg-[#f7f7f5] border border-[#e6e6e6]">
                      {format.container}
                    </span>
                    {format.filesizeApprox && (
                      <span className="flex items-center gap-1 font-medium">
                        <HardDrive className="w-3 h-3 text-[#000000]" />
                        {format.filesizeApprox}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="default"
                  isLoading={isDownloading}
                  onClick={() => handleDownloadVideo(format)}
                  className="w-full gap-2 font-semibold text-xs h-10 rounded-full"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Download {format.resolution}</span>
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "audio" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metadata.audioFormats.map((format, idx) => {
            const itemKey = `audio-${format.bitrate}-${format.container}`;
            const isDownloading = downloadingItem === itemKey;
            const isHighest = idx === 0;

            return (
              <div
                key={idx}
                className={`flex flex-col justify-between p-6 rounded-[24px] bg-[#ffffff] border transition-all ${
                  isHighest ? "border-[#000000] shadow-[0_2px_0_#000000]" : "border-[#e6e6e6] hover:border-[#000000]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-[#000000] tracking-[-0.5px]">
                      {format.bitrate}
                    </span>
                    {isHighest && (
                      <span className="font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#c5b0f4] text-[#000000] border border-[#000000]">
                        STUDIO
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-medium text-[#000000] mb-3">
                    {format.label}
                  </div>

                  <div className="flex items-center gap-2 mb-6 font-mono text-xs text-[#000000]">
                    <span className="uppercase font-semibold px-2.5 py-0.5 rounded-full bg-[#f7f7f5] border border-[#e6e6e6]">
                      {format.container}
                    </span>
                    {format.filesizeApprox && (
                      <span className="flex items-center gap-1 font-medium">
                        <HardDrive className="w-3 h-3 text-[#000000]" />
                        {format.filesizeApprox}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="default"
                  isLoading={isDownloading}
                  onClick={() => handleDownloadAudio(format)}
                  className="w-full gap-2 font-semibold text-xs h-10 rounded-full"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Download {format.container.toUpperCase()}</span>
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
