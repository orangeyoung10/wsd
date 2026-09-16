import React from 'react';
import { MerchantApplication, SaaSNavigationTab } from '../../types';
import {
  Inbox,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Globe2,
  Store,
  Compass,
  FileSpreadsheet,
  ShieldCheck,
  Zap,
  ChevronRight,
  PlusCircle,
  SlidersHorizontal
} from 'lucide-react';

interface DashboardViewProps {
  applications: MerchantApplication[];
  onSelectTab: (tab: SaaSNavigationTab) => void;
  onSelectApplication: (app: MerchantApplication) => void;
  onTriggerAudit: (app: MerchantApplication) => void;
  onOpenNewApplication: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  applications = [],
  onSelectTab,
  onSelectApplication,
  onTriggerAudit,
  onOpenNewApplication,
}) => {
  const totalCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === 'PENDING_AUDIT').length;
  const passedCount = applications.filter((a) => a.status === 'AUTO_PASSED').length;
  const reviewCount = applications.filter((a) => a.status === 'MANUAL_REVIEW').length;
  const rejectedCount = applications.filter((a) => a.status === 'REJECTED').length;

  const onlineCount = applications.filter((a) => a.merchant_category === 'ONLINE').length;
  const offlineCount = applications.filter((a) => a.merchant_category === 'OFFLINE').length;
  const crossBorderCount = applications.filter((a) => a.merchant_category === 'CROSS_BORDER').length;

  const pendingApps = applications.filter((a) => a.status === 'PENDING_AUDIT');
  const reviewApps = applications.filter((a) => a.status === 'MANUAL_REVIEW');

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick CTA */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">
                商户审核作业工作台
              </h1>
              <span className="px-2 py-0.5 text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                线上 / 线下 / 跨境差异化审核
              </span>
            </div>
            <p className="text-xs text-slate-500">
              集中受理商户进件申请，依据商户业态类型自动匹配审核流水线，支持一键机审评分、人工复核与规则权重管理。
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onSelectTab('APPLICATIONS')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Inbox className="w-4 h-4 text-slate-600" />
              <span>待审进件库 ({pendingCount})</span>
            </button>
            <button
              onClick={onOpenNewApplication}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>录入新进件</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Total Applications */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-medium">总进件量</span>
            <FileSpreadsheet className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalCount}</span>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +100%
            </span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1">含API自动与渠道代办</div>
        </div>

        {/* Pending Audits */}
        <div 
          onClick={() => onSelectTab('APPLICATIONS')}
          className="bg-white rounded-xl p-4 border border-amber-200 shadow-2xs hover:border-amber-400 hover:shadow-xs cursor-pointer transition-all bg-gradient-to-b from-amber-50/20 to-white"
        >
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-medium">待AI智能审核</span>
            <Clock className="w-4 h-4 text-amber-500 animate-spin-slow" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-900">{pendingCount}</span>
            <span className="text-[11px] text-amber-700 font-medium">待处理</span>
          </div>
          <div className="text-[11px] text-amber-600/90 mt-1 flex items-center justify-between">
            <span>需触发流水线</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Auto Passed */}
        <div className="bg-white rounded-xl p-4 border border-emerald-200/80 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-medium">自动准入通过</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-900">{passedCount}</span>
            <span className="text-[11px] text-emerald-600 font-medium">
              {totalCount > 0 ? `${Math.round((passedCount / totalCount) * 100)}%` : '0%'}
            </span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1">系统直接放行准入</div>
        </div>

        {/* Manual Review Required */}
        <div className="bg-white rounded-xl p-4 border border-blue-200/80 shadow-2xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-xs font-medium">转人工待复核</span>
            <AlertTriangle className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-900">{reviewCount}</span>
            <span className="text-[11px] text-blue-600 font-medium">
              {totalCount > 0 ? `${Math.round((reviewCount / totalCount) * 100)}%` : '0%'}
            </span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1">需专员核实授权与资质</div>
        </div>

        {/* Rejected / High Risk */}
        <div className="bg-white rounded-xl p-4 border border-rose-200/80 shadow-2xs hover:border-rose-300 transition-all col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-rose-700 mb-2">
            <span className="text-xs font-medium">一票否决拦截</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-900">{rejectedCount}</span>
            <span className="text-[11px] text-rose-600 font-medium">
              {totalCount > 0 ? `${Math.round((rejectedCount / totalCount) * 100)}%` : '0%'}
            </span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1">造假/盗图/失信黑名单</div>
        </div>
      </div>

      {/* Main Grid: Category Strategy & Action Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Category Distribution & Type Strategy */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Merchant Category Routing Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>商户类型差异化审核策略看板</span>
                  <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    智能分流
                  </span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  不同业态商户应用不同的AI审核模版与权重规则
                </p>
              </div>
              <button
                onClick={() => onSelectTab('RULE_SETTINGS')}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>配置规则与权重</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Online Strategy */}
              <div className="rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/30 to-white p-3.5 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800">
                    <Globe2 className="w-4 h-4 text-blue-600" />
                    线上电商 / SaaS平台
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                    {onlineCount} 户
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2.5 leading-relaxed">
                  核心验证工信部ICP备案域名与主体全等、SSL证书、自动化爬虫动态探针、支付网关跳转黑产/跑分侦测。
                </p>
                <div className="space-y-1 text-[10px] text-slate-700 bg-white/80 p-2 rounded-lg border border-blue-100/80">
                  <div className="flex justify-between">
                    <span>工信部ICP穿透:</span>
                    <span className="font-semibold text-rose-600">权重 1.0 (一票否决)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>支付跳转检测:</span>
                    <span className="font-semibold text-rose-600">权重 0.95 (一票否决)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>自动化爬虫探针:</span>
                    <span className="font-semibold text-slate-700">权重 0.90</span>
                  </div>
                </div>
              </div>

              {/* Offline Strategy */}
              <div className="rounded-xl border border-amber-100 bg-gradient-to-b from-amber-50/30 to-white p-3.5 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                    <Store className="w-4 h-4 text-amber-600" />
                    线下实体门店 / 餐饮连锁
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                    {offlineCount} 户
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2.5 leading-relaxed">
                  免网络探针；重度核验实体门头招牌OCR文字、高精GIS地理围栏经纬度偏差、照片反向搜图排查网络转租盗图。
                </p>
                <div className="space-y-1 text-[10px] text-slate-700 bg-white/80 p-2 rounded-lg border border-amber-100/80">
                  <div className="flex justify-between">
                    <span>反向网络搜图:</span>
                    <span className="font-semibold text-rose-600">权重 0.95 (一票否决)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GIS围栏定位:</span>
                    <span className="font-semibold text-slate-700">权重 0.90</span>
                  </div>
                  <div className="flex justify-between">
                    <span>门头牌匾OCR:</span>
                    <span className="font-semibold text-slate-700">权重 0.85</span>
                  </div>
                </div>
              </div>

              {/* Cross Border Strategy */}
              <div className="rounded-xl border border-purple-100 bg-gradient-to-b from-purple-50/30 to-white p-3.5 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-800">
                    <Compass className="w-4 h-4 text-purple-600" />
                    跨境供应链 / 外贸
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800">
                    {crossBorderCount} 户
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2.5 leading-relaxed">
                  重点审查中国海关收发货人备案代码、外管局收支申报名录合规、海运/航运提单与外贸结算账户穿透。
                </p>
                <div className="space-y-1 text-[10px] text-slate-700 bg-white/80 p-2 rounded-lg border border-purple-100/80">
                  <div className="flex justify-between">
                    <span>海关底账比对:</span>
                    <span className="font-semibold text-rose-600">权重 1.0 (一票否决)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>外管局结汇评级:</span>
                    <span className="font-semibold text-slate-700">权重 0.90</span>
                  </div>
                  <div className="flex justify-between">
                    <span>货运单据穿透:</span>
                    <span className="font-semibold text-slate-700">权重 0.85</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Pending Audits Queue */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>待审核商户快速处置队列</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {pendingApps.length} 待分析
                  </span>
                </h3>
                <p className="text-xs text-slate-600">
                  点击“启动AI分析”可根据商户类型执行专属审核，即刻生成评分
                </p>
              </div>
              <button
                onClick={() => onSelectTab('APPLICATIONS')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <span>查看全部进件</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingApps.length === 0 ? (
              <div className="text-center py-8 text-slate-600 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                所有进件均已完成智能AI分析，暂无排队商户
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-slate-900">{app.merchant_name}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          app.merchant_category === 'OFFLINE'
                            ? 'bg-amber-100 text-amber-800'
                            : app.merchant_category === 'ONLINE'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {app.merchant_category === 'OFFLINE' ? '线下实体门店' : app.merchant_category === 'ONLINE' ? '线上电商/SaaS' : '跨境贸易'}
                        </span>
                        <span className="text-[11px] text-slate-600 font-mono">{app.application_no}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1">
                        {app.summary_findings?.[0] || '待启动针对性特征审核流水线'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onTriggerAudit(app)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>启动专属AI分析</span>
                      </button>
                      <button
                        onClick={() => onSelectApplication(app)}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
                      >
                        详情
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Violation Ranking & Real-time Stream */}
        <div className="space-y-6">
          {/* Top Violation Rankings */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span>高频拦截风险分布</span>
              <span className="text-[10px] text-slate-600 font-normal">近30天统计</span>
            </h3>
            <p className="text-xs text-slate-600 mb-4">平台重点防范的材料造假与合规缺陷</p>

            <div className="space-y-3">
              {[
                { label: '场地照片反向搜图 (网络转租盗图)', count: 48, percent: 88, color: 'bg-rose-500' },
                { label: '线上场景域名无工信部ICP备案', count: 39, percent: 72, color: 'bg-rose-500' },
                { label: '增值税发票税务底账查无此票', count: 26, percent: 48, color: 'bg-amber-500' },
                { label: '营业执照原图存在PS图层涂抹', count: 21, percent: 38, color: 'bg-rose-500' },
                { label: '法人命中最高人民法院失信老赖', count: 17, percent: 31, color: 'bg-rose-500' },
                { label: '合同标的严重超出执照经营范围', count: 14, percent: 26, color: 'bg-blue-500' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-700 font-medium truncate max-w-[200px]">{item.label}</span>
                    <span className="text-slate-600 font-mono">{item.count} 起</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manual Review Focus List */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-blue-600" />
                <span>待人工复核商户 ({reviewApps.length})</span>
              </h3>
              <button
                onClick={() => onSelectTab('APPLICATIONS')}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
              >
                查看
              </button>
            </div>

            <div className="space-y-2.5">
              {reviewApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onSelectApplication(app)}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-900 truncate max-w-[160px]">{app.merchant_name}</span>
                    <span className="text-[11px] font-bold text-amber-700 font-mono">{app.score} 分</span>
                  </div>
                  <p className="text-[10px] text-slate-600 line-clamp-1">
                    {app.summary_findings?.[1] || app.summary_findings?.[0] || '存在中度合规差异待审验'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
