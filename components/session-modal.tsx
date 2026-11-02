"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldCheck, Key, ExternalLink, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function SessionModal({ isOpen, onClose, onSaved }: SessionModalProps) {
  const [cookieValue, setCookieValue] = useState("");
  const [hasActiveCookie, setHasActiveCookie] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem("streamflow_yt_cookie") || "";
        setCookieValue(saved);
        setHasActiveCookie(Boolean(saved.trim()));
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = cookieValue.trim();
    try {
      if (trimmed) {
        localStorage.setItem("streamflow_yt_cookie", trimmed);
        document.cookie = `streamflow_yt_cookie=${encodeURIComponent(trimmed)}; path=/; max-age=31536000; SameSite=Lax`;
        setHasActiveCookie(true);
      } else {
        localStorage.removeItem("streamflow_yt_cookie");
        document.cookie = "streamflow_yt_cookie=; path=/; max-age=0; SameSite=Lax";
        setHasActiveCookie(false);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      onSaved?.();
      onClose();
    } catch {}
  };

  const handleClear = () => {
    try {
      localStorage.removeItem("streamflow_yt_cookie");
      document.cookie = "streamflow_yt_cookie=; path=/; max-age=0; SameSite=Lax";
      setCookieValue("");
      setHasActiveCookie(false);
      onSaved?.();
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-[#000000] rounded-[28px] shadow-[0_8px_0_#000000] p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-5 border-b border-[#e6e6e6]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#dceeb1] border border-[#000000] flex items-center justify-center text-[#000000]">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-[-0.4px] text-[#000000]">
                YouTube Session Setup
              </h2>
              <p className="font-mono text-[11px] uppercase tracking-[0.5px] text-[#666666]">
                Bypass Bot Verification on Live Production
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f7f7f5] text-[#000000] border border-transparent hover:border-[#e6e6e6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto py-5 space-y-5 flex-1 pr-1">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f7f7f5] border border-[#e6e6e6]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className={`w-5 h-5 ${hasActiveCookie ? "text-[#16a34a]" : "text-[#888888]"}`} />
              <div className="text-xs">
                <span className="font-semibold block text-[#000000]">
                  {hasActiveCookie ? "Session Cookie Active" : "No Active Session Cookie"}
                </span>
                <span className="text-[#666666]">
                  {hasActiveCookie
                    ? "Your requests are being sent with your authenticated session."
                    : "YouTube blocks cloud servers (Vercel) unless authenticated."}
                </span>
              </div>
            </div>
            {hasActiveCookie && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-mono text-[#dc2626] hover:underline flex items-center gap-1 font-medium px-2 py-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-[0.5px] font-bold text-[#000000] block">
              How to get your cookie in 30 seconds:
            </span>
            <div className="text-xs space-y-2 text-[#222222]">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#000000] text-white font-mono text-[11px] flex items-center justify-center shrink-0">1</span>
                <span>Open YouTube in your browser while logged in with any Google account.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#000000] text-white font-mono text-[11px] flex items-center justify-center shrink-0">2</span>
                <span>
                  Export your YouTube cookie using a free extension like{" "}
                  <a
                    href="https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold underline text-[#000000] inline-flex items-center gap-0.5"
                  >
                    Get cookies.txt LOCALLY <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                  </a>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#000000] text-white font-mono text-[11px] flex items-center justify-center shrink-0">3</span>
                <span>Paste the downloaded text below and click <strong>Save & Activate</strong>.</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-[0.5px] font-bold text-[#000000] block">
              Cookie Data (Netscape or Raw String)
            </label>
            <textarea
              rows={4}
              value={cookieValue}
              onChange={(e) => setCookieValue(e.target.value)}
              placeholder="# Netscape HTTP Cookie File&#10;.youtube.com TRUE / TRUE 175...&#10;or paste your cookie header here"
              className="w-full p-3 rounded-2xl border border-[#000000] font-mono text-xs bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#000000] placeholder:text-[#999999]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#e6e6e6] flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="secondary"
            size="default"
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-6 rounded-full text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="default"
            onClick={handleSave}
            className="w-full sm:w-auto h-11 px-8 rounded-full text-xs font-semibold gap-2"
          >
            {isCopied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#dceeb1]" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save & Activate</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

