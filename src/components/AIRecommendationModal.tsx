'use client';

import { X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';

interface Recommendation {
  id: string;
  suggestedStatus: string;
  reason: string;
  issueTitle?: string; // Optional if we can map it back
}

interface AIRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: Recommendation[];
}

export default function AIRecommendationModal({ isOpen, onClose, recommendations }: AIRecommendationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-sans font-sans">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#1e2024] border border-[#2a2c30] rounded-xl shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2c30] bg-[#1e2024]">
            <div className="flex items-center gap-2 text-[#E3E4E6]">
                <Sparkles size={18} className="text-[#A855F7]" />
                <h2 className="text-base font-medium">AI Prioritization Recommendations</h2>
            </div>
            <button onClick={onClose} className="p-1.5 text-[#7C7F88] hover:text-[#E3E4E6] rounded hover:bg-[#2a2c30] transition-colors">
                <X size={18} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
             <div className="mb-6 bg-[#232529] border border-[#2A2D35] rounded-lg p-4 flex items-start gap-3">
                <div className="bg-[#A855F7]/10 p-2 rounded-full shrink-0">
                    <Sparkles size={16} className="text-[#A855F7]" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-[#E3E4E6] mb-1">Analysis Complete</h3>
                    <p className="text-sm text-[#878A94] leading-relaxed">
                        I've analyzed your backlog and identified <strong>{recommendations.length}</strong> issues that align with high-priority goals and should be moved to <strong>Todo</strong>.
                    </p>
                </div>
             </div>

             <div className="space-y-3">
                 {recommendations.map((rec) => (
                     <div key={rec.id} className="bg-[#16181D] border border-[#2A2D35] rounded-lg p-4 transition-colors hover:border-[#3a3d42]">
                         <div className="flex items-start justify-between gap-4 mb-2">
                             <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-[#7C7F88]">LIN-{rec.id.substring(0,3).toUpperCase()}</span>
                                {rec.issueTitle && <span className="text-sm font-medium text-[#E3E4E6]">{rec.issueTitle}</span>}
                             </div>
                             <div className="flex items-center gap-1.5 text-xs text-[#A855F7] bg-[#A855F7]/10 px-2 py-1 rounded border border-[#A855F7]/20">
                                 <span>Backlog</span>
                                 <ArrowRight size={10} />
                                 <span className="font-medium">{rec.suggestedStatus}</span>
                             </div>
                         </div>
                         <p className="text-sm text-[#878A94] leading-relaxed pl-1 border-l-2 border-[#2A2D35]">
                            {rec.reason}
                         </p>
                     </div>
                 ))}
             </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2a2c30] bg-[#1e2024] flex justify-end gap-3">
             <button 
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#C5C7D0] hover:text-[#E3E4E6] hover:bg-[#2A2D35] rounded transition-colors"
            >
                Dismiss
             </button>
             {/* Future: Add 'Apply Changes' button */}
        </div>
      </div>
    </div>,
    document.body
  );
}
