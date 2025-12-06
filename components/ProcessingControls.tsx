import React from 'react';
import { RefineMode, RefineOption } from '../types';
import { Button } from './Button';
import { CheckCheck, Languages, Table, FileText, ListChecks } from 'lucide-react';

interface ProcessingControlsProps {
  onRefine: (mode: RefineMode) => void;
  isLoading: boolean;
}

const OPTIONS: RefineOption[] = [
  {
    id: RefineMode.PROOFREAD_EN,
    label: 'Proofread (EN)',
    icon: 'check',
    description: 'Fix grammar & polish tone',
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: RefineMode.TRANSLATE_EN,
    label: 'Translate to EN',
    icon: 'globe',
    description: 'Portuguese to English',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: RefineMode.TABLE_FORMAT,
    label: 'Format Table',
    icon: 'table',
    description: 'Convert data to tables',
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    id: RefineMode.PROOFREAD_PT,
    label: 'Proofread (PT)',
    icon: 'file-text',
    description: 'Revisão em Português',
    color: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: RefineMode.SUMMARIZE,
    label: 'Summarize',
    icon: 'list',
    description: 'Executive bullet points',
    color: 'bg-rose-50 text-rose-700 border-rose-200'
  }
];

const IconMap = {
  'check': CheckCheck,
  'globe': Languages,
  'table': Table,
  'file-text': FileText,
  'list': ListChecks
};

export const ProcessingControls: React.FC<ProcessingControlsProps> = ({ onRefine, isLoading }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-6">
      {OPTIONS.map((opt, index) => {
        const Icon = IconMap[opt.icon as keyof typeof IconMap];
        return (
          <button
            key={opt.id}
            onClick={() => onRefine(opt.id)}
            disabled={isLoading}
            className={`
              relative group flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200
              ${opt.color} hover:shadow-md hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none
            `}
          >
            <div className="mb-2 p-2 bg-white rounded-full shadow-sm">
              <Icon size={20} />
            </div>
            <span className="text-sm font-semibold text-center leading-tight">{opt.label}</span>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white text-xs flex items-center justify-center rounded-full font-bold shadow-md">
              {index + 1}
            </div>
            <span className="absolute bottom-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded -mb-8 pointer-events-none whitespace-nowrap z-10">
              {opt.description}
            </span>
          </button>
        );
      })}
    </div>
  );
};