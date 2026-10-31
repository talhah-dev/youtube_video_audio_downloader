"use client";

import React from "react";
import { X, Trash2, Clock, ArrowRight } from "lucide-react";
import { HistoryItem } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onSelectItem: (url: string) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onClearHistory,
  onDeleteItem,
}: HistoryDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#ffffff] border border-[#000000] rounded-[24px] p-6 sm:p-8 shadow-[0_6px_0_#000000] space-y-5">
        <div className="flex items-center justify-between border-b border-[#e6e6e6] pb-4">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#000000]" />
            <h3 className="font-bold text-xl tracking-[-0.3px] text-[#000000]">
              Recent Downloads
            </h3>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#f7f7f5] border border-[#e6e6e6] font-bold text-[#000000]">
              {items.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onClearHistory}
                className="text-xs h-8 px-3 rounded-full border border-[#e6e6e6]"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                <span>Clear</span>
              </Button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#f7f7f5] hover:bg-[#e6e6e6] flex items-center justify-center text-[#000000] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#f7f7f5] border border-[#e6e6e6] flex items-center justify-center text-[#000000]">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-[#000000]">
              No recent items
            </span>
            <span className="text-xs text-[#666666]">
              Extracted links will appear here for fast access
            </span>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between p-3 rounded-[12px] border border-[#e6e6e6] hover:border-[#000000] bg-[#ffffff] transition-all gap-3"
              >
                <div
                  onClick={() => {
                    onSelectItem(item.url);
                    onClose();
                  }}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <div className="relative w-16 h-10 rounded-[6px] overflow-hidden bg-black shrink-0 border border-[#000000]">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0.5 right-0.5 font-mono text-[9px] font-bold bg-[#000000] text-[#ffffff] px-1 rounded">
                      {item.duration}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#000000] truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#666666] truncate font-sans">
                      {item.channelTitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      onSelectItem(item.url);
                      onClose();
                    }}
                    className="w-8 h-8 rounded-full bg-[#000000] text-[#ffffff] hover:opacity-85 flex items-center justify-center transition-opacity"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="w-8 h-8 rounded-full bg-[#f7f7f5] hover:bg-[#efd4d4] text-[#000000] flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
