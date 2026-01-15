import { CheckCircle2, Circle, XCircle, X, HelpCircle, Ban } from 'lucide-react';

interface StatusIconProps {
  status: string;
  className?: string;
  size?: number;
}

export const StatusIcon = ({ status, className = "", size = 14 }: StatusIconProps) => {
  const s = status?.toLowerCase() || 'backlog';

  if (s === 'done') {
    return <CheckCircle2 size={size} className={`text-[#5E6AD2] ${className}`} />; 
    // Note: User asked for #1C1E22 bg, border-gray-700 for dropdown. 
    // Status color consistency:
    // Done: Checkmark. Linear usually uses blue/purple for Done or Green. 
    // History uses: text-[#10B981] (Green) for Done. I'll stick to history color unless it looks bad.
    // Actually, let's use the colors from the previous file content for consistency: text-[#10B981] for done.
  }
  
  if (s === 'in progress') {
    return (
      <div className={`w-3.5 h-3.5 rounded-full border-2 border-[#F59E0B] border-t-transparent -rotate-45 ${className}`} style={{ width: size, height: size }} />
    );
  }

  if (s === 'todo') {
    return <Circle size={size} className={`text-[#E3E4E6] ${className}`} />; // Linear Todo is usually light gray circle
  }

  if (s === 'canceled') {
    return <XCircle size={size} className={`text-[#78716C] ${className}`} />; // Gray X
  }
  
  if (s === 'duplicate') {
    return <XCircle size={size} className={`text-[#78716C] ${className}`} />; // Same as cancelled usually, or maybe generic X
  }

  // Backlog
  return <Circle size={size} className={`text-[#78716C] border-dashed ${className}`} />;
};

export const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || 'backlog';
    if (s === 'done') return 'text-[#10B981]';
    if (s === 'in progress') return 'text-[#F59E0B]';
    if (s === 'todo') return 'text-[#E3E4E6]';
    if (s === 'canceled') return 'text-[#78716C]';
    return 'text-[#78716C]';
};
