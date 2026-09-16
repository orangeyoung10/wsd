import React from 'react';
import { DocTabItem } from '../types';
import { ReportTabContainer } from './ReportTabContainer';
import { FileText, Handshake, CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

interface AgreementsSectionProps {
  agreements: DocTabItem[];
  onTriggerAIReasoning?: () => void;
}

export const AgreementsSection: React.FC<AgreementsSectionProps> = ({
  agreements,
  onTriggerAIReasoning,
}) => {
  const hasFail = agreements.some((a) =>
    a.audit_rules.some((r) => r.result === 'FAIL')
  );
  const hasWarning = agreements.some((a) =>
    a.audit_rules.some((r) => r.result === 'WARNING')
  );

  return (
    <div id="sec-agreements" className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              KYB 业务合作协议与贸易背景核验 (KYB Agreements & Trade Contracts)
            </h2>
            <p className="text-xs text-slate-500">
              签约主体穿透、对手方存续状态、合同标的与经营范围语义契合度、公章防伪
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onTriggerAIReasoning && (
            <button
              onClick={onTriggerAIReasoning}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>LLM 品目与范围匹配推理</span>
            </button>
          )}

          {hasFail ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              合同存在违规 (FAIL)
            </span>
          ) : hasWarning ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              需人工确认 (WARNING)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              协议核验通过 (PASS)
            </span>
          )}
        </div>
      </div>

      <ReportTabContainer items={agreements} type="agreement" />
    </div>
  );
};
