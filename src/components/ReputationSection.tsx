import React from 'react';
import { RuleAuditItem } from '../types';
import { CompareCard } from './CompareCard';
import { Scale, CheckCircle2, AlertTriangle, XCircle, ShieldAlert, Gavel } from 'lucide-react';

interface ReputationSectionProps {
  reputationRules: RuleAuditItem[];
}

export const ReputationSection: React.FC<ReputationSectionProps> = ({ reputationRules }) => {
  const hasFail = reputationRules.some((r) => r.result === 'FAIL');
  const hasWarning = reputationRules.some((r) => r.result === 'WARNING');

  return (
    <div id="sec-reputation" className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              KYB 司法与声誉底线排查 (Judicial, Dishonest Debtor & Media Sentiment)
            </h2>
            <p className="text-xs text-slate-500">
              最高人民法院失信被执行人一票否决、国税重大税收违法黑名单、裁判文书涉案金额及反诈负面舆情
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasFail ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              命中失信一票否决 (FAIL)
            </span>
          ) : hasWarning ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              司法有关注项 (WARNING)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              司法声誉清白 (PASS)
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {reputationRules.map((rule) => (
          <CompareCard key={rule.rule_code} rule={rule} />
        ))}
      </div>
    </div>
  );
};
