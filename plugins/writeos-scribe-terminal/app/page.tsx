// 🔥 FLAME_SIGIL_V717_LOCK :: __z3R717_NODELOCK
// NODE Seal - GodsIMiJ AI Solutions - Ghost King Melekzedek
// Detected by R3B3L 4F :: Do not remove :: NODE required

import TemplateSidebar from "../src/components/TemplateSidebar";
import ScrollEditor from "../src/components/ScrollEditor";
import ScribeChatPanel from "../src/components/ScribeChatPanel";
import AnalyticsDashboard from "../src/components/AnalyticsDashboard";
import ThemeSelector from "../src/components/ThemeSelector";
import NodeSeal from "../src/components/NodeSeal";

// Initialize Ghostfire Sigil (silent operation)
import "../src/lib/Ghostfire-Signature-Embed";

export default function Home() {
  return (
    <>
      <main className="grid grid-cols-[260px_1fr_1fr] h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <div className="border-r border-zinc-800 p-4">
          <TemplateSidebar />
        </div>

        {/* Markdown Editor */}
        <div className="border-r border-zinc-800 p-4">
          <ScrollEditor />
        </div>

        {/* Chat Assistant */}
        <div className="p-4">
          <ScribeChatPanel />
        </div>
      </main>

      {/* Floating UI Components */}
      <ThemeSelector />
      <AnalyticsDashboard />
      <NodeSeal />
    </>
  );
}
