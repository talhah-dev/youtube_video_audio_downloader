"use client";

import React, { useState } from "react";
import { ExternalLink, Copy, Check, Eye, Clock, User, Share2 } from "lucide-react";
import { VideoMetadata } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VideoCardProps {
  metadata: VideoMetadata;
}

export function VideoCard({ metadata }: VideoCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(metadata.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const has4k = metadata.videoFormats.some((f) => f.quality.includes("2160p"));
  const has1080p = metadata.videoFormats.some((f) => f.quality.includes("1080p"));

  return (
    <div className="w-full bg-[#dceeb1] text-[#000000] border border-[#000000] rounded-[24px] p-6 sm:p-10 shadow-[0_4px_0_#000000]">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="relative w-full md:w-88 aspect-video rounded-[8px] overflow-hidden bg-black shrink-0 border border-[#000000]">
          <img
            src={metadata.thumbnail}
            alt={metadata.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-3 right-3">
            <span className="font-mono font-bold text-xs bg-[#000000] text-[#ffffff] px-2.5 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {metadata.duration}
            </span>
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-2">
            {has4k ? (
              <span className="font-mono font-bold text-[10px] uppercase bg-[#ff3d8b] text-[#ffffff] px-2.5 py-1 rounded-full">
                4K UHD
              </span>
            ) : has1080p ? (
              <span className="font-mono font-bold text-[10px] uppercase bg-[#000000] text-[#ffffff] px-2.5 py-1 rounded-full">
                1080P FHD
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between w-full space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs uppercase tracking-[0.6px] bg-[#ffffff] text-[#000000] px-3 py-1 rounded-full border border-[#000000]">
                VIDEO ID: {metadata.id}
              </span>
              {metadata.views && (
                <span className="font-mono text-xs uppercase tracking-[0.6px] bg-[#ffffff] text-[#000000] px-3 py-1 rounded-full border border-[#000000] flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {metadata.views} VIEWS
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#000000] leading-tight tracking-[-0.5px]">
              {metadata.title}
            </h2>

            <div className="flex items-center gap-2.5 pt-1">
              {metadata.channelAvatar ? (
                <img
                  src={metadata.channelAvatar}
                  alt={metadata.channelTitle}
                  className="w-6 h-6 rounded-full object-cover border border-[#000000]"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#000000] text-[#ffffff] flex items-center justify-center text-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
              <span className="text-sm font-semibold text-[#000000]">
                {metadata.channelTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-[#000000]/15">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyLink}
              className="text-xs h-9 px-4 rounded-full border border-[#000000] bg-white text-black font-semibold flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#1ea64a]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share URL</span>
                </>
              )}
            </Button>

            <a
              href={metadata.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button
                variant="primary"
                size="sm"
                className="text-xs h-9 px-4 rounded-full font-semibold flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open YouTube</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
