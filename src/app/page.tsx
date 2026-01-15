import { createClient, Database } from '@/lib/supabase';
import { IssueSelectionProvider } from '@/context/IssueSelectionContext';
import BulkActionsMenu from '@/components/BulkActionsMenu';
import ProjectViews from '@/components/ProjectViews';

// Type definition
type Issue = Database['public']['Tables']['issues']['Row'];

// Force dynamic rendering since we are fetching data
export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase.from('issues').select('*').order('created_at', { ascending: false });
  const issues = data as Issue[] | null;

  return (
    <IssueSelectionProvider>
        <div className="h-full flex flex-col bg-[#0D0E11] text-[#E3E4E6] font-sans">
            <ProjectViews issues={issues || []} />
            <BulkActionsMenu />
            
            {/* Keyboard Hint */}
            <div className="fixed bottom-4 right-4 bg-[#1C1E22] border border-[#2A2D35] rounded px-2 py-1 flex items-center gap-2 shadow-lg opacity-80 hover:opacity-100 transition-opacity z-50">
                <div className="w-4 h-4 rounded bg-[#2A2D35] flex items-center justify-center text-[10px] text-[#7C7F88] font-bold">C</div>
                <span className="text-xs text-[#7C7F88]">Create new issue</span>
            </div>
        </div>
    </IssueSelectionProvider>
  );
}
