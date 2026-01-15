'use client';

import { Check } from 'lucide-react';

interface IssueCheckboxProps {
  checked: boolean;
  onChange?: () => void;
  className?: string;
}

export default function IssueCheckbox({ checked, onChange, className = "" }: IssueCheckboxProps) {
  return (
    <div 
        onClick={(e) => {
            e.stopPropagation();
            if (onChange) onChange();
        }}
        className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${
            checked 
                ? 'bg-blue-500/20 border-blue-500 text-blue-500' 
                : 'border-[#2A2D35] hover:border-[#5E6AD2] bg-[#1C1E22]'
        } ${className}`}
    >
        {checked && <Check size={10} strokeWidth={3} />}
    </div>
  );
}
