import { createClient, Database } from '@/lib/supabase';

type Issue = Database['public']['Tables']['issues']['Row'];
import { Plus, Circle, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

// Use this to enforce dynamic rendering since we are fetching data
export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase.from('issues').select('*');
  const issues = data as Issue[] | null;

  // Debug logging
  console.log('Fetched issues:', issues);

  // Helper to normalize status for comparison
  const normalizeStatus = (status: string) => status.toLowerCase().replace('_', ' ');

  // Group issues by status
  const backlogIssues = issues?.filter(i => normalizeStatus(i.status) === 'backlog') || [];
  const todoIssues = issues?.filter(i => normalizeStatus(i.status) === 'todo') || [];
  const inProgressIssues = issues?.filter(i => normalizeStatus(i.status) === 'in progress') || [];
  const doneIssues = issues?.filter(i => normalizeStatus(i.status) === 'done') || [];

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-[#2a2c30]">
        <h1 className="text-xl font-semibold text-gray-100">My Issues</h1>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#5e6ad2] hover:bg-[#4e5ac2] text-white rounded-[6px] text-sm font-medium transition-colors shadow-sm shadow-[#5e6ad2]/20">
          <Plus size={16} />
          New Issue
        </button>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full grid grid-cols-4 gap-6 p-8 min-w-[1000px]">
          <StatusColumn 
            title="Backlog" 
            count={backlogIssues.length} 
            issues={backlogIssues} 
            icon={<Circle size={14} className="text-gray-500 border-dashed" />} 
          />
          <StatusColumn 
            title="Todo" 
            count={todoIssues.length} 
            issues={todoIssues} 
            icon={<Circle size={14} className="text-gray-400" />} 
          />
          <StatusColumn 
            title="In Progress" 
            count={inProgressIssues.length} 
            issues={inProgressIssues} 
            icon={<Clock size={14} className="text-yellow-500" />} 
          />
          <StatusColumn 
            title="Done" 
            count={doneIssues.length} 
            issues={doneIssues} 
            icon={<CheckCircle2 size={14} className="text-blue-500" />} 
          />
        </div>
      </div>
    </div>
  );
}

const StatusColumn = ({ title, count, issues, icon }: { title: string, count: number, issues: any[], icon: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-full min-w-0">
      <div className="flex items-center justify-between mb-4 pl-1">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-200">{title}</span>
          <span className="text-xs text-gray-500">{count}</span>
        </div>
        <div className="flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
          <Plus size={14} className="text-gray-500 hover:text-gray-300 cursor-pointer" />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pr-1 pb-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {issues.length === 0 ? (
          <div className="text-center py-20">
             <span className="text-sm text-gray-600">No issues</span>
          </div>
        ) : (
          issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))
        )}
      </div>
    </div>
  );
};

const IssueCard = ({ issue }: { issue: any }) => {
  const PriorityIcon = ({ priority }: { priority: string }) => {
    switch(priority) {
      case 'High': return <AlertCircle size={14} className="text-orange-500" />;
      case 'Medium': return <div className="w-3.5 h-[2px] bg-orange-400 rounded-full" />; // Medium priority icon
      case 'Low': return <div className="w-3.5 h-[2px] bg-gray-500 rounded-full" />; // Low priority icon
      default: return <div className="w-3 h-3 border border-gray-600 rounded box-border border-dashed" />; // No priority
    }
  };

  return (
    <div className="group bg-[#1e2024] hover:bg-[#25282d] border border-[#2a2c30] hover:border-[#3a3d42] rounded-md p-3.5 shadow-sm transition-all duration-200 cursor-default select-none">
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-[13px] font-medium text-gray-200 leading-snug line-clamp-2">{issue.title}</span>
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
    </div>
  );
};
