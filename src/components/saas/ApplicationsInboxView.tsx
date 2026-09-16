import React, { useState, useMemo } from 'react';
import {
  MerchantApplication,
  MerchantCategory,
  ApplicationStatus,
  RiskLevel,
  DecisionType
} from '../../types';
import { maskCompanyName } from '../../utils/maskUtils';
import {
  Search,
  Filter,
  Globe2,
  Store,
  Compass,
  Zap,
  FileCheck2,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowUpDown,
  ExternalLink,
  PlusCircle,
  RotateCcw,
  Sparkles,
  MapPin,
  ShieldAlert,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

interface ApplicationsInboxViewProps {
  applications: MerchantApplication[];
  onSelectApplication: (app: MerchantApplication) => void;
  onTriggerAudit: (app: MerchantApplication) => void;
  onTriggerBatchAudit: (apps: MerchantApplication[]) => void;
  onOpenNewApplication: () => void;
  onQuickManualReview: (app: MerchantApplication, decision: DecisionType, notes: string) => void;
}

export const ApplicationsInboxView: React.FC<ApplicationsInboxViewProps> = ({
  applications = [],
  onSelectApplication,
  onTriggerAudit,
  onTriggerBatchAudit,
  onOpenNewApplication,
  onQuickManualReview,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MerchantCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'ALL'>('ALL');
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [quickReviewApp, setQuickReviewApp] = useState<MerchantApplication | null>(null);
  const [reviewDecision, setReviewDecision] = useState<DecisionType>('PASS');
  const [reviewNotes, setReviewNotes] = useState('');

  // Filtered List
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Category
      if (selectedCategory !== 'ALL' && app.merchant_category !== selectedCategory) {
        return false;
      }
      // Status
      if (selectedStatus !== 'ALL' && app.status !== selectedStatus) {
        return false;
      }
      // Risk
      if (selectedRisk !== 'ALL' && app.risk_level !== selectedRisk) {
        return false;
      }
      // Search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = app.merchant_name.toLowerCase().includes(term);
        const matchCode = app.unified_credit_code.toLowerCase().includes(term);
        const matchLegal = app.legal_person.toLowerCase().includes(term);
        const matchAppNo = app.application_no.toLowerCase().includes(term);
        if (!matchName && !matchCode && !matchLegal && !matchAppNo) {
          return false;
        }
      }
      return true;
    });
  }, [applications, selectedCategory, selectedStatus, selectedRisk, searchTerm]);

  // Select all toggle
  const handleToggleSelectAll = () => {
    if (selectedAppIds.length === filteredApps.length) {
      setSelectedAppIds([]);
    } else {
      setSelectedAppIds(filteredApps.map((a) => a.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedAppIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRunBatch = () => {
    const targets = applications.filter((a) => selectedAppIds.includes(a.id));
    if (targets.length > 0) {
      onTriggerBatchAudit(targets);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Title and Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>商户进件审核中心</span>
            <span className="text-xs font-normal text-slate-600 font-mono">
              (共 {applications.length} 户申请，当前显示 {filteredApps.length} 户)
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            根据商户类型执行针对性AI多维并联审核：线上探针、线下场地防盗图、跨境海关穿透
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {selectedAppIds.length > 0 && (
            <button
              onClick={handleRunBatch}
              className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 animate-in fade-in"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>批量分析 ({selectedAppIds.length})</span>
            </button>
          )}

          <button
            onClick={onOpenNewApplication}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-600" />
            <span>录入新进件</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        {/* Search input and Quick Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索商户名称、统一社会信用代码、法人姓名、申请单号..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-600 hover:text-slate-800"
              >
                ×
              </button>
            )}
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">风险等级:</span>
            <div className="flex items-center gap-1">
              {(['ALL', 'LOW', 'MEDIUM', 'HIGH'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedRisk(lvl)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    selectedRisk === lvl
                      ? 'bg-slate-100 text-slate-900 border-slate-400 font-semibold shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {lvl === 'ALL' ? '全部' : lvl === 'LOW' ? '低风险' : lvl === 'MEDIUM' ? '中风险' : '高风险'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Tabs & Status Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-xs font-medium text-slate-500 mr-1 whitespace-nowrap">商户类型:</span>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors whitespace-nowrap ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-100 text-slate-900 border-slate-400 font-semibold shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              全部类型 ({applications.length})
            </button>
            <button
              onClick={() => setSelectedCategory('ONLINE')}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === 'ONLINE'
                  ? 'bg-slate-100 text-slate-900 border-slate-400 font-semibold shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5 text-slate-500" />
              <span>线上电商 / SaaS</span>
            </button>
            <button
              onClick={() => setSelectedCategory('OFFLINE')}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === 'OFFLINE'
                  ? 'bg-slate-100 text-slate-900 border-slate-400 font-semibold shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-slate-500" />
              <span>线下实体门店 / 餐饮</span>
            </button>
            <button
              onClick={() => setSelectedCategory('CROSS_BORDER')}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === 'CROSS_BORDER'
                  ? 'bg-slate-100 text-slate-900 border-slate-400 font-semibold shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              <span>跨境贸易 / 供应链</span>
            </button>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-xs font-medium text-slate-500 mr-1 whitespace-nowrap">审核状态:</span>
            <button
              onClick={() => setSelectedStatus('ALL')}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                selectedStatus === 'ALL'
                  ? 'bg-slate-100 text-slate-900 border-slate-400 font-semibold shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setSelectedStatus('PENDING_AUDIT')}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors flex items-center gap-1 ${
                selectedStatus === 'PENDING_AUDIT'
                  ? 'bg-slate-100 text-slate-900 border-slate-400 font-semibold shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-3 h-3 text-amber-500" />
              <span>待审核</span>
            </button>
            <button
              onClick={() => setSelectedStatus('AUTO_PASSED')}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors flex items-center gap-1 ${
                selectedStatus === 'AUTO_PASSED'
                  ? 'bg-slate-100 text-slate-900 border-slate-400 font-semibold shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>自动通过</span>
            </button>
            <button
              onClick={() => setSelectedStatus('MANUAL_REVIEW')}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors flex items-center gap-1 ${
                selectedStatus === 'MANUAL_REVIEW'
                  ? 'bg-slate-100 text-slate-900 border-slate-400 font-semibold shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span>待人工复核</span>
            </button>
            <button
              onClick={() => setSelectedStatus('REJECTED')}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors flex items-center gap-1 ${
                selectedStatus === 'REJECTED'
                  ? 'bg-slate-100 text-slate-900 border-slate-400 font-semibold shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <XCircle className="w-3 h-3 text-rose-500" />
              <span>一票否决/拦截</span>
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 select-none">
              <tr>
                <th className="py-3 px-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredApps.length > 0 && selectedAppIds.length === filteredApps.length}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-3 px-3">商户主体与申请编号</th>
                <th className="py-3 px-3">业态类型与特征</th>
                <th className="py-3 px-3">申报场景与地址</th>
                <th className="py-3 px-3">进件渠道 / 提交时间</th>
                <th className="py-3 px-3">审核状态</th>
                <th className="py-3 px-3">AI规则综合评分</th>
                <th className="py-3 px-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-600">
                    <Search className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
                    <p className="text-sm font-medium">未找到符合筛选条件的商户进件</p>
                    <p className="text-xs text-slate-600 mt-1">请尝试清除搜索词或切换类型筛选</p>
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const isSelected = selectedAppIds.includes(app.id);
                  const isPending = app.status === 'PENDING_AUDIT';
                  const isPassed = app.status === 'AUTO_PASSED';
                  const isReview = app.status === 'MANUAL_REVIEW';
                  const isRejected = app.status === 'REJECTED';

                  return (
                    <tr
                      key={app.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(app.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      {/* Merchant Info */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <button
                            onClick={() => onSelectApplication(app)}
                            className="font-semibold text-slate-900 hover:text-blue-600 text-left line-clamp-1 group flex items-center gap-1"
                          >
                            <span>{maskCompanyName(app.merchant_name)}</span>
                            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                          </button>
                          <div className="flex items-center gap-2 text-[11px] text-slate-600 font-mono">
                            <span>{app.application_no}</span>
                            <span>·</span>
                            <span>法人: {app.legal_person}</span>
                          </div>
                          <div className="text-[10px] text-slate-600 font-mono">
                            税号: {app.unified_credit_code}
                          </div>
                        </div>
                      </td>

                      {/* Merchant Category */}
                      <td className="py-3.5 px-3">
                        {app.merchant_category === 'ONLINE' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              <Globe2 className="w-3 h-3" />
                              线上商城 / SaaS
                            </span>
                            <div className="text-[10px] text-slate-600">工信部ICP + 爬虫探针</div>
                          </div>
                        ) : app.merchant_category === 'OFFLINE' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              <Store className="w-3 h-3" />
                              线下实体餐饮/零售
                            </span>
                            <div className="text-[10px] text-slate-600">GIS围栏 + 防盗图核验</div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                              <Compass className="w-3 h-3" />
                              跨境贸易供应链
                            </span>
                            <div className="text-[10px] text-slate-600">海关报关单 + 外汇核验</div>
                          </div>
                        )}
                      </td>

                      {/* Scene / Address */}
                      <td className="py-3.5 px-3 max-w-[200px]">
                        <div className="space-y-0.5">
                          {app.target_url_or_venue ? (
                            <div className="flex items-center gap-1 text-[11px] text-slate-700 truncate font-mono">
                              {app.target_url_or_venue.startsWith('http') ? (
                                <Globe2 className="w-3 h-3 text-blue-500 shrink-0" />
                              ) : (
                                <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                              )}
                              <span className="truncate" title={app.target_url_or_venue}>
                                {app.target_url_or_venue}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-600">未填报场景</span>
                          )}
                          <div className="text-[10px] text-slate-600 line-clamp-1">
                            {app.business_scope || '主营业务详见申报材料'}
                          </div>
                        </div>
                      </td>

                      {/* Channel & Time */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <span className="inline-block text-[11px] text-slate-700 font-medium">
                            {app.submission_channel}
                          </span>
                          <div className="text-[10px] text-slate-600 font-mono">
                            {app.submitted_at}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                            <Clock className="w-3 h-3 text-amber-600" />
                            待AI智能分析
                          </span>
                        )}
                        {isPassed && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            系统直接通过
                          </span>
                        )}
                        {isReview && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                            <AlertTriangle className="w-3 h-3 text-blue-600" />
                            待人工复核
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            一票否决拦截
                          </span>
                        )}
                      </td>

                      {/* Score & Risk */}
                      <td className="py-3.5 px-3">
                        {app.score !== undefined ? (
                          <div className="space-y-1">
                            <div className="flex items-baseline gap-1">
                              <span
                                className={`text-base font-bold font-mono ${
                                  app.score >= 85
                                    ? 'text-emerald-700'
                                    : app.score >= 60
                                    ? 'text-amber-700'
                                    : 'text-rose-700'
                                }`}
                              >
                                {app.score}
                              </span>
                              <span className="text-[10px] text-slate-600">分</span>
                              <span
                                className={`ml-1.5 px-1 py-0.2 rounded text-[9px] font-semibold ${
                                  app.risk_level === 'LOW'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : app.risk_level === 'MEDIUM'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {app.risk_level === 'LOW'
                                  ? '低风险'
                                  : app.risk_level === 'MEDIUM'
                                  ? '中风险'
                                  : '高风险'}
                              </span>
                            </div>
                            <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  app.score >= 85
                                    ? 'bg-emerald-500'
                                    : app.score >= 60
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${app.score}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs font-mono">-- 未评分</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending ? (
                            <button
                              onClick={() => onTriggerAudit(app)}
                              className="px-2.5 py-1.5 text-xs font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-md shadow-2xs transition-colors flex items-center gap-1"
                              title="执行针对性分析流水线"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-500" />
                              <span>启动分析</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onSelectApplication(app)}
                              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 border border-slate-200 rounded-md transition-colors flex items-center gap-1"
                              title="查看审核详情"
                            >
                              <FileCheck2 className="w-3.5 h-3.5 text-slate-500" />
                              <span>审核详情</span>
                            </button>
                          )}

                          {/* Quick Review Button for Manual Review or Pending */}
                          <button
                            onClick={() => {
                              setQuickReviewApp(app);
                              setReviewDecision(app.score && app.score >= 80 ? 'PASS' : 'MANUAL_REVIEW');
                              setReviewNotes('');
                            }}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                            title="快速录入人工复核结论"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>

                          {/* Re-run analysis button */}
                          {!isPending && (
                            <button
                              onClick={() => onTriggerAudit(app)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                              title="重新执行AI分析"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Manual Review Drawer/Modal */}
      {quickReviewApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-slate-700" />
                  <span>人工审核复核决议</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  对【{maskCompanyName(quickReviewApp.merchant_name)}】执行合规复核
                </p>
              </div>
              <button
                onClick={() => setQuickReviewApp(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">申请单号:</span>
                  <span className="font-mono text-slate-800">{quickReviewApp.application_no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">商户类型:</span>
                  <span className="font-semibold text-slate-800">
                    {quickReviewApp.merchant_category === 'OFFLINE' ? '线下实体商户' : '线上电商/SaaS'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">当前AI评分:</span>
                  <span className="font-bold font-mono text-blue-700">
                    {quickReviewApp.score ? `${quickReviewApp.score} 分` : '尚未执行评分'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">复核处理结论</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewDecision('PASS')}
                    className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                      reviewDecision === 'PASS'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    通过准入 (PASS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewDecision('MANUAL_REVIEW')}
                    className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                      reviewDecision === 'MANUAL_REVIEW'
                        ? 'border-amber-600 bg-amber-50 text-amber-800 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    补充材料 (SUPPL)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewDecision('FAIL')}
                    className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                      reviewDecision === 'FAIL'
                        ? 'border-rose-600 bg-rose-50 text-rose-800 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    拒绝进件 (FAIL)
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">专员复核意见与附带条件</label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="录入核验证照原件、电话回访或实地考察等具体审核意见及限制放行额度..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setQuickReviewApp(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  onQuickManualReview(quickReviewApp, reviewDecision, reviewNotes);
                  setQuickReviewApp(null);
                }}
                className="px-4 py-1.5 text-xs font-medium text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors"
              >
                保存复核决议
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
