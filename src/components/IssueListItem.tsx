'use client';

import { useState } from 'react';
import { Sparkles, X, Loader2, CheckCircle2, Circle, Clock, MoreHorizontal, AlertCircle } from 'lucide-react';
import { analyzeIssueAction } from '@/app/actions/ai';

interface IssueListItemProps {
  issue: any; 
}

export default function IssueListItem({ issue }: IssueListItemProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (analysis) {
      setShowAnalysis(!showAnalysis);
      return;
    }

    setIsAnalyzing(true);
    setShowAnalysis(true);
    const result = await analyzeIssueAction(issue.title, issue.description);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const StatusIcon = ({ status }: { status: string }) => {
     const s = status.toLowerCase();
     if (s === 'done') return <CheckCircle2 size={14} className="text-[#10B981]" />;
     if (s === 'in progress') return <div className="w-3.5 h-3.5 rounded-full border-2 border-[#F59E0B] border-t-transparent -rotate-45" />;
     if (s === 'todo') return <Circle size={14} className="text-[#6366F1]" />;
     return <Circle size={14} className="text-[#78716C] border-dashed" />;
  };

  // Priority Icons (SVG signals)
  const PriorityIcon = ({ priority }: { priority: string }) => {
      switch(priority) {
          case 'Urgent': // Exclamation + Box
              return (
                <div className="flex items-center justify-center border border-[#ef4444] rounded-[3px] w-3.5 h-3.5">
                     <div className="w-[2px] h-[6px] bg-[#ef4444] rounded-full"></div>
                </div>
              );
          case 'High': // 3 Bars
              return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="8" width="2" height="4" rx="1" fill="#F97316"/><rect x="6" y="5" width="2" height="7" rx="1" fill="#F97316"/><rect x="10" y="2" width="2" height="10" rx="1" fill="#F97316"/></svg>;
          case 'Medium': // 2 Bars
              return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="8" width="2" height="4" rx="1" fill="#3F4149"/><rect x="6" y="5" width="2" height="7" rx="1" fill="#F59E0B"/><rect x="10" y="2" width="2" height="10" rx="1" fill="#F59E0B"/></svg>;
          case 'Low': // 1 Bar
              return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="8" width="2" height="4" rx="1" fill="#3F4149"/><rect x="6" y="5" width="2" height="7" rx="1" fill="#3F4149"/><rect x="10" y="2" width="2" height="10" rx="1" fill="#E3E4E6"/></svg>;
          default: // None (Dashed)
              return <div className="w-3.5 h-3.5 border border-dashed border-[#575a61] rounded-[3px]"></div>;
      }
  };

  const dateStr = new Date(issue.created_at || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  return (
    <div className="relative group bg-[#1C1E22] hover:bg-[#232529] border border-transparent hover:border-[#2A2D35]/50 flex items-center gap-3 px-3 py-2 cursor-pointer transition-all duration-150 rounded-sm mb-[1px] shadow-sm hover:shadow-md hover:-translate-y-[1px]">
        {/* Identifier */}
        <div className="font-mono text-[#7C7F88] text-xs shrink-0 w-14">
            LIN-{issue.id.slice(0,3).toUpperCase()}
        </div>

        {/* Priority */}
        <div className="shrink-0 flex items-center justify-center w-4" title={`Priority: ${issue.priority}`}>
            <PriorityIcon priority={issue.priority} />
        </div>

        {/* Status */}
        <div className="shrink-0 flex items-center justify-center w-4">
            <StatusIcon status={issue.status} />
        </div>

        {/* Title */}
        <div className="flex-1 text-[#E3E4E6] text-sm font-medium truncate leading-tight">
            {issue.title}
        </div>

        {/* AI Action */}
         <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 mr-2 transition-opacity duration-200">
            <button 
                onClick={handleAnalyze}
                className={`p-1 rounded hover:bg-[#5E6AD2]/20 text-[#7C7F88] hover:text-[#5E6AD2] ${showAnalysis ? 'opacity-100 text-[#5e6ad2]' : ''}`}
                title="AI Analyze"
            >
                <Sparkles size={14} />
            </button>
         </div>

        {/* Assignee (Mock) */}
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 border border-[#2A2D35] shrink-0"></div>

        {/* Date */}
        <div className="text-[#7C7F88] text-xs shrink-0 w-16 text-right">
            {dateStr}
        </div>

      {/* Analysis Popover */}
      {showAnalysis && (
        <div className="absolute top-8 left-1/3 z-20 bg-[#16181D] border border-[#2A2D35] shadow-xl rounded-lg p-3 text-xs w-[320px] animate-in fade-in zoom-in-95 duration-200">
           {isAnalyzing ? (
             <div className="flex items-center gap-2 text-[#7C7F88]">
               <Loader2 size={12} className="animate-spin" /> Analyzing...
             </div>
           ) : analysis ? (
             <div className="space-y-2">
                 <div className="flex justify-between border-b border-[#2A2D35] pb-1.5 mb-1.5">
                    <span className="font-semibold text-[#8B5CF6] flex items-center gap-1"><Sparkles size={10} /> AI Analysis</span>
                    <X size={12} className="cursor-pointer text-[#7C7F88] hover:text-[#E3E4E6]" onClick={(e) => { e.stopPropagation(); setShowAnalysis(false); }} />
                 </div>
                 <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#1C1E22] p-1.5 rounded border border-[#2A2D35]"><span className="text-[#7C7F88] block mb-0.5">Priority</span> <span className="text-[#E3E4E6] font-medium">{analysis.priority}</span></div>
                    <div className="bg-[#1C1E22] p-1.5 rounded border border-[#2A2D35]"><span className="text-[#7C7F88] block mb-0.5">Complexity</span> <span className="text-[#E3E4E6] font-medium">{analysis.complexity}/5</span></div>
                 </div>
                 <p className="text-[#E3E4E6] leading-relaxed opacity-90">{analysis.reasoning}</p>
             </div>
           ) : (
                <div className="text-red-400">Failed to analyze</div>
           )}
        </div>
      )}
    </div>
  );
}
