import React, { useState } from 'react';
import { SaaSNavigationTab } from '../../types';
import {
  ShieldAlert,
  LayoutDashboard,
  Inbox,
  FileCheck2,
  SlidersHorizontal,
  History,
  Building,
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  PlusCircle,
  ChevronDown,
  User,
  Sparkles
} from 'lucide-react';

interface SaaSTopNavProps {
  currentTab: SaaSNavigationTab;
  onSelectTab: (tab: SaaSNavigationTab) => void;
  pendingCount: number;
  onOpenNewApplication: () => void;
  selectedMerchantName?: string;
}

export const SaaSTopNav: React.FC<SaaSTopNavProps> = ({
  currentTab,
  onSelectTab,
  pendingCount,
  onOpenNewApplication,
  selectedMerchantName,
}) => {
  const [currentTenant, setCurrentTenant] = useState('华东收单风控运营中心');
  const [showTenantMenu, setShowTenantMenu] = useState(false);
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);

  const tenants = [
    '华东收单风控运营中心',
    '华南跨境及电商清算合规组',
    '普惠小微与实体商户运营部'
  ];

  const recentAlerts = [
    {
      id: 'alt-1',
      level: 'CRITICAL',
      title: '一票否决拦截',
      content: '鼎盛通达商贸工作室 门头照片命中58同城转店盗图库',
      time: '10分钟前',
      icon: XCircle,
      color: 'text-rose-600 bg-rose-50'
    },
    {
      id: 'alt-2',
      level: 'WARNING',
      title: '转人工复核',
      content: '深圳极客智能硬件 采购协议机器人标的超执照范围',
      time: '45分钟前',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      id: 'alt-3',
      level: 'PASS',
      title: '自动放行通过',
      content: '盒马严选数字科技 线上网络探测闭环，96分准入',
      time: '1小时前',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Utility Bar */}
      <div className="px-4 lg:px-6 h-14 flex items-center justify-between border-b border-slate-100">
        {/* Left: Brand & Tenant */}
        <div className="flex items-center gap-4">
          <div 
            onClick={() => onSelectTab('DASHBOARD')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 text-sm tracking-tight">MAAP 商户智能 AI 审核平台</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                  B端SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-600">Enterprise Merchant Risk Engine</p>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden md:block" />

          {/* Tenant Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowTenantMenu(!showTenantMenu)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-md border border-slate-200 transition-colors"
            >
              <Building className="w-3.5 h-3.5 text-slate-600" />
              <span>{currentTenant}</span>
              <ChevronDown className="w-3 h-3 text-slate-600" />
            </button>

            {showTenantMenu && (
              <div className="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1 text-[11px] font-medium text-slate-600 uppercase">切换租户机构</div>
                {tenants.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setCurrentTenant(t);
                      setShowTenantMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      t === currentTenant ? 'font-semibold text-blue-700 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{t}</span>
                    {t === currentTenant && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Create Application */}
          <button
            onClick={onOpenNewApplication}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>录入新进件</span>
          </button>

          {/* Real-time Alerts Bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsMenu(!showAlertsMenu)}
              className="relative p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              title="风控拦截告警"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {showAlertsMenu && (
              <div className="absolute right-0 mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-semibold text-slate-900">实时风控告警流</span>
                  </div>
                  <span className="text-[11px] text-slate-600">3条新通知</span>
                </div>
                <div className="space-y-1.5 mt-2">
                  {recentAlerts.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-left text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${item.color}`}>
                            <Icon className="w-3 h-3" />
                            {item.title}
                          </span>
                          <span className="text-[10px] text-slate-600">{item.time}</span>
                        </div>
                        <p className="text-slate-700 text-[11px] leading-snug">{item.content}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-2 mt-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setShowAlertsMenu(false);
                      onSelectTab('AUDIT_LOGS');
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
                  >
                    查看全部审计流水与告警 →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-medium text-slate-800 leading-tight">李合规</div>
              <div className="text-[10px] text-slate-600">高级风控审核官</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main SaaS Navigation Tabs */}
      <div className="px-4 lg:px-6 flex items-center justify-between overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-1">
          {/* Dashboard Tab */}
          <button
            onClick={() => onSelectTab('DASHBOARD')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium transition-all whitespace-nowrap ${
              currentTab === 'DASHBOARD'
                ? 'border-blue-600 text-blue-700 font-semibold bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>工作台看板</span>
          </button>

          {/* Applications Inbox Tab */}
          <button
            onClick={() => onSelectTab('APPLICATIONS')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium transition-all whitespace-nowrap ${
              currentTab === 'APPLICATIONS'
                ? 'border-blue-600 text-blue-700 font-semibold bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>商户进件中心</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300/60">
                {pendingCount} 待审
              </span>
            )}
          </button>

          {/* Audit Detail Tab */}
          <button
            onClick={() => onSelectTab('AUDIT_DETAIL')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium transition-all whitespace-nowrap ${
              currentTab === 'AUDIT_DETAIL'
                ? 'border-blue-600 text-blue-700 font-semibold bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>智能审核详情</span>
            {selectedMerchantName && (
              <span className="max-w-[140px] truncate text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                {selectedMerchantName}
              </span>
            )}
          </button>

          {/* Rule Settings Tab */}
          <button
            onClick={() => onSelectTab('RULE_SETTINGS')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium transition-all whitespace-nowrap ${
              currentTab === 'RULE_SETTINGS'
                ? 'border-blue-600 text-blue-700 font-semibold bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>审核项与评分权重配置</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              SaaS后台
            </span>
          </button>

          {/* Audit Logs Tab */}
          <button
            onClick={() => onSelectTab('AUDIT_LOGS')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-medium transition-all whitespace-nowrap ${
              currentTab === 'AUDIT_LOGS'
                ? 'border-blue-600 text-blue-700 font-semibold bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <History className="w-4 h-4" />
            <span>审计流水与追溯</span>
          </button>
        </nav>

        {/* Engine Status Tag */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-600 pl-4 py-1">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>AI 决策引擎 v3.8 在线 · 并联探测链路就绪</span>
        </div>
      </div>
    </header>
  );
};
