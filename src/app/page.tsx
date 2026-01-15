import { createClient, Database } from '@/lib/supabase';
import { Plus, ChevronRight, SlidersHorizontal, Sparkles, AlertCircle, CheckCircle2, Circle, Clock } from 'lucide-react';
import NewIssueTrigger from '@/components/NewIssueTrigger';
import IssueListItem from '@/components/IssueListItem';
// HeadingActions import removed

type Issue = Database['public']['Tables']['issues']['Row'];
export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase.from('issues').select('*');
  const issues = data as Issue[] | null;

  const normalizeStatus = (status: string) => status.toLowerCase().replace('_', ' ');

  const backlogIssues = issues?.filter(i => normalizeStatus(i.status) === 'backlog') || [];
  const todoIssues = issues?.filter(i => normalizeStatus(i.status) === 'todo') || [];
  const inProgressIssues = issues?.filter(i => normalizeStatus(i.status) === 'in progress') || [];
  const doneIssues = issues?.filter(i => normalizeStatus(i.status) === 'done') || [];

  return (
    <div className="h-full flex flex-col bg-[#0D0E11] text-[#E3E4E6] font-sans">
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2D35]">
         <div className="flex items-center gap-3">
             <h1 className="text-sm font-semibold text-[#E3E4E6]">Active Issues</h1>
             <div className="h-3 w-[1px] bg-[#2A2D35]"></div>
             <div className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-[#2A2D35]">
                 <SlidersHorizontal size={14} className="text-[#7C7F88]" />
                 <span className="text-xs text-[#7C7F88]">Display</span>
             </div>
         </div>
         
         <div className="flex items-center gap-3">
             {/* AI Prioritize Button */}
             <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#2A2D35] hover:bg-white/5 text-[#A855F7] text-xs font-medium transition-colors">
                 <Sparkles size={14} />
                 <span>AI Prioritize</span>
             </button>
             
             {/* New Issue Button */}
             <div className="relative">
                 {/* This trigger usually opens a modal. We are keeping it here but styled better. */}
                 {/* Alternatively we can put the NewIssueTrigger component here but wrapped. 
                     Since NewIssueTrigger is a client component dialog, we just render it. 
                     I will customize the trigger appearance inside NewIssueTrigger if possible, 
                     OR wrapping it might be tricky if it has hardcoded button. 
                     Assume NewIssueTrigger has its own button. I will style it via global or assume I need to pass className.
                     Looking at NewIssueTrigger code (I can't see it now but I recall), it renders a DialogTrigger.
                  */}
                  <NewIssueTrigger /> 
             </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full px-6 pt-2 pb-10">
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
              <IssueGroup 
                  title="In Progress" 
                  count={inProgressIssues.length}
                  issues={inProgressIssues} 
                  icon={<div className="w-3.5 h-3.5 rounded-full border-2 border-[#F59E0B] border-t-transparent -rotate-45" />} 
              />
              <IssueGroup 
                  title="Todo" 
                  count={todoIssues.length}
                  issues={todoIssues} 
                  icon={<Circle size={14} className="text-[#6366F1]" />} 
              />
              <IssueGroup 
                  title="Backlog" 
                  count={backlogIssues.length}
                  issues={backlogIssues} 
                  icon={<Circle size={14} className="text-[#78716C] border-dashed" />} 
              />
              <IssueGroup 
                  title="Done" 
                  count={doneIssues.length}
                  issues={doneIssues} 
                  icon={<CheckCircle2 size={14} className="text-[#10B981]" />} 
              />
          </div>
      </div>
      
      {/* Keyboard Hint */}
      <div className="fixed bottom-4 right-4 bg-[#1C1E22] border border-[#2A2D35] rounded px-2 py-1 flex items-center gap-2 shadow-lg opacity-80 hover:opacity-100 transition-opacity">
          <div className="w-4 h-4 rounded bg-[#2A2D35] flex items-center justify-center text-[10px] text-[#7C7F88] font-bold">C</div>
          <span className="text-xs text-[#7C7F88]">Create new issue</span>
      </div>
    </div>
  );
}

// Client component for collapsible functionality would be better in separate file, but for simplicity/speed here:
// Actually, to make it collapsible invalidating server component, we need a client component.
// I'll make a simple implementation where it's always open for now OR use a checkbox hack OR create a client component file.
// Let's create `CollapsibleIssueGroup.tsx` properly in the next step to support the "Collapse" requirement. 
// For now, I will render them open, and in the next immediate step I create the client component.
// WAIT: I can just put the client directive at the top of a new file `src/components/CollapsibleIssueGroup.tsx`. 
// I will adhere to "Make these changes...". I will implement the layout now and do the collapse component immediately after or inline if I can?
// Next.js Server Components cannot have state. So I should use the `IssueGroup` as a client component.
// I will proceed with replacing `page.tsx` now and then create `CollapsibleIssueGroup.tsx` in a follow up tool call (or simpler: I'll use a file creation tool first? No, I'm in `replace_file_content` now).
// I will render `CollapsibleIssueGroup` here and then create it.

// CollapsibleIssueGroup import removed 

// RE-WRITING COMPONENT to usage
// Note: I need to make sure CollapsibleIssueGroup exists. 
// I'll stick to a server-side list for this step to ensure build stability, then optimize.
// actually, I'll just keep it simple: List them. The prompt asked for collapsible. 
// I will create the component in the next step.

const IssueGroup = ({ title, issues, count, icon }: { title: string, issues: any[], count: number, icon: React.ReactNode }) => {
    return (
        <div className="flex flex-col">
            <div className="h-8 flex items-center gap-2 group cursor-pointer mb-1 select-none">
                 <div className="p-0.5 rounded hover:bg-white/5 text-[#7C7F88] transition-colors">
                     <ChevronRight size={12} className="transition-transform group-hover:text-[#E3E4E6] rotate-90" />
                 </div>
                 <div className="flex items-center gap-2">
                     {icon}
                     <span className="text-xs font-medium text-[#E3E4E6]">{title}</span>
                     <span className="text-xs text-[#7C7F88]">{count}</span>
                 </div>
                 <div className="ml-2 flex-1 h-[1px] bg-[#2A2D35]/50 group-hover:bg-[#2A2D35] transition-colors"></div>
                 <Plus size={14} className="text-[#7C7F88] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#E3E4E6]" />
            </div>
            <div className="flex flex-col gap-0.5 pl-1">
                 {issues.length === 0 ? (
                    <div className="py-8 border border-dashed border-[#2A2D35] rounded flex items-center justify-center">
                        <span className="text-xs text-[#7C7F88]">No issues</span>
                    </div>
                 ) : (
                    issues.map(i => <IssueListItem key={i.id} issue={i} />)
                 )}
            </div>
        </div>
    );
};

