import React, { useState } from 'react';
import { AcquirerInstitution } from '../../types';
import { DEMO_ACQUIRERS } from '../../data/cardSchemeData';
import {
  Building2,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Search,
  Filter,
  SlidersHorizontal,
  Mail,
  Phone,
  FileSpreadsheet,
  Zap,
  ArrowUpDown,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';

interface AcquirerGovernanceViewProps {
  onTriggerSweepForAcquirer?: (acquirer: AcquirerInstitution) => void;
}

export const AcquirerGovernanceView: React.FC<AcquirerGovernanceViewProps> = ({
  onTriggerSweepForAcquirer,
}) => {
  const [acquirers, setAcquirers] = useState<AcquirerInstitution[]>(DEMO_ACQUIRERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'BANK' | 'PAYMENT_COMPANY'>('ALL');
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');

  // Modal State for modifying Acquirer permissions
  const [selectedAcqForEdit, setSelectedAcqForEdit] = useState<AcquirerInstitution | null>(null);
  const [editQuotaStatus, setEditQuotaStatus] = useState<'NORMAL' | 'WARNED' | 'RESTRICTED'>('NORMAL');
  const [editGreenChannel, setEditGreenChannel] = useState(true);
  const [penaltyReason, setPenaltyReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredAcquirers = acquirers.filter((acq) => {
    const matchSearch =
      acq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acq.short_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acq.code.includes(searchTerm);
    const matchType = typeFilter === 'ALL' || acq.type === typeFilter;
    const matchGrade = gradeFilter === 'ALL' || acq.grade === gradeFilter;
    return matchSearch && matchType && matchGrade;
  });

  const handleOpenEditModal = (acq: AcquirerInstitution) => {
    setSelectedAcqForEdit(acq);
    setEditQuotaStatus(acq.quota_status);
    setEditGreenChannel(acq.green_channel);
    setPenaltyReason('');
  };

  const handleSaveAcquirerPolicy = () => {
    if (!selectedAcqForEdit) return;

    setAcquirers((prev) =>
      prev.map((a) => {
        if (a.id === selectedAcqForEdit.id) {
          return {
            ...a,
            quota_status: editQuotaStatus,
            green_channel: editGreenChannel,
            penalty_points: editQuotaStatus === 'RESTRICTED' ? a.penalty_points + 6 : a.penalty_points,
            grade: editQuotaStatus === 'RESTRICTED' ? 'C' : editQuotaStatus === 'WARNED' ? 'B' : a.grade,
          };
        }
        return a;
      })
    );

    showToast(`已成功更新【${selectedAcqForEdit.short_name}】的清算通道管辖策略与准入配额！`);
    setSelectedAcqForEdit(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>商户监管</span>
            <span>/</span>
            <span className="text-slate-700 font-semibold">收单机构</span>
          </div>
          <h1 className="text-lg lg:text-xl font-bold text-slate-900 mt-1">
            收单机构合规评级榜与通道配额
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            对直联银行和第三方支付收单机构实行合规评级，依据报送合格率与虚假率动态调整通道限额与审核策略。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => showToast('已成功导出《收单机构合规考核评级台账.xlsx》')}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>导出考核台账</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">直联收单机构总数</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {acquirers.length} 家
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            国有/股份行 2 家 · 支付机构 6 家
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">绿色免审通道</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono mt-1">
            {acquirers.filter((a) => a.green_channel).length} 家
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            合格率 &gt; 95% 且虚假率 &lt; 0.5%
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">黄牌限期整改机构</div>
          <div className="text-2xl font-bold text-amber-600 font-mono mt-1">
            {acquirers.filter((a) => a.quota_status === 'WARNED').length} 家
          </div>
          <div className="text-[11px] text-amber-600 mt-1">
            拉**、汇*天下（虚假率超标预警）
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">红牌限制进件配额</div>
          <div className="text-2xl font-bold text-rose-600 font-mono mt-1">
            {acquirers.filter((a) => a.quota_status === 'RESTRICTED').length} 家
          </div>
          <div className="text-[11px] text-rose-600 mt-1">
            恒*通达（虚假门头盗图检出率 6.85%）
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索收单机构名称、拼音或机构代码..."
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500">机构类型:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">全部类型</option>
              <option value="BANK">商业银行</option>
              <option value="PAYMENT_COMPANY">三方支付机构</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500">合规等级:</span>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">全部等级</option>
              <option value="A+">A+ 卓越</option>
              <option value="A">A 规范</option>
              <option value="B">B 预警</option>
              <option value="C">C 重点监控</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          共筛查出 <span className="font-bold text-slate-900">{filteredAcquirers.length}</span> 家直联机构
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold">
                <th className="py-3.5 px-4">机构代码 / 全称</th>
                <th className="py-3.5 px-3">类型</th>
                <th className="py-3.5 px-3 text-right">在网商户存量</th>
                <th className="py-3.5 px-3 text-right">报送合格率</th>
                <th className="py-3.5 px-3 text-right">虚假材料拦截率</th>
                <th className="py-3.5 px-3 text-center">合规扣分</th>
                <th className="py-3.5 px-3 text-center">卡组织评级</th>
                <th className="py-3.5 px-3 text-center">通道状态</th>
                <th className="py-3.5 px-4 text-center">合规管辖操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAcquirers.map((acq) => (
                <tr key={acq.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                        {acq.short_name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{acq.name}</span>
                          {acq.green_channel && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-normal">
                              免审优享
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                          <span>机构码: {acq.code}</span>
                          <span>•</span>
                          <span>最近报送: {acq.last_batch_at}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-600">
                    {acq.type === 'BANK' ? (
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px]">
                        商业银行
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px]">
                        支付机构
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono text-slate-700 font-medium">
                    {acq.total_submitted.toLocaleString()} 户
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono font-medium">
                    <span className={acq.pass_rate >= 95 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                      {acq.pass_rate}%
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-mono">
                    <span
                      className={`font-semibold ${
                        acq.fake_doc_rate > 2.0
                          ? 'text-rose-600'
                          : acq.fake_doc_rate > 1.0
                          ? 'text-amber-600'
                          : 'text-slate-600'
                      }`}
                    >
                      {acq.fake_doc_rate}%
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center font-mono">
                    {acq.penalty_points > 0 ? (
                      <span className="text-rose-600 font-bold">-{acq.penalty_points} 分</span>
                    ) : (
                      <span className="text-slate-400">0 分</span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
                        acq.grade === 'A+' || acq.grade === 'A'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : acq.grade === 'B'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {acq.grade} 级
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    {acq.quota_status === 'NORMAL' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        正常开放
                      </span>
                    ) : acq.quota_status === 'WARNED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        黄牌整改
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 font-bold">
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        配额收紧
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(acq)}
                        className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-medium transition-colors border border-blue-200"
                      >
                        调整配额/权限
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          showToast(`已向【${acq.short_name}】合规联络人 ${acq.contact_person} 下发合规监管通报`);
                        }}
                        className="px-2 py-1 rounded hover:bg-slate-100 text-slate-600 text-[11px] transition-colors border border-slate-200"
                        title="下发监管督办单"
                      >
                        督办函
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Acquirer Policy Modal */}
      {selectedAcqForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  调整收单机构通道管辖策略 · {selectedAcqForEdit.short_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAcqForEdit(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-800">
                  当前状态：{selectedAcqForEdit.name} (机构代码: {selectedAcqForEdit.code})
                </div>
                <div className="text-slate-500">
                  当前合规评级: <span className="font-bold font-mono">{selectedAcqForEdit.grade} 级</span> · 虚假材料率: <span className="font-bold font-mono text-rose-600">{selectedAcqForEdit.fake_doc_rate}%</span>
                </div>
              </div>

              {/* Quota Status Selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800">通道报送配额状态</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'NORMAL', label: '正常无限制', desc: '日申报额度不设限' },
                    { key: 'WARNED', label: '黄牌警告整改', desc: '限制新开大额通道' },
                    { key: 'RESTRICTED', label: '红牌收紧进件', desc: '每日限报 50 笔且强机审' },
                  ].map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setEditQuotaStatus(s.key as any)}
                      className={`p-2.5 rounded-lg border text-left transition-colors ${
                        editQuotaStatus === s.key
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-xs">{s.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Green Channel Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                <div>
                  <div className="font-semibold text-slate-800">免审绿色通道特权</div>
                  <div className="text-[11px] text-slate-500">
                    开启后，该机构报送的高评级优质商户直接通过，无需进入卡组织二级人工抽审队列。
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={editGreenChannel}
                  onChange={(e) => setEditGreenChannel(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              {/* Reason */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800">合规裁定依据与调控说明 (录入审计链)</label>
                <textarea
                  rows={3}
                  value={penaltyReason}
                  onChange={(e) => setPenaltyReason(e.target.value)}
                  placeholder="例如：因近 30 天线下商户门头盗图率高于 5%，依据卡组织合规管理办法第 18 条，暂停其绿色免审资格并限制日申报量。"
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedAcqForEdit(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveAcquirerPolicy}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                确认并下发生效
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
