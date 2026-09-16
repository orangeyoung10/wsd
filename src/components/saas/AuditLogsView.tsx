import React, { useState } from 'react';
import { AuditLogEntry } from '../../types';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  FileCheck2,
  Lock,
  User,
  Clock,
  Terminal,
  ArrowUpDown,
  FileText
} from 'lucide-react';

interface AuditLogsViewProps {
  logs: AuditLogEntry[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    if (filterAction !== 'ALL' && log.action_type !== filterAction) {
      return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        log.merchant_name.toLowerCase().includes(term) ||
        log.application_no.toLowerCase().includes(term) ||
        log.details.toLowerCase().includes(term) ||
        log.operator.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <span>合规审计流水与全链路存证追溯</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            记录每一次自动化AI流水线调度、人工专员核验介入、规则权重策略调整之不可篡改电子凭据
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>SHA-256 电子证据防篡改加密留存</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索商户名称、单号、操作员或审计详情..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-slate-600 mr-1 whitespace-nowrap">事件类型:</span>
          {['ALL', 'AI_AUDIT', 'MANUAL_REVIEW', 'RULE_UPDATE', 'NEW_APPLICATION'].map((act) => (
            <button
              key={act}
              onClick={() => setFilterAction(act)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                filterAction === act
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {act === 'ALL'
                ? '全部'
                : act === 'AI_AUDIT'
                ? 'AI自动审核'
                : act === 'MANUAL_REVIEW'
                ? '人工复核'
                : act === 'RULE_UPDATE'
                ? '规则策略调整'
                : '新进件申报'}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Timeline Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-36">时间戳</th>
                <th className="py-3 px-3 w-28">操作事件</th>
                <th className="py-3 px-3">涉及商户 / 单号</th>
                <th className="py-3 px-3">操作主体 / 引擎</th>
                <th className="py-3 px-3">审计操作记录详情</th>
                <th className="py-3 px-4 w-44 font-mono">电子证据存证哈希</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.action_type === 'AI_AUDIT'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : log.action_type === 'MANUAL_REVIEW'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : log.action_type === 'RULE_UPDATE'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {log.action_type === 'AI_AUDIT'
                        ? 'AI自动审核'
                        : log.action_type === 'MANUAL_REVIEW'
                        ? '人工复核'
                        : log.action_type === 'RULE_UPDATE'
                        ? '规则更新'
                        : '进件录入'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-900">{log.merchant_name}</div>
                    <div className="text-[11px] font-mono text-slate-600">{log.application_no}</div>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-slate-700">
                    {log.operator}
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 leading-relaxed">
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-600">
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-[140px]" title={log.evidence_hash}>
                        {log.evidence_hash}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
