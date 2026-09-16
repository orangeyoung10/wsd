import React, { useState } from 'react';
import { RULE_DICTIONARY } from '../data/rulesData';
import { RuleDefinition } from '../types';
import { X, Search, ShieldAlert, BookOpen, Filter, CheckCircle2 } from 'lucide-react';

interface RuleLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RuleLibraryModal: React.FC<RuleLibraryModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<'ALL' | 'KYC' | 'KYB'>('ALL');
  const [vetoOnly, setVetoOnly] = useState(false);

  if (!isOpen) return null;

  const filteredRules = RULE_DICTIONARY.filter((r) => {
    if (moduleFilter !== 'ALL' && r.module !== moduleFilter) return false;
    if (vetoOnly && !r.is_veto) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.rule_code.toLowerCase().includes(q) ||
        r.rule_name.toLowerCase().includes(q) ||
        r.data_source.toLowerCase().includes(q) ||
        r.error_strategy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">
                MAAP 审核规则编码（Rule Code）与核验矩阵字典
              </h2>
              <p className="text-xs text-slate-500">
                全量抽象标准规则原子项、数据源、处理方式、权重及准入级别
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索规则编码、名称、数据来源..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-blue-500 focus:bg-white text-slate-800"
            />
          </div>

          {/* Module Tabs & Veto Toggle */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                onClick={() => setModuleFilter('ALL')}
                className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  moduleFilter === 'ALL' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                }`}
              >
                全部 ({RULE_DICTIONARY.length})
              </button>
              <button
                onClick={() => setModuleFilter('KYC')}
                className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  moduleFilter === 'KYC' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                }`}
              >
                KYC 模块
              </button>
              <button
                onClick={() => setModuleFilter('KYB')}
                className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-colors ${
                  moduleFilter === 'KYB' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
                }`}
              >
                KYB 模块
              </button>
            </div>

            <button
              onClick={() => setVetoOnly(!vetoOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
                vetoOnly
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ShieldAlert className={`w-3.5 h-3.5 ${vetoOnly ? 'text-rose-600' : 'text-slate-400'}`} />
              <span>仅看一票否决项</span>
            </button>
          </div>
        </div>

        {/* Rules Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-3 px-3 w-28">模块 / 编码</th>
                  <th className="py-3 px-3 w-40">规则名称</th>
                  <th className="py-3 px-3 w-36">数据来源</th>
                  <th className="py-3 px-3">处理方式 (AI / 底账)</th>
                  <th className="py-3 px-3">容错 / 处置策略</th>
                  <th className="py-3 px-3 w-20 text-center">权重</th>
                  <th className="py-3 px-3 w-24 text-center">一票否决</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredRules.map((rule) => (
                  <tr key={rule.rule_code} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                          {rule.module}
                        </span>
                        <span>{rule.rule_code}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900">{rule.rule_name}</td>
                    <td className="py-3 px-3 text-slate-600">{rule.data_source}</td>
                    <td className="py-3 px-3 text-slate-700 font-mono text-[11px] leading-relaxed">
                      {rule.processing_method}
                    </td>
                    <td className="py-3 px-3 text-slate-600 leading-relaxed">
                      {rule.error_strategy}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700">
                      {rule.weight}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {rule.is_veto ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200">
                          <ShieldAlert className="w-3 h-3 text-rose-600" />
                          否决项
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          <span>共展示 {filteredRules.length} / {RULE_DICTIONARY.length} 项标准原子规则</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 cursor-pointer"
          >
            关闭字典
          </button>
        </div>
      </div>
    </div>
  );
};
