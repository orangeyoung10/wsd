import React, { useState } from 'react';
import {
  SaaSNavigationTab,
  MerchantApplication,
  AcquirerInstitution
} from '../../types';
import { DEMO_ACQUIRERS, DEMO_CROSS_COLLISIONS, DEMO_MCC_VIOLATIONS } from '../../data/cardSchemeData';
import {
  ShieldAlert,
  TrendingUp,
  Building2,
  AlertTriangle,
  FileSearch,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Filter,
  Layers,
  Activity,
  Globe2,
  BadgeAlert,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface NetworkCockpitViewProps {
  applications?: MerchantApplication[];
  onSelectTab?: (tab: SaaSNavigationTab) => void;
  onSelectApplication?: (app: MerchantApplication) => void;
  onNavigateToCollision?: () => void;
  onNavigateToAcquirers?: () => void;
  onNavigateToSweeps?: () => void;
  onSelectMerchantByName?: (name: string) => void;
}

export const NetworkCockpitView: React.FC<NetworkCockpitViewProps> = ({
  applications = [],
  onSelectTab,
  onSelectApplication,
  onNavigateToCollision,
  onNavigateToAcquirers,
  onNavigateToSweeps,
  onSelectMerchantByName,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'TODAY' | 'WEEK' | 'MONTH'>('TODAY');

  const handleGoTab = (tab: SaaSNavigationTab) => {
    if (onSelectTab) {
      onSelectTab(tab);
    } else if (tab === 'CROSS_ACQUIRER_COLLISION' && onNavigateToCollision) {
      onNavigateToCollision();
    } else if (tab === 'ACQUIRER_RANKING' && onNavigateToAcquirers) {
      onNavigateToAcquirers();
    } else if (tab === 'SWEEP_TASKS' && onNavigateToSweeps) {
      onNavigateToSweeps();
    }
  };

  const handleSelectApp = (app: MerchantApplication) => {
    if (onSelectApplication) {
      onSelectApplication(app);
    } else if (onSelectMerchantByName) {
      onSelectMerchantByName(app.merchant_name);
    }
  };

  // Computed Card Scheme Network Stats
  const totalMonitoredMerchants = '482,500';
  const networkHealthIndex = 91.4;
  const pendingCount = (applications || []).filter((a) => a.status === 'PENDING_AUDIT').length;
  const rejectedCount = (applications || []).filter((a) => a.status === 'REJECTED').length;
  const warnedAcquirers = DEMO_ACQUIRERS.filter((a) => a.quota_status !== 'NORMAL');

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-xl p-5 text-slate-800 shadow-xs border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium">
                商户质量监管
              </span>
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                实时风险监控已联通 (8家收单机构)
              </span>
            </div>
            <h1 className="text-lg lg:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              商户质量与入网合规监控大屏
            </h1>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
              穿透收单机构报送链路，基于多模态核验、跨机构同实体去重、MCC套码排查与黑灰名单联防，实时守护支付网络合规质量。
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleGoTab('CROSS_ACQUIRER_COLLISION')}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              <span>跨机构撞库预警 ({DEMO_CROSS_COLLISIONS.length})</span>
            </button>
            <button
              type="button"
              onClick={() => handleGoTab('SWEEP_TASKS')}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-slate-600" />
              <span>发起专项抽检</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>受监管在网商户</span>
            <Building2 className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
              {totalMonitoredMerchants}
            </span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +1,280 今日
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>覆盖全国 31 省市收单网络</span>
            <span className="text-slate-700 font-medium">8家机构直联</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>综合合规健康指数</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
              {networkHealthIndex}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100 分</span>
            <span className="text-xs text-emerald-600 font-medium ml-auto">良性稳健</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${networkHealthIndex}%` }} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>今日违规阻断 / 待复核</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600 font-mono tracking-tight">
              {rejectedCount + 4}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              户已拦截 / <span className="text-amber-600 font-bold">{pendingCount}</span> 待机审
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>虚假门头 26 · 跨机构套码 16</span>
            <button
              type="button"
              onClick={() => handleGoTab('APPLICATIONS_INBOX')}
              className="text-slate-700 hover:text-slate-900 font-medium text-xs inline-flex items-center"
            >
              核验进件 &rarr;
            </button>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>收单机构合规警戒</span>
            <BadgeAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 font-mono tracking-tight">
              {warnedAcquirers.length}
            </span>
            <span className="text-xs text-slate-500">家收单机构亮黄牌/受限</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
            <span>恒*通达 (C级) · 汇* (B级)</span>
            <button
              type="button"
              onClick={() => handleGoTab('ACQUIRER_RANKING')}
              className="text-slate-700 hover:text-slate-900 font-medium text-xs inline-flex items-center"
            >
              机构榜单 &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Acquirer Performance Matrix + High-Risk Alert Stream */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Scheme Acquirer Compliance Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  直联收单机构合规质量梯队（报送合格率 vs 虚假资料检出率）
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleGoTab('ACQUIRER_RANKING')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
              >
                <span>全量档案与惩戒</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-medium">
                      <th className="pb-2">收单机构</th>
                      <th className="pb-2">机构属性</th>
                      <th className="pb-2 text-right">累计在网商户</th>
                      <th className="pb-2 text-right">报送机审合格率</th>
                      <th className="pb-2 text-right">虚假材料拦截率</th>
                      <th className="pb-2 text-center">卡组织评级</th>
                      <th className="pb-2 text-center">通道状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {DEMO_ACQUIRERS.slice(0, 5).map((acq) => (
                      <tr key={acq.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 font-medium text-slate-900">
                          <div>{acq.short_name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{acq.code}</div>
                        </td>
                        <td className="py-3 text-slate-600">
                          {acq.type === 'BANK' ? (
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px]">
                              国有/商业银行
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px]">
                              三方支付机构
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right font-mono text-slate-700">
                          {acq.total_submitted.toLocaleString()} 户
                        </td>
                        <td className="py-3 text-right font-mono font-medium">
                          <span className={acq.pass_rate >= 95 ? 'text-emerald-600' : 'text-amber-600'}>
                            {acq.pass_rate}%
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono">
                          <span
                            className={
                              acq.fake_doc_rate > 2.0
                                ? 'text-rose-600 font-bold'
                                : acq.fake_doc_rate > 1.0
                                ? 'text-amber-600'
                                : 'text-slate-600'
                            }
                          >
                            {acq.fake_doc_rate}%
                          </span>
                        </td>
                        <td className="py-3 text-center font-mono font-bold">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] ${
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
                        <td className="py-3 text-center">
                          {acq.quota_status === 'NORMAL' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              绿色免审
                            </span>
                          ) : acq.quota_status === 'WARNED' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                              限期整改
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 font-bold">
                              <XCircle className="w-3.5 h-3.5 text-rose-500" />
                              限制进件
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Cross Acquirer Collision Top Banner */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  跨机构撞库去重核心发现（卡组织独有穿透视角）
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleGoTab('CROSS_ACQUIRER_COLLISION')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
              >
                <span>查看全部 {DEMO_CROSS_COLLISIONS.length} 起撞库</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {DEMO_CROSS_COLLISIONS.slice(0, 2).map((col) => (
                <div
                  key={col.id}
                  className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/40 hover:bg-rose-50/80 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                          {col.collision_type === 'MULTI_ACQUIRER_SAME_ENTITY'
                            ? '一照多机构多开'
                            : col.collision_type === 'LEGAL_PERSON_EXCESSIVE'
                            ? '法人团伙多挂'
                            : col.collision_type === 'BANK_ACCOUNT_REUSED'
                            ? '结算账号复用'
                            : '物理门面冲突'}
                        </span>
                        <span className="font-semibold text-slate-900 text-xs">
                          {col.target_name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {col.risk_summary}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded text-[11px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300 shrink-0">
                      高危一票否决
                    </span>
                  </div>

                  {/* Involved Acquirers Tags */}
                  <div className="mt-2.5 pt-2 border-t border-rose-200/60 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-medium">涉及收单机构:</span>
                    {col.involved_acquirers.map((acq, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] text-slate-700 font-medium"
                      >
                        {acq.acquirer_name} ({acq.status})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: High-frequency Risk Distribution & Quick Queue */}
        <div className="space-y-6">
          {/* Card Scheme Risk Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Activity className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">近 30 天全网阻断风险成因分析</h2>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { label: '门头招牌与实景反向盗图', pct: 34, count: '1,420 笔', color: 'bg-rose-500' },
                { label: '营业执照PS伪造/印章篡改', pct: 28, count: '1,160 笔', color: 'bg-amber-500' },
                { label: '跨机构多开与法人团伙代持', pct: 22, count: '920 笔', color: 'bg-indigo-500' },
                { label: 'MCC 违规套用民生低费率码', pct: 16, count: '670 笔', color: 'bg-blue-500' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">{item.label}</span>
                    <span className="font-mono text-slate-500">{item.count} ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" />
                卡组织行业整治重点：
              </div>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                依据人行259号文《关于加强支付受理终端及相关业务管理的通知》，严控“一机多码”、“虚假商户”与“跨机构套码”，系统已开启全天候探针实时比对。
              </p>
            </div>
          </div>

          {/* Pending Verification Merchant Queue */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900">最新待核验进件队列</h2>
              </div>
              <button
                type="button"
                onClick={() => handleGoTab('APPLICATIONS_INBOX')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                全部进件 &rarr;
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {(applications || []).slice(0, 4).map((app) => (
                <div
                  key={app.id}
                  onClick={() => handleSelectApp(app)}
                  className="py-2.5 hover:bg-slate-50 cursor-pointer rounded px-2 -mx-2 transition-colors flex items-center justify-between"
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <div className="text-xs font-semibold text-slate-900 truncate">
                      {app.merchant_name}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                      <span>{app.acquirer_name || '收单机构'}</span>
                      <span>•</span>
                      <span>{app.mcc_desc ? app.mcc_desc.split(' ')[0] : 'MCC'}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-medium shrink-0 ${
                      app.status === 'AUTO_PASSED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : app.status === 'REJECTED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {app.status === 'AUTO_PASSED'
                      ? '机审放行'
                      : app.status === 'REJECTED'
                      ? '高危拦截'
                      : '待审核'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
