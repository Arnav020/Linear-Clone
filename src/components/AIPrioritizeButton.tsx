'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { prioritizeBatchAction } from '@/app/actions/ai';

export default function AIPrioritizeButton({ issues }: { issues: any[] }) {
  const [loading, setLoading] = useState(false);

  const handlePrioritize = async () => {
    setLoading(true);
    try {
       const result = await prioritizeBatchAction(issues);
       console.log('Prioritization Result:', result);
       // In a real app, we would dispatch updates to these issues or show a toast.
       // For this clone, we'll alert or just log, as we don't have a global store yet.
       if (result?.recommendations?.length > 0) {
           alert(`AI Recommends moving ${result.recommendations.length} issues to Todo:\n` + 
                 result.recommendations.map((r: any) => `- ${r.suggestedStatus} (ID ${r.id}): ${r.reason}`).join('\n'));
       } else {
           alert("AI didn't find any urgent issues to move.");
       }
    } catch (e) {
        console.error(e);
        alert('Failed to run AI prioritization');
    } finally {
        setLoading(false);
    }
  };

  return (
    <button 
        onClick={handlePrioritize}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#2A2D35] hover:bg-white/5 text-[#A855F7] text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        <span>AI Prioritize</span>
    </button>
  );
}
