'use client';

import { useState } from 'react';
import { Sparkles, Loader2, X, Check, ArrowRight } from 'lucide-react';
import { prioritizeBatchAction } from '@/app/actions/ai';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AIPrioritizeButtonProps {
  issues: any[]; // Backlog issues
}

export default function AIPrioritizeButton({ issues }: AIPrioritizeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isApplying, setIsApplying] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleAnalyze = async () => {
    setIsOpen(true);
    setIsAnalyzing(true);
    setRecommendations([]); // clear previous
    
    // Only send backlog issues to AI
    const result = await prioritizeBatchAction(issues);
    
    if (result && result.recommendations) {
        setRecommendations(result.recommendations);
        // Default select all recommendations
        setSelectedIds(new Set(result.recommendations.map((r: any) => r.id)));
    }
    setIsAnalyzing(false);
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
        newSet.delete(id);
    } else {
        newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const applyChanges = async () => {
    if (selectedIds.size === 0) return;
    
    setIsApplying(true);
    
    const updates = Array.from(selectedIds).map(id => {
        const rec = recommendations.find(r => r.id === id);
        return supabase.from('issues').update({ status: rec.suggestedStatus }).eq('id', id);
    });

    await Promise.all(updates);
    
    setIsApplying(false);
    setIsOpen(false);
    router.refresh();
  };

  if (issues.length === 0) return null;

  return (
    <>
      <button 
        onClick={handleAnalyze}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#5e6ad2]/10 hover:bg-[#5e6ad2]/20 border border-[#5e6ad2]/20 text-[#8B5CF6] rounded-md text-sm font-medium transition-colors"
      >
        <Sparkles size={14} />
        AI Prioritize
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative w-full max-w-lg bg-[#1e2024] border border-[#2a2c30] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
             <div className="p-4 border-b border-[#2a2c30] flex items-center justify-between">
                <h3 className="text-gray-200 font-medium flex items-center gap-2">
                    <Sparkles size={16} className="text-[#8B5CF6]" />
                    AI Prioritization
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-300">
                    <X size={18} />
                </button>
             </div>
             
             <div className="p-6 overflow-y-auto min-h-[200px]">
                {isAnalyzing ? (
                   <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-400">
                      <Loader2 size={24} className="animate-spin text-[#8B5CF6]" />
                      <p className="text-sm">Analyzing backlog...</p>
                   </div>
                ) : recommendations.length > 0 ? (
                   <div className="space-y-4">
                      <p className="text-sm text-gray-400">
                        I found {recommendations.length} issues that could be prioritized. Select the ones you want to move to Todo.
                      </p>
                      
                      <div className="space-y-2">
                        {recommendations.map(rec => {
                            const issue = issues.find(i => i.id === rec.id);
                            if (!issue) return null;
                            
                            return (
                                <div 
                                    key={rec.id} 
                                    className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${selectedIds.has(rec.id) ? 'bg-[#5e6ad2]/10 border-[#5e6ad2]/30' : 'bg-[#25282d] border-[#3a3d42] hover:border-[#4a4d52]'}`}
                                    onClick={() => toggleSelection(rec.id)}
                                >
                                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${selectedIds.has(rec.id) ? 'bg-[#5e6ad2] border-[#5e6ad2]' : 'border-gray-600 bg-transparent'}`}>
                                        {selectedIds.has(rec.id) && <Check size={10} className="text-white" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <span className="text-sm font-medium text-gray-200 truncate">{issue.title}</span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2c30] text-gray-400 font-mono">
                                                Backlog <ArrowRight size={8} className="inline mx-1" /> Todo
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">{rec.reason}</p>
                                    </div>
                                </div>
                            );
                        })}
                      </div>
                   </div>
                ) : (
                   <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
                      <p>No high-priority items found in backlog.</p>
                      <button onClick={() => setIsOpen(false)} className="text-sm text-[#5e6ad2] hover:underline">Close</button>
                   </div>
                )}
             </div>
             
             {recommendations.length > 0 && !isAnalyzing && (
                 <div className="p-4 border-t border-[#2a2c30] bg-[#1e2024] flex justify-end gap-3">
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={applyChanges}
                        disabled={isApplying || selectedIds.size === 0}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#5e6ad2] hover:bg-[#4e5ac2] disabled:opacity-50 text-white rounded-md text-sm font-medium"
                    >
                        {isApplying ? <Loader2 size={14} className="animate-spin" /> : null}
                        Apply to {selectedIds.size} Issues
                    </button>
                 </div>
             )}
          </div>
        </div>
      )}
    </>
  );
}
