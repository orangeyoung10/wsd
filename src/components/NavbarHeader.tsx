import React from 'react';
import {
  ShieldCheck,
  PlusCircle,
  BookOpen,
  Code2,
  Printer,
  ChevronDown,
  Building,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { MerchantAuditReport } from '../types';

interface NavbarHeaderProps {
  currentReport: MerchantAuditReport;
  cases: MerchantAuditReport[];
  onSelectCase: (index: number) => void;
  selectedCaseIndex: number;
  onOpenNewAudit: () => void;
  onOpenRuleLibrary: () => void;
  onOpenJSONReport: () => void;
  onTriggerAIReasoning: () => void;
}

export const NavbarHeader: React.FC<NavbarHeaderProps> = ({
  currentReport,
  cases,
  onSelectCase,
  selectedCaseIndex,
  onOpenNewAudit,
  onOpenRuleLibrary,
  onOpenJSONReport,
  onTriggerAIReasoning,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-wide text-white">MAAP</span>
                <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-400/30">
                  v3.8.2-PROD
                </span>
              </div>
              <h1 className="text-xs text-slate-400 font-medium">商户智能 AI 审核平台</h1>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={onOpenNewAudit}
              className="p-1.5 bg-blue-600 rounded-lg text-white"
              title="新建进件"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenRuleLibrary}
              className="p-1.5 bg-slate-800 rounded-lg text-slate-300"
              title="规则库"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Benchmark Case Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
          <span className="text-xs text-slate-400 font-medium pl-2 whitespace-nowrap hidden sm:inline">
            案例样板切换:
          </span>
          <select
            value={selectedCaseIndex}
            onChange={(e) => onSelectCase(Number(e.target.value))}
            className="bg-slate-900 text-xs font-semibold text-white px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-blue-500 cursor-pointer w-full md:w-auto truncate"
          >
            {cases.map((c, i) => (
              <option key={c.report_meta.report_id} value={i}>
                案例 {i + 1}: {c.merchant_info.merchant_name} (
                {c.overall_evaluation.final_decision} · {c.overall_evaluation.confidence_score}分)
              </option>
            ))}
          </select>
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onTriggerAIReasoning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 text-xs font-semibold transition-colors cursor-pointer"
            title="调用大模型进行多模态与语义跨实体深度一致性分析"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI 深度研判</span>
          </button>

          <button
            onClick={onOpenRuleLibrary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>规则字典矩阵</span>
          </button>

          <button
            onClick={onOpenNewAudit}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>新建进件审核</span>
          </button>

          <button
            onClick={onOpenJSONReport}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="查看 JSON Schema 数据"
          >
            <Code2 className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="打印或导出可视化样板报告"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
