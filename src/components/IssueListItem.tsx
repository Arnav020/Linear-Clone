'use client';

import { useState } from 'react';
import { Sparkles, X, Loader2, CheckCircle2, Circle, Clock, MoreHorizontal, AlertCircle } from 'lucide-react';
import { analyzeIssueAction } from '@/app/actions/ai';

interface IssueListItemProps {
  issue: any; 
}

import StatusDropdown from './StatusDropdown';

// ... imports

import IssueCheckbox from './IssueCheckbox';
import { useIssueSelection } from '@/context/IssueSelectionContext';

// ... imports

import AssigneeDropdown from './AssigneeDropdown';
import PriorityDropdown from './PriorityDropdown';
import LabelDropdown from './LabelDropdown';

import IssueDetailModal from './IssueDetailModal';

export default function IssueListItem({ issue }: IssueListItemProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const { isSelectionMode, selectedIssueIds, toggleSelection } = useIssueSelection();
  const isSelected = selectedIssueIds.has(issue.id);

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

  const dateStr = new Date(issue.created_at || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  return (
    <div 
        onClick={(e) => {
            if (isSelectionMode || e.metaKey || e.ctrlKey) {
                e.preventDefault();
                toggleSelection(issue.id);
            } else {
                setIsDetailOpen(true);
            }
        }}
        style={{ zIndex: showAnalysis ? 50 : undefined }}
        className={`relative group flex items-center gap-3 px-3 py-2 cursor-pointer transition-all duration-150 rounded-sm mb-[1px] shadow-sm hover:shadow-md hover:-translate-y-[1px] hover:z-50 focus-within:z-50
            ${isSelected ? 'bg-blue-500/10 border-blue-500/50 z-2' : 'bg-[#1C1E22] hover:bg-[#232529] border-transparent hover:border-[#2A2D35]/50 z-1'}
        `}
    >
        {/* Checkbox (Hover/Selected) */}
        <div className={`absolute left-3 transition-opacity duration-200 ${isSelected || isSelectionMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <IssueCheckbox checked={isSelected} onChange={() => toggleSelection(issue.id)} />
        </div>

        {/* Identifier */}
        <div className={`font-mono text-[#7C7F88] text-xs shrink-0 w-14 transition-opacity duration-200 ${isSelected || isSelectionMode ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}>
            LIN-{issue.id.slice(0,3).toUpperCase()}
        </div>
        
        {/* Priority */}
        <div className="shrink-0 flex items-center justify-center w-4">
            <PriorityDropdown issueId={issue.id} currentPriority={issue.priority} />
        </div>

        {/* Status */}
        <div className="shrink-0 flex items-center justify-center w-4 h-4">
            <StatusDropdown issueId={issue.id} currentStatus={issue.status} />
        </div>

        {/* Title & Labels */}
        <div className="flex-1 min-w-0 flex items-center gap-2 mr-2">
            <span className="text-[#E3E4E6] text-sm font-medium truncate leading-tight">
                {issue.title}
            </span>
            <LabelDropdown issueId={issue.id} currentLabels={issue.labels} />
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

        {/* Assignee */}
        <div className="shrink-0">
            <AssigneeDropdown issueId={issue.id} currentAssignee={issue.assignee_name} projectId={issue.project_id} />
        </div>

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

      {/* Detail Modal */}
      <IssueDetailModal 
        issue={issue}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
