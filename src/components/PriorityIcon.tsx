import { AlertCircle, ArrowUp, ArrowDown, Minus } from 'lucide-react';

export function PriorityIcon({ priority }: { priority: string | null }) {
  const iconMap: Record<string, React.ReactNode> = {
    'urgent': <AlertCircle className="w-3.5 h-3.5 text-red-500" />,
    'high': <ArrowUp className="w-3.5 h-3.5 text-orange-500" />,
    'medium': <Minus className="w-3.5 h-3.5 text-yellow-500" />,
    'low': <ArrowDown className="w-3.5 h-3.5 text-gray-500" />,
    'none': <Minus className="w-3.5 h-3.5 text-gray-700" />
  };

  return iconMap[priority?.toLowerCase() || 'none'] || iconMap['none'];
}
