import React, { useState } from 'react';
import {
  RuleConfigItem,
  GlobalThresholds,
  MerchantCategory,
  MerchantApplication
} from '../../types';
import {
  SlidersHorizontal,
  Save,
  RotateCcw,
  ShieldAlert,
  Globe2,
  Store,
  Compass,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
  Calculator,
  Sliders
} from 'lucide-react';

interface RuleSettingsViewProps {
  rules: RuleConfigItem[];
  thresholds: GlobalThresholds;
  applications: MerchantApplication[];
  onSaveRules: (updatedRules: RuleConfigItem[], updatedThresholds: GlobalThresholds) => void;
  onResetDefaults: () => void;
}

export const RuleSettingsView: React.FC<RuleSettingsViewProps> = ({
  rules,
  thresholds,
  applications,
  onSaveRules,
  onResetDefaults,
}) => {
  const [editableRules, setEditableRules] = useState<RuleConfigItem[]>(rules);
  const [editableThresholds, setEditableThresholds] = useState<GlobalThresholds>(thresholds);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<MerchantCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simulation test merchant
  const [simMerchantId, setSimMerchantId] = useState<string>(applications[0]?.id || '');

  // Filtered rules
  const filteredRules = editableRules.filter((r) => {
    if (selectedCategoryTab !== 'ALL' && !r.applicable_categories.includes(selectedCategoryTab)) {
      return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        r.rule_code.toLowerCase().includes(term) ||
        r.rule_name.toLowerCase().includes(term) ||
        r.processing_method.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Handle toggle enabled
  const handleToggleEnabled = (ruleCode: string) => {
    setEditableRules((prev) =>
      prev.map((r) => (r.rule_code === ruleCode ? { ...r, enabled: !r.enabled } : r))
    );
  };

  // Handle toggle veto
  const handleToggleVeto = (ruleCode: string) => {
    setEditableRules((prev) =>
      prev.map((r) => (r.rule_code === ruleCode ? { ...r, is_veto: !r.is_veto } : r))
    );
  };

  // Handle weight change
  const handleWeightChange = (ruleCode: string, newWeight: number) => {
    setEditableRules((prev) =>
      prev.map((r) => (r.rule_code === ruleCode ? { ...r, weight: Math.round(newWeight * 100) / 100 } : r))
    );
  };

  // Save handler
  const handleSave = () => {
    onSaveRules(editableRules, editableThresholds);
    setToastMessage('风控规则与权重策略已成功保存并立即生效！');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset handler
  const handleReset = () => {
    onResetDefaults();
    setToastMessage('已重置为系统默认推荐风控基线配置');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Simulation calculation
  const simMerchant = applications.find((a) => a.id === simMerchantId);
  const simResult = React.useMemo(() => {
    if (!simMerchant) return null;
    let baseScore = 100;
    let vetoTriggered = false;

    // Simulate based on merchant characteristics
    if (simMerchant.merchant_name.includes('鼎盛通达')) {
      // High risk merchant
      const vetoLicense = editableRules.find((r) => r.rule_code === 'KYC-IMAGE-02');
      const vetoVenue = editableRules.find((r) => r.rule_code === 'KYB-VENUE-04');
      const vetoReput = editableRules.find((r) => r.rule_code === 'KYB-REPUT-01');

      if (vetoLicense?.enabled && vetoLicense?.is_veto) vetoTriggered = true;
      if (vetoVenue?.enabled && vetoVenue?.is_veto) vetoTriggered = true;
      if (vetoReput?.enabled && vetoReput?.is_veto) vetoTriggered = true;

      baseScore = Math.max(0, 100 - (vetoLicense?.weight || 1.0) * 40 - (vetoVenue?.weight || 0.95) * 40);
    } else if (simMerchant.merchant_name.includes('深圳极客')) {
      // Medium risk
      const agreeRule = editableRules.find((r) => r.rule_code === 'KYB-AGREE-00');
      const weight = agreeRule?.enabled ? agreeRule.weight : 0.85;
      baseScore = Math.round(100 - weight * 15 - 10);
    } else {
      // Low risk merchant
      baseScore = 95;
    }

    let decision = 'PASS';
    if (vetoTriggered || baseScore < editableThresholds.fail_score_threshold) {
      decision = 'FAIL';
    } else if (baseScore < editableThresholds.pass_score_threshold) {
      decision = 'MANUAL_REVIEW';
    } else {
      decision = 'PASS';
    }

    return {
      score: Math.round(baseScore),
      decision,
      vetoTriggered,
    };
  }, [simMerchant, editableRules, editableThresholds]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              审核项与评分权重配置管理中心
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              SaaS策略引擎
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            根据不同商户类型（线上电商、线下实体、跨境贸易）配置专属审核项生效状态、加权权重系数（0.1x - 2.0x）与一票否决强阻断策略。修改后可在右侧沙箱实时预览算分影响。
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>恢复默认基线</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>保存并生效策略</span>
          </button>
        </div>
      </div>

      {/* Top Controls: Global Thresholds & Live Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Global Thresholds Configuration */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>全局综合评分准入阈值配置</span>
                <Sliders className="w-4 h-4 text-blue-600" />
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                控制系统自动通过、转人工复核及一票否决拦截的分数线
              </p>
            </div>
            <span className="text-xs text-slate-600 font-mono">满分 100 分</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Pass Threshold */}
            <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/20 space-y-2">
              <div className="flex items-center justify-between font-semibold text-emerald-900">
                <span>自动放行准入分数线</span>
                <span className="text-base font-bold font-mono text-emerald-700">
                  ≥ {editableThresholds.pass_score_threshold} 分
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="95"
                step="1"
                value={editableThresholds.pass_score_threshold}
                onChange={(e) =>
                  setEditableThresholds((prev) => ({
                    ...prev,
                    pass_score_threshold: Number(e.target.value),
                  }))
                }
                className="w-full accent-emerald-600"
              />
              <p className="text-[10px] text-slate-600">综合置信度高于此分值时直接放行</p>
            </div>

            {/* Fail Threshold */}
            <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/20 space-y-2">
              <div className="flex items-center justify-between font-semibold text-rose-900">
                <span>直接拒绝拦截分数线</span>
                <span className="text-base font-bold font-mono text-rose-700">
                  &lt; {editableThresholds.fail_score_threshold} 分
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="75"
                step="1"
                value={editableThresholds.fail_score_threshold}
                onChange={(e) =>
                  setEditableThresholds((prev) => ({
                    ...prev,
                    fail_score_threshold: Number(e.target.value),
                  }))
                }
                className="w-full accent-rose-600"
              />
              <p className="text-[10px] text-slate-600">低于此分值直接触发系统高危拦截</p>
            </div>

            {/* Max Allowed Warnings */}
            <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/20 space-y-2">
              <div className="flex items-center justify-between font-semibold text-amber-900">
                <span>最大允许中度预警数</span>
                <span className="text-base font-bold font-mono text-amber-700">
                  ≤ {editableThresholds.max_allowed_warnings} 次
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={editableThresholds.max_allowed_warnings}
                onChange={(e) =>
                  setEditableThresholds((prev) => ({
                    ...prev,
                    max_allowed_warnings: Number(e.target.value),
                  }))
                }
                className="w-full accent-amber-600"
              />
              <p className="text-[10px] text-slate-600">超过此预警数自动降级转人工复核</p>
            </div>
          </div>
        </div>

        {/* Live Simulation Sandbox */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <span>实时模拟算分沙箱</span>
            </h3>
            <span className="text-[11px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-medium">
              动态预览
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-600 block">选择试算商户案例：</label>
            <select
              value={simMerchantId}
              onChange={(e) => setSimMerchantId(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.merchant_name} ({app.merchant_category === 'OFFLINE' ? '线下' : '线上'})
                </option>
              ))}
            </select>
          </div>

          {simResult && simMerchant && (
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">重新加权得分:</span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  {simResult.score} <span className="text-xs font-normal">分</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">模拟决策结果:</span>
                <span
                  className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                    simResult.decision === 'PASS'
                      ? 'bg-emerald-100 text-emerald-800'
                      : simResult.decision === 'MANUAL_REVIEW'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {simResult.decision === 'PASS'
                    ? '通过准入 (PASS)'
                    : simResult.decision === 'MANUAL_REVIEW'
                    ? '待人工复核 (MANUAL)'
                    : '拦截拒绝 (FAIL)'}
                </span>
              </div>
              {simResult.vetoTriggered && (
                <div className="text-[11px] text-rose-600 font-medium flex items-center gap-1 pt-1 border-t border-rose-100">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>命中一票否决强规则，强制拦截</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rules Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Top Filters */}
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Category Template Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-xs font-semibold text-slate-700 mr-1 whitespace-nowrap">规则模版:</span>
              <button
                onClick={() => setSelectedCategoryTab('ALL')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategoryTab === 'ALL'
                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                全部规则 ({editableRules.length})
              </button>
              <button
                onClick={() => setSelectedCategoryTab('ONLINE')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  selectedCategoryTab === 'ONLINE'
                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>线上商户策略模版</span>
              </button>
              <button
                onClick={() => setSelectedCategoryTab('OFFLINE')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  selectedCategoryTab === 'OFFLINE'
                    ? 'bg-amber-600 text-white font-medium shadow-xs'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>线下实体商户模版</span>
              </button>
              <button
                onClick={() => setSelectedCategoryTab('CROSS_BORDER')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  selectedCategoryTab === 'CROSS_BORDER'
                    ? 'bg-purple-600 text-white font-medium shadow-xs'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>跨境贸易商户模版</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索规则代码、规则名称、算法方法..."
                className="w-full pl-3 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 select-none">
              <tr>
                <th className="py-3 px-3.5 w-16 text-center">状态</th>
                <th className="py-3 px-3">规则代码与名称</th>
                <th className="py-3 px-3">适用商户类型</th>
                <th className="py-3 px-3">数据源与处理机制</th>
                <th className="py-3 px-3 w-48">权重系数 (0.1x - 2.0x)</th>
                <th className="py-3 px-3 w-28 text-center">一票否决 (Veto)</th>
                <th className="py-3 px-3">阻断与降级策略</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRules.map((rule) => (
                <tr
                  key={rule.rule_code}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    !rule.enabled ? 'opacity-50 bg-slate-50/30' : ''
                  }`}
                >
                  {/* Enabled Toggle */}
                  <td className="py-3 px-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleEnabled(rule.rule_code)}
                      className={`w-9 h-5 rounded-full transition-colors relative p-0.5 inline-block ${
                        rule.enabled ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                      title={rule.enabled ? '点击禁用该规则' : '点击启用该规则'}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                          rule.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Rule Code & Name */}
                  <td className="py-3 px-3">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{rule.rule_name}</span>
                        {rule.is_veto && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            强阻断
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-slate-600">{rule.rule_code}</div>
                    </div>
                  </td>

                  {/* Applicable Categories */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {rule.applicable_categories.map((cat) => (
                        <span
                          key={cat}
                          className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                            cat === 'ONLINE'
                              ? 'bg-blue-50 text-blue-700'
                              : cat === 'OFFLINE'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-purple-50 text-purple-700'
                          }`}
                        >
                          {cat === 'ONLINE' ? '线上' : cat === 'OFFLINE' ? '线下' : '跨境'}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Data Source & Processing */}
                  <td className="py-3 px-3 max-w-[220px]">
                    <div className="space-y-0.5">
                      <div className="text-slate-700 font-medium truncate" title={rule.data_source}>
                        {rule.data_source}
                      </div>
                      <div className="text-[10px] text-slate-600 truncate" title={rule.processing_method}>
                        {rule.processing_method}
                      </div>
                    </div>
                  </td>

                  {/* Weight Slider */}
                  <td className="py-3 px-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-600">加权系数:</span>
                        <span className="font-bold font-mono text-blue-700">{rule.weight.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="2.0"
                        step="0.05"
                        disabled={!rule.enabled}
                        value={rule.weight}
                        onChange={(e) => handleWeightChange(rule.rule_code, Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer disabled:cursor-not-allowed"
                      />
                    </div>
                  </td>

                  {/* Veto Switch */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      disabled={!rule.enabled}
                      onClick={() => handleToggleVeto(rule.rule_code)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                        rule.is_veto
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {rule.is_veto ? '一票否决' : '常规扣分'}
                    </button>
                  </td>

                  {/* Error Strategy */}
                  <td className="py-3 px-3">
                    <span className="text-[11px] text-slate-700">
                      {rule.error_strategy}
                    </span>
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
