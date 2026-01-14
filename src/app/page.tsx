import { createClient, Database } from '@/lib/supabase';

type Issue = Database['public']['Tables']['issues']['Row'];
import { Plus, Circle, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import NewIssueTrigger from '@/components/NewIssueTrigger';
import IssueCard from '@/components/IssueCard';
import AIPrioritizeButton from '@/components/AIPrioritizeButton';

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
        <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-100">My Issues</h1>
            <AIPrioritizeButton issues={backlogIssues} />
        </div>
        <NewIssueTrigger />
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

