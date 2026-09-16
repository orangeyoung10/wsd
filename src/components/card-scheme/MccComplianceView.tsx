import React, { useState } from 'react';
import { MccViolationRecord } from '../../types';
import { DEMO_MCC_VIOLATIONS } from '../../data/cardSchemeData';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Send,
  Search,
  Scale,
  DollarSign,
  Building2,
  FileSpreadsheet,
  FileCheck,
  Store,
  FileText,
  SlidersHorizontal,
  Clock,
  ShieldAlert
} from 'lucide-react';

export const MccComplianceView: React.FC = () => {
  const [violations, setViolations] = useState<MccViolationRecord[]>(DEMO_MCC_VIOLATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'DISPATCHED' | 'CONFIRMED_VIOLATION'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCorrectMcc = (id: string, merchantName: string, expectedMcc: string) => {
    setViolations((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'CONFIRMED_VIOLATION' as const } : v))
    );
    showToast(`已确认【${merchantName}】套码事实，强制纠正行业代码为 ${expectedMcc}，并生成费差追缴单！`);
  };

  const handleDispatchOrder = (id: string, merchantName: string) => {
    setViolations((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'DISPATCHED' as const } : v))
    );
    showToast(`已向收单机构下发《违规套码限期核实整改督办函》（编号: WG-${id}）`);
  };

  const handleExportReclaimList = () => {
    showToast('已导出《商户行业套码违规清算追偿核算清册.xlsx》');
  };

  const filtered = violations.filter((v) => {
    const matchSearch =
      v.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.reported_mcc.includes(searchTerm) ||
      v.expected_mcc.includes(searchTerm) ||
      v.acquirer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Business summary stats for B2B Operations
  const pendingCount = violations.filter((v) => v.status === 'PENDING').length;
  const dispatchedCount = violations.filter((v) => v.status === 'DISPATCHED').length;
  const confirmedCount = violations.filter((v) => v.status === 'CONFIRMED_VIOLATION').length;
  const uniqueAcquirers = Array.from(new Set(violations.map((v) => v.acquirer_name))).length;

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header: Direct & Business-oriented */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>合规与清算核查</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold">商户行业与套码稽核</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 mt-1">
            商户行业与 MCC 套码稽核工作台
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            核对收单机构报送行业代码与实际经营真实性，拦截以低费率码掩盖高费率、高风险行业的违规套码行为。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportReclaimList}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>导出追缴清册</span>
          </button>
        </div>
      </div>

      {/* B2B Operational Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">检出套码案件</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-slate-900">{violations.length}</span>
            <span className="text-[11px] text-slate-400">户异常商户</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-700 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>待处理 {pendingCount} 户</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">涉及收单机构</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-slate-900">{uniqueAcquirers}</span>
            <span className="text-[11px] text-slate-400">家机构有报备异常</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            已下发督办函 {dispatchedCount} 份
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">预估补缴追偿额</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-rose-600">¥184,500</span>
            <span className="text-[11px] text-slate-400">费率差额测算</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            按历史交易量 0.22%~0.60% 倒查
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">已确认纠正率</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <FileCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-emerald-700">
              {Math.round((confirmedCount / violations.length) * 100)}%
            </span>
            <span className="text-[11px] text-slate-400">已纠偏扣率</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-700">
            已结案并追偿 {confirmedCount} 户
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            全部案件 ({violations.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'PENDING'
                ? 'bg-amber-100 text-amber-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            待核实 ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('DISPATCHED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'DISPATCHED'
                ? 'bg-blue-100 text-blue-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            整改督办中 ({dispatchedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('CONFIRMED_VIOLATION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'CONFIRMED_VIOLATION'
                ? 'bg-rose-100 text-rose-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            已确认套码 ({confirmedCount})
          </button>
        </div>

        <div className="relative sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="按商户名称、MCC代码、收单机构搜索..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
          />
        </div>
      </div>

      {/* Violations List */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
            未检索到符合条件的套码案件
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 sm:p-5 space-y-3.5 text-xs transition-shadow hover:shadow-xs"
            >
              {/* Row 1: Merchant & Acquirer Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {item.id}
                  </span>
                  <span className="text-sm font-bold text-slate-900">{item.merchant_name}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-medium flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    报送机构: {item.acquirer_name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                      item.status === 'CONFIRMED_VIOLATION'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : item.status === 'DISPATCHED'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {item.status === 'CONFIRMED_VIOLATION'
                      ? '已定性套码 · 追缴中'
                      : item.status === 'DISPATCHED'
                      ? '已发整改函 · 待反馈'
                      : '待审核处置'}
                  </span>
                </div>
              </div>

              {/* Row 2: MCC Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Reported MCC */}
                <div className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/40 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      收单机构申报行业 (报送 MCC)
                    </span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 font-bold text-amber-900 shadow-2xs">
                      {item.reported_mcc}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    {item.reported_mcc_name}
                  </div>
                  <div className="text-[11px] text-amber-900/90 pt-1 border-t border-amber-200/60">
                    <span className="font-medium">套码动机：</span>
                    {item.fee_arbitrage}
                  </div>
                </div>

                {/* Expected Real MCC */}
                <div className="p-3.5 rounded-xl border border-blue-200/80 bg-blue-50/40 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-blue-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      核查认定实营行业 (应归属 MCC)
                    </span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-300 font-bold text-blue-700 shadow-2xs">
                      {item.expected_mcc}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-900">
                    {item.expected_mcc_name}
                  </div>
                  <div className="text-[11px] text-blue-900/90 pt-1 border-t border-blue-200/60">
                    <span className="font-medium">合规基准：</span>
                    符合人民银行支付清算行业真实主营标准与卡组织费率分类
                  </div>
                </div>
              </div>

              {/* Row 3: Investigation Evidences & Findings */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-700 text-[11px] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>事实核查证据依据：</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-5">
                  {item.evidence}
                </p>
              </div>

              {/* Row 4: Operational Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-[11px] text-slate-400">
                  发现时间: 2026-09-12 10:45 · 规则引擎自动抽检
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDispatchOrder(item.id, item.merchant_name)}
                    disabled={item.status === 'DISPATCHED'}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      item.status === 'DISPATCHED'
                        ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.status === 'DISPATCHED' ? '已下发督办函' : '下发整改督办函'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCorrectMcc(item.id, item.merchant_name, item.expected_mcc)}
                    disabled={item.status === 'CONFIRMED_VIOLATION'}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                      item.status === 'CONFIRMED_VIOLATION'
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{item.status === 'CONFIRMED_VIOLATION' ? '已完成纠偏追偿' : '认定套码并追缴费差'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
