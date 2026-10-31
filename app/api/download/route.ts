import { NextRequest, NextResponse } from "next/server";
import { Ytdl, Client } from "@distube/ytdl-core";
import ffmpegStatic from "ffmpeg-static";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { cleanTitle } from "@/lib/utils";

export const dynamic = "force-dynamic";

function getFfmpegPath(): string {
  const localExe = path.join(
    process.cwd(),
    "node_modules",
    "ffmpeg-static",
    process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg"
  );
  if (fs.existsSync(localExe)) {
    return localExe;
  }
  if (typeof ffmpegStatic === "string" && !ffmpegStatic.startsWith("\\ROOT") && fs.existsSync(ffmpegStatic)) {
    return ffmpegStatic;
  }
  return "ffmpeg";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const itagStr = searchParams.get("itag");
    const type = searchParams.get("type") || "video";
    const requestedFormat = searchParams.get("format") || "mp4";
    const bitrate = searchParams.get("bitrate") || "320";
    const rawTitle = searchParams.get("title") || "download";

    if (!url) {
      return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
    }

    const ytdl = new Ytdl({
      clients: [
        Client.Tv,
        Client.WebEmbedded,
        Client.Mweb,
        Client.VisionOS,
        Client.WebCreator,
        Client.WebMusic,
      ],
      ...(process.env.YOUTUBE_COOKIE ? { cookie: process.env.YOUTUBE_COOKIE } : {}),
    });
    const safeTitle = cleanTitle(rawTitle) || "youtube_media";
    const asciiTitle = safeTitle.replace(/[^\x20-\x7E]/g, "").replace(/["']/g, "") || "download";
    const ffmpegPath = getFfmpegPath();

    if (type === "audio") {
      if (requestedFormat === "m4a") {
        const audioStream = ytdl.download(url, {
          quality: "highestaudio",
        });

        let isClosed = false;
        const webStream = new ReadableStream({
          start(controller) {
            audioStream.on("data", (chunk: Buffer) => {
              if (!isClosed) {
                controller.enqueue(new Uint8Array(chunk));
              }
            });
            audioStream.on("end", () => {
              if (!isClosed) {
                isClosed = true;
                controller.close();
              }
            });
            audioStream.on("error", (err) => {
              if (!isClosed) {
                isClosed = true;
                controller.error(err);
              }
            });
          },
          cancel() {
            isClosed = true;
            try {
              audioStream.destroy();
            } catch {}
          },
        });

        return new Response(webStream, {
          headers: {
            "Content-Disposition": `attachment; filename="${asciiTitle}.m4a"; filename*=UTF-8''${encodeURIComponent(safeTitle)}.m4a`,
            "Content-Type": "audio/mp4",
          },
        });
      }

      const audioBitrate = bitrate.replace(/[^0-9]/g, "") || "320";
      const audioStream = ytdl.download(url, {
        quality: "highestaudio",
      });

      const ffmpeg = spawn(ffmpegPath, [
        "-i",
        "pipe:0",
        "-vn",
        "-ab",
        `${audioBitrate}k`,
        "-f",
        "mp3",
        "pipe:1",
      ]);

      audioStream.pipe(ffmpeg.stdin);
      ffmpeg.stderr.resume();

      let isClosed = false;
      const webStream = new ReadableStream({
        start(controller) {
          ffmpeg.stdout.on("data", (chunk: Buffer) => {
            if (!isClosed) {
              controller.enqueue(new Uint8Array(chunk));
            }
          });
          ffmpeg.stdout.on("end", () => {
            if (!isClosed) {
              isClosed = true;
              controller.close();
            }
          });
          ffmpeg.on("error", (err) => {
            if (!isClosed) {
              isClosed = true;
              controller.error(err);
            }
          });
        },
        cancel() {
          isClosed = true;
          try {
            audioStream.destroy();
            ffmpeg.kill();
          } catch {}
        },
      });

      return new Response(webStream, {
        headers: {
          "Content-Disposition": `attachment; filename="${asciiTitle}.mp3"; filename*=UTF-8''${encodeURIComponent(safeTitle)}.mp3`,
          "Content-Type": "audio/mpeg",
        },
      });
    }

    const itag = itagStr ? parseInt(itagStr, 10) : undefined;
    const tempAudioFile = path.join(
      os.tmpdir(),
      `yt_audio_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.m4a`
    );

    const audioStream = ytdl.download(url, { quality: "highestaudio" });
    const audioFileWriter = fs.createWriteStream(tempAudioFile);

    await new Promise<void>((resolve, reject) => {
      audioStream.pipe(audioFileWriter);
      audioFileWriter.on("finish", () => resolve());
      audioFileWriter.on("error", (err) => reject(err));
      audioStream.on("error", (err) => reject(err));
    });

    const videoStream = ytdl.download(url, {
      quality: itag || "highestvideo",
    });

    const ffmpeg = spawn(ffmpegPath, [
      "-i",
      "pipe:0",
      "-i",
      tempAudioFile,
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-f",
      "mp4",
      "-movflags",
      "frag_keyframe+empty_moov",
      "pipe:1",
    ]);

    videoStream.pipe(ffmpeg.stdin);
    ffmpeg.stderr.resume();

    const cleanupTempFile = () => {
      try {
        if (fs.existsSync(tempAudioFile)) {
          fs.unlinkSync(tempAudioFile);
        }
      } catch {}
    };

    let isClosed = false;
    const webStream = new ReadableStream({
      start(controller) {
        ffmpeg.stdout.on("data", (chunk: Buffer) => {
          if (!isClosed) {
            controller.enqueue(new Uint8Array(chunk));
          }
        });
        ffmpeg.stdout.on("end", () => {
          if (!isClosed) {
            isClosed = true;
            controller.close();
            cleanupTempFile();
          }
        });
        ffmpeg.on("error", (err) => {
          if (!isClosed) {
            isClosed = true;
            controller.error(err);
            cleanupTempFile();
          }
        });
      },
      cancel() {
        isClosed = true;
        try {
          videoStream.destroy();
          ffmpeg.kill();
        } catch {}
        cleanupTempFile();
      },
    });

    return new Response(webStream, {
      headers: {
        "Content-Disposition": `attachment; filename="${asciiTitle}.mp4"; filename*=UTF-8''${encodeURIComponent(safeTitle)}.mp4`,
        "Content-Type": "video/mp4",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process download" },
      { status: 500 }
    );
  }
}
