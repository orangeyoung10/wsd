import React from 'react';
import { RuleAuditItem } from '../types';
import { CompareCard } from './CompareCard';
import { Globe, CheckCircle2, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

interface SceneProbeSectionProps {
  scenes: RuleAuditItem[];
}

export const SceneProbeSection: React.FC<SceneProbeSectionProps> = ({ scenes }) => {
  const hasFail = scenes.some((s) => s.result === 'FAIL');
  const hasWarning = scenes.some((s) => s.result === 'WARNING');

  return (
    <div id="sec-scene" className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-100 text-cyan-700">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              KYB 网络场景动态探测 (Online Scene & Cyber Probing)
            </h2>
            <p className="text-xs text-slate-500">
              工信部ICP域名备案一致性、WHOIS时效、无头浏览器动态页面DOM与HTTP活性、收银台支付闭环穿透
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasFail ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              未备案或涉恶意跳转 (FAIL)
            </span>
          ) : hasWarning ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              场景需关注 (WARNING)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              线上场景合规活跃 (PASS)
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {scenes.map((rule) => (
          <CompareCard key={rule.rule_code} rule={rule} />
        ))}
      </div>
    </div>
  );
};
