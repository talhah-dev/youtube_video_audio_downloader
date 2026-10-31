import { NextRequest, NextResponse } from "next/server";
import { Ytdl } from "@distube/ytdl-core";
import { formatBytes, formatSeconds, formatViews } from "@/lib/utils";
import { AudioFormatOption, VideoFormatOption, VideoMetadata } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body?.url?.trim();

    if (!url) {
      return NextResponse.json({ error: "Please enter a valid YouTube URL" }, { status: 400 });
    }

    const ytdl = new Ytdl(
      process.env.YOUTUBE_COOKIE ? { cookie: process.env.YOUTUBE_COOKIE } : {}
    );
    const info = await ytdl.getInfo(url);
    const details = info.videoDetails;

    const seenResolutions = new Set<string>();
    const videoFormats: VideoFormatOption[] = [];

    const sortedFormats = [...info.formats].sort((a, b) => {
      const aRes = parseInt(a.qualityLabel || "0", 10);
      const bRes = parseInt(b.qualityLabel || "0", 10);
      return bRes - aRes;
    });

    for (const f of sortedFormats) {
      if (!f.qualityLabel || !f.hasVideo) continue;
      const key = `${f.qualityLabel}-${f.container}`;
      if (seenResolutions.has(key)) continue;
      seenResolutions.add(key);

      const isHighQuality =
        f.qualityLabel.includes("2160p") ||
        f.qualityLabel.includes("1440p") ||
        f.qualityLabel.includes("1080p");

      const cl = typeof f.contentLength === "number" ? f.contentLength : f.contentLength ? parseInt(f.contentLength, 10) : undefined;

      videoFormats.push({
        itag: f.itag,
        quality: f.qualityLabel,
        resolution: f.qualityLabel,
        container: f.container || "mp4",
        hasAudio: f.hasAudio || false,
        hasVideo: true,
        fps: f.fps,
        filesizeApprox: cl ? formatBytes(cl) : undefined,
        isHighQuality,
      });
    }

    const durationSec = typeof details.lengthSeconds === "number" ? details.lengthSeconds : parseInt(details.lengthSeconds || "0", 10);

    const audioFormats: AudioFormatOption[] = [
      {
        itag: 140,
        bitrate: "320 kbps",
        container: "mp3",
        label: "Studio Ultra HD",
        filesizeApprox: durationSec > 0
          ? formatBytes((durationSec * 320 * 1024) / 8)
          : undefined,
      },
      {
        itag: 140,
        bitrate: "256 kbps",
        container: "mp3",
        label: "High Fidelity",
        filesizeApprox: durationSec > 0
          ? formatBytes((durationSec * 256 * 1024) / 8)
          : undefined,
      },
      {
        itag: 140,
        bitrate: "192 kbps",
        container: "mp3",
        label: "Standard Quality",
        filesizeApprox: durationSec > 0
          ? formatBytes((durationSec * 192 * 1024) / 8)
          : undefined,
      },
      {
        itag: 140,
        bitrate: "128 kbps",
        container: "m4a",
        label: "Original AAC",
        filesizeApprox: durationSec > 0
          ? formatBytes((durationSec * 128 * 1024) / 8)
          : undefined,
      },
    ];

    const bestThumbnail =
      details.thumbnails && details.thumbnails.length > 0
        ? details.thumbnails[details.thumbnails.length - 1].url
        : `https://i.ytimg.com/vi/${details.id}/maxresdefault.jpg`;

    const metadata: VideoMetadata = {
      id: details.id,
      url: details.url,
      title: details.title,
      duration: formatSeconds(durationSec),
      durationSeconds: durationSec,
      thumbnail: bestThumbnail,
      channelTitle: details.author?.name || "YouTube Creator",
      channelUrl: details.author?.url || "",
      channelAvatar: details.author?.thumbnails?.[0]?.url,
      views: formatViews(details.viewCount || 0),
      uploadDate: details.uploadDate || "",
      videoFormats,
      audioFormats,
    };

    return NextResponse.json(metadata);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve video details. Please verify the URL." },
      { status: 500 }
    );
  }
}
