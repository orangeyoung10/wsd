import React, { useState } from 'react';
import { DocTabItem } from '../types';
import { CompareCard } from './CompareCard';
import { FileText, Receipt, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

interface ReportTabContainerProps {
  items: DocTabItem[];
  type?: 'agreement' | 'invoice';
}

export const ReportTabContainer: React.FC<ReportTabContainerProps> = ({ items, type = 'agreement' }) => {
  const [activeTabId, setActiveTabId] = useState<string>(items[0]?.tab_id || '');

  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
        暂无核验凭证单据
      </div>
    );
  }

  const activeItem = items.find((i) => i.tab_id === activeTabId) || items[0];

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />;
      case 'WARNING':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 inline" />;
      case 'FAIL':
        return <XCircle className="w-3.5 h-3.5 text-rose-500 inline" />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      {/* Horizontal Scrolling Tab Bar */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
          {items.map((item) => {
            const isActive = item.tab_id === activeItem.tab_id;
            return (
              <button
                key={item.tab_id}
                onClick={() => setActiveTabId(item.tab_id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 -mb-0.5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {type === 'agreement' ? (
                  <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                ) : (
                  <Receipt className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                )}
                <span>{item.doc_name}</span>
                {getStatusIcon(item.summary_status)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Document Overview Card */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <span className="text-slate-400 mr-1">单据编号:</span>
            <span className="font-mono font-medium text-slate-800">{activeItem.doc_number || 'AUTO-GEN'}</span>
          </div>
          {activeItem.doc_type && (
            <div>
              <span className="text-slate-400 mr-1">类型:</span>
              <span className="font-medium text-slate-700">{activeItem.doc_type}</span>
            </div>
          )}
          {activeItem.doc_amount && (
            <div>
              <span className="text-slate-400 mr-1">金额规模:</span>
              <span className="font-bold text-slate-900 font-mono">{activeItem.doc_amount}</span>
            </div>
          )}
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span>包含核验规则:</span>
          <span className="font-bold text-slate-700 px-2 py-0.5 bg-slate-200/80 rounded-full">
            {activeItem.audit_rules.length} 项
          </span>
        </div>
      </div>

      {/* Rules list for this document tab */}
      <div className="p-4 space-y-3">
        {activeItem.audit_rules.map((rule) => (
          <CompareCard key={rule.rule_code} rule={rule} />
        ))}
      </div>
    </div>
  );
};
