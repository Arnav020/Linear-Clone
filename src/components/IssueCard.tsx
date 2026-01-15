'use client';

import { useState } from 'react';
import { AlertCircle, Sparkles, X, Loader2 } from 'lucide-react';
import { analyzeIssueAction } from '@/app/actions/ai';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface IssueCardProps {
  issue: any;
}

import { PriorityIcon } from './PriorityIcon';

export default function IssueCard({ issue }: IssueCardProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Drag and Drop hook
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: issue.id,
    data: { issue }, // Pass issue data for event handling
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1, // Visual feedback while dragging
    zIndex: showAnalysis ? 50 : undefined,
  };

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

  const getPriorityColor = (priority: string) => {
      switch(priority) {
          case 'Urgent': return 'bg-[#ef4444]';
          case 'High': return 'bg-[#F97316]';
          case 'Medium': return 'bg-[#F59E0B]';
          case 'Low': return 'bg-[#3F4149]';
          default: return 'bg-[#2A2D35]';
      }
  };

  return (
    <div 
        ref={setNodeRef} 
        style={style} 
        {...listeners} 
        {...attributes}
        className={`relative group bg-[#1C1E22] hover:bg-[#232529] border border-[#2A2D35] hover:border-[#3a3d42] rounded-md p-3 shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing select-none overflow-hidden hover:z-50 focus-within:z-50 ${isDragging ? 'z-50' : 'z-1'}`}
    >
      {/* Colored Priority Bar on Left */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityColor(issue.priority)}`} />

      <div className="pl-2 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium text-[#E3E4E6] leading-snug line-clamp-3">{issue.title}</span>
            <button 
              onClick={handleAnalyze}
              className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-[#5E6AD2]/20 text-[#7C7F88] hover:text-[#5E6AD2] shrink-0 ${showAnalysis ? 'opacity-100 text-[#5e6ad2]' : ''}`}
              onPointerDown={(e) => e.stopPropagation()} // Prevent drag start on button click
            >
              <Sparkles size={14} />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-1">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#7C7F88]">LIN-{issue.id.slice(0, 3).toUpperCase()}</span>
             </div>
             <div className="flex items-center gap-2">
                <div title={`Priority: ${issue.priority}`}>
                  <PriorityIcon priority={issue.priority} />
                </div>
                {/* Assignee Avatar */}
                {issue.assignee_name ? (
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-bold border border-[#2A2D35]" title={issue.assignee_name}>
                        {issue.assignee_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                ) : (
                    <div className="w-4 h-4 rounded-full bg-[#2A2D35] border border-[#3a3d42] flex items-center justify-center">
                    </div>
                )}
             </div>
          </div>
      </div>

      {/* Analysis Popover */}
      {showAnalysis && (
        <div 
            className="absolute top-full left-0 right-0 z-20 mt-1 bg-[#16181D] border border-[#2A2D35] shadow-xl rounded-lg p-3 text-xs animate-in fade-in zoom-in-95 duration-200 cursor-default"
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag when interacting with popover
        >
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#2A2D35]">
             <span className="font-semibold text-[#8B5CF6] flex items-center gap-1">
               <Sparkles size={12} /> AI Analysis
             </span>
             <button onClick={(e) => { e.stopPropagation(); setShowAnalysis(false); }} className="text-[#7C7F88] hover:text-[#E3E4E6]">
               <X size={12} />
             </button>
          </div>
          
          {isAnalyzing ? (
             <div className="flex items-center gap-2 text-[#7C7F88] py-2 justify-center">
               <Loader2 size={14} className="animate-spin" /> Analyzing...
             </div>
          ) : analysis ? (
             <div className="space-y-2 text-[#E3E4E6]">
                <div className="grid grid-cols-2 gap-2">
                   <div className="bg-[#1C1E22] p-1.5 rounded border border-[#2A2D35]">
                     <span className="text-[#7C7F88] block text-[10px] uppercase tracking-wider">Priority</span>
                     <span className="font-medium">{analysis.priority}</span>
                   </div>
                   <div className="bg-[#1C1E22] p-1.5 rounded border border-[#2A2D35]">
                     <span className="text-[#7C7F88] block text-[10px] uppercase tracking-wider">Complexity</span>
                     <div className="flex gap-0.5 mt-1">
                       {[1,2,3,4,5].map(v => (
                          <div key={v} className={`w-1.5 h-1.5 rounded-full ${v <= analysis.complexity ? 'bg-[#5E6AD2]' : 'bg-[#2A2D35]'}`} />
                       ))}
                     </div>
                   </div>
                </div>
                <div className="bg-[#1C1E22] p-2 rounded border border-[#2A2D35]">
                   <span className="text-[#7C7F88] block text-[10px] uppercase tracking-wider mb-1">Reasoning</span>
                   <p className="text-[#E3E4E6] leading-relaxed text-[11px]">{analysis.reasoning}</p>
                </div>
             </div>
          ) : (
            <div className="text-red-400">Failed.</div>
          )}
        </div>
      )}
    </div>
  );
}
