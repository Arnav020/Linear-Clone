
import { Layers, Plus } from 'lucide-react';

export default function ViewsPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#0D0E11] text-[#E3E4E6]">
        <div className="max-w-md text-center flex flex-col items-center">
            <div className="mb-6 opacity-30">
                <Layers size={64} strokeWidth={1} />
            </div>
            <h1 className="text-lg font-medium mb-2">Views</h1>
            <p className="text-[#7C7F88] text-sm mb-8 leading-relaxed">
                Create custom views using filters to show only the issues you want to see. You can save, share, and favorite these views.
            </p>
            <div className="flex gap-3">
                <button className="bg-[#5E6AD2] hover:bg-[#6B76E8] text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5">
                    Create new view
                </button>
                <button className="bg-[#1C1E22] hover:bg-[#2A2D35] border border-[#2A2D35] text-[#E3E4E6] px-3 py-1.5 rounded-md text-xs font-medium">
                    Documentation
                </button>
            </div>
        </div>
    </div>
  );
}
