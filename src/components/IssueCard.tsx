'use client';

import { useState } from 'react';
import { AlertCircle, Sparkles, X, Loader2 } from 'lucide-react';
import { analyzeIssueAction } from '@/app/actions/ai';

interface IssueCardProps {
  issue: any; // Using any for now to match previous loose typing, ideal to import Issue type
}

export default function IssueCard({ issue }: IssueCardProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening issue detail if we had that logic
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

  const PriorityIcon = ({ priority }: { priority: string }) => {
    switch(priority) {
      case 'High': return <AlertCircle size={14} className="text-orange-500" />;
      case 'Medium': return <div className="w-3.5 h-[2px] bg-orange-400 rounded-full" />;
      case 'Low': return <div className="w-3.5 h-[2px] bg-gray-500 rounded-full" />;
      default: return <div className="w-3 h-3 border border-gray-600 rounded box-border border-dashed" />;
    }
  };

  return (
    <div className="relative group bg-[#1e2024] hover:bg-[#25282d] border border-[#2a2c30] hover:border-[#3a3d42] rounded-md p-3.5 shadow-sm transition-all duration-200 cursor-default select-none">
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-[13px] font-medium text-gray-200 leading-snug line-clamp-2">{issue.title}</span>
        
        {/* AI Analyze Button - Visible on hover or when analyzing/showing results */}
        <button 
          onClick={handleAnalyze}
          className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-[#5e6ad2]/20 text-gray-500 hover:text-[#5e6ad2] ${showAnalysis ? 'opacity-100 text-[#5e6ad2]' : ''}`}
          title="AI Analyze Issue"
        >
          <Sparkles size={14} />
        </button>
      </div>
      
      <div className="flex items-center justify-between mt-auto">
         <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-gray-500 group-hover:text-gray-400 transition-colors">LIN-{issue.id.slice(0, 4).toUpperCase()}</span>
         </div>
         <div className="flex items-center gap-2">
            <div title={`Priority: ${issue.priority}`}>
              <PriorityIcon priority={issue.priority} />
            </div>
            {issue.assignee_id ? (
              <div className="w-4 h-4 rounded-full bg-blue-600 text-[9px] flex items-center justify-center text-white font-bold">
                 A
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-gray-700 bg-transparent border-dashed"></div>
            )}
         </div>
      </div>

      {/* Analysis Popover */}
      {showAnalysis && (
        <div className="absolute top-10 right-0 left-0 z-20 bg-[#25282d] border border-[#3a3d42] shadow-xl rounded-lg p-3 text-xs animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#3a3d42]">
             <span className="font-semibold text-[#8B5CF6] flex items-center gap-1">
               <Sparkles size={12} /> Gemini Analysis
             </span>
             <button onClick={(e) => { e.stopPropagation(); setShowAnalysis(false); }} className="text-gray-500 hover:text-gray-300">
               <X size={12} />
             </button>
          </div>
          
          {isAnalyzing ? (
             <div className="flex items-center gap-2 text-gray-400 py-2 justify-center">
               <Loader2 size={14} className="animate-spin" /> Thinking...
             </div>
          ) : analysis ? (
             <div className="space-y-2 text-gray-300">
                <div className="grid grid-cols-2 gap-2">
                   <div>
                     <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Priority</span>
                     <span className="font-medium text-gray-200">{analysis.priority}</span>
                   </div>
                   <div>
                     <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Complexity</span>
                     <div className="flex gap-0.5 mt-1">
                       {[1,2,3,4,5].map(v => (
                          <div key={v} className={`w-1.5 h-1.5 rounded-full ${v <= analysis.complexity ? 'bg-[#5e6ad2]' : 'bg-gray-700'}`} />
                       ))}
                     </div>
                   </div>
                </div>
                {analysis.blockers && analysis.blockers.length > 0 && (
                   <div>
                      <span className="text-gray-500 block text-[10px] uppercase tracking-wider mb-1">Potential Blockers</span>
                      <ul className="list-disc pl-3 text-gray-400">
                         {analysis.blockers.map((b: string, i: number) => <li key={i}>{b}</li>)}
                      </ul>
                   </div>
                )}
                <div>
                   <span className="text-gray-500 block text-[10px] uppercase tracking-wider mb-1">Reasoning</span>
                   <p className="text-gray-400 leading-relaxed">{analysis.reasoning}</p>
                </div>
             </div>
          ) : (
            <div className="text-red-400">Failed to analyze.</div>
          )}
        </div>
      )}
    </div>
  );
}
