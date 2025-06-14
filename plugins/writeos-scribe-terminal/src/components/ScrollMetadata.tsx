"use client";

export default function ScrollMetadata() {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 mb-4">
      <div className="text-xs text-zinc-400 mb-2">Scroll Metadata</div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-zinc-500">Words:</span>
          <span className="text-white">0</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Characters:</span>
          <span className="text-white">0</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Last saved:</span>
          <span className="text-white">Never</span>
        </div>
      </div>
    </div>
  );
}
