import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, XCircle, Info, ShieldAlert } from 'lucide-react';
import { RuleAuditItem } from '../types';

interface CompareCardProps {
  rule: RuleAuditItem;
  defaultExpanded?: boolean;
}

export const CompareCard: React.FC<CompareCardProps> = ({ rule, defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const getStatusBadge = () => {
    switch (rule.result) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            核验通过 (PASS)
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            存疑关注 (WARNING)
          </span>
        );
      case 'FAIL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            强规拦截 (FAIL)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            参考提示 (INFO)
          </span>
        );
    }
  };

  const hasCompareDetails = rule.compare_details && rule.compare_details.length > 0;
  const isDanger = rule.result === 'FAIL';
  const isWarning = rule.result === 'WARNING';

  return (
    <div
      id={`rule-${rule.rule_code}`}
      className={`rounded-xl border transition-all duration-200 bg-white overflow-hidden ${
        isDanger
          ? 'border-rose-200 shadow-sm'
          : isWarning
          ? 'border-amber-200 shadow-sm'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Header Bar */}
      <div
        onClick={() => setExpanded(!expanded)}
        className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
          isDanger
            ? 'bg-rose-50/50 hover:bg-rose-50'
            : isWarning
            ? 'bg-amber-50/40 hover:bg-amber-50/70'
            : 'bg-slate-50/60 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
            {rule.rule_code}
          </span>
          <span className="font-semibold text-sm text-slate-800">{rule.item_name}</span>
          {rule.is_veto && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-200">
              <ShieldAlert className="w-3 h-3" />
              一票否决项
            </span>
          )}
          {rule.rule_basis && (
            <span className="text-xs text-slate-500 hidden sm:inline-block">
              依据: {rule.rule_basis}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge()}
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 p-1"
            aria-label="展开或收起"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-4 space-y-3 text-sm border-t border-slate-100">
          {/* Main Detail Statement */}
          <div className="text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-100">
            <span className="font-medium text-slate-900 mr-2">【核验结论】</span>
            {rule.detail}
          </div>

          {/* Related Target Tag */}
          {rule.related_target && (
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="font-medium text-slate-600">目标实体/要素:</span>
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                {rule.related_target}
              </span>
            </div>
          )}

          {/* 逐项比对面板 (Expandable Compare Card): 双栏/三栏网格直接对冲 */}
          {hasCompareDetails && (
            <div className="mt-3 space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>要素逐项交叉对冲比对（OCR 提取值 vs 权威底账值）</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  红线标红项为关键不一致
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-slate-100/80 px-3 py-2 text-xs font-medium text-slate-600">
                  <div className="col-span-3">核验字段</div>
                  <div className="col-span-4">进件/OCR 识别值</div>
                  <div className="col-span-4">权威接口/官方底账值</div>
                  <div className="col-span-1 text-center">状态</div>
                </div>

                {/* Rows */}
                {rule.compare_details!.map((detail, idx) => {
                  const isRowMismatch = !detail.is_matched;
                  return (
                    <div
                      key={idx}
                      className={`grid grid-cols-12 px-3 py-2.5 text-xs items-center transition-colors ${
                        isRowMismatch
                          ? isDanger
                            ? 'diff-danger-border bg-rose-50/40'
                            : 'diff-warning-border bg-amber-50/40'
                          : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="col-span-3 font-medium text-slate-800">
                        {detail.field_name}
                      </div>
                      <div
                        className={`col-span-4 font-mono pr-2 break-all ${
                          isRowMismatch ? 'text-rose-700 font-semibold' : 'text-slate-600'
                        }`}
                      >
                        {detail.ocr_value || '—'}
                      </div>
                      <div className="col-span-4 font-mono pr-2 break-all text-slate-700">
                        {detail.auth_value || '—'}
                      </div>
                      <div className="col-span-1 text-center">
                        {detail.is_matched ? (
                          <span className="text-emerald-600 font-bold">✓</span>
                        ) : (
                          <span className="text-rose-600 font-bold">✗</span>
                        )}
                      </div>

                      {/* Explicit Difference Reason Banner at Bottom of Row */}
                      {detail.diff_reason && (
                        <div className="col-span-12 mt-1.5 pt-1.5 border-t border-rose-100 text-rose-800 text-xs flex items-center gap-1.5 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                          <span>差异说明：{detail.diff_reason}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
