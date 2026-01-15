import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { prioritizeBatchAction } from '@/app/actions/ai';
import AIRecommendationModal from './AIRecommendationModal';

export default function AIPrioritizeButton({ issues }: { issues: any[] }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const handlePrioritize = async () => {
    setLoading(true);
    try {
       const result = await prioritizeBatchAction(issues);
       console.log('Prioritization Result:', result);
       
       if (result?.recommendations?.length > 0) {
           const enrichedRecs = result.recommendations.map((r: any) => {
               const issue = issues.find(i => i.id === r.id);
               return {
                   ...r,
                   issueTitle: issue?.title || 'Unknown Issue'
               };
           });
           setRecommendations(enrichedRecs);
           setShowModal(true);
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
    <>
        <button 
            onClick={handlePrioritize}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#2A2D35] hover:bg-white/5 text-[#A855F7] text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            <span>AI Prioritize</span>
        </button>
        
        <AIRecommendationModal 
            isOpen={showModal} 
            onClose={() => setShowModal(false)} 
            recommendations={recommendations} 
        />
    </>
  );
}
