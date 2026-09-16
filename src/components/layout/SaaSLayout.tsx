import React, { useState } from 'react';
import { SaaSNavigationTab, UserAccount } from '../../types';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Inbox,
  FileCheck2,
  SlidersHorizontal,
  History,
  ShieldAlert,
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  User,
  Bell,
  PlusCircle,
  CheckCircle2,
  Search,
  Shield,
  Zap,
  Clock,
  Layers,
  Sparkles,
  Scale,
  CreditCard,
  Network
} from 'lucide-react';

interface SaaSLayoutProps {
  currentTab: SaaSNavigationTab;
  onSelectTab: (tab: SaaSNavigationTab) => void;
  pendingCount: number;
  onOpenNewApplication: () => void;
  selectedMerchantName?: string;
  selectedAcquirerFilter?: string;
  onSelectAcquirerFilter?: (acqCode: string) => void;
  children: React.ReactNode;
}

interface NavSubItem {
  key: SaaSNavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | null;
  badgeColor?: string;
}

interface NavGroupItem {
  groupId: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavSubItem[];
}

export const SaaSLayout: React.FC<SaaSLayoutProps> = ({
  currentTab,
  onSelectTab,
  pendingCount,
  onOpenNewApplication,
  selectedMerchantName,
  selectedAcquirerFilter = 'ALL',
  onSelectAcquirerFilter,
  children,
}) => {
  const { currentUser, logout, switchUser } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSwitchRoleMenu, setShowSwitchRoleMenu] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  // Group expand/collapse state (all open by default)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    cockpit: true,
    acquirer: true,
    inspection: true,
    supervision: true,
    policy: true,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Two-Level Structured Navigation Groups
  const navGroups: NavGroupItem[] = [
    {
      groupId: 'cockpit',
      title: '监管大屏',
      icon: LayoutDashboard,
      items: [
        {
          key: 'NETWORK_COCKPIT',
          label: '商户质量大屏',
          icon: LayoutDashboard,
          badge: '实时',
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
        },
      ],
    },
    {
      groupId: 'acquirer',
      title: '收单机构',
      icon: Building2,
      items: [
        {
          key: 'ACQUIRER_RANKING',
          label: '机构合规评级榜',
          icon: Building2,
          badge: '8家',
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
        },
      ],
    },
    {
      groupId: 'inspection',
      title: '商户审核',
      icon: Inbox,
      items: [
        {
          key: 'APPLICATIONS',
          label: '进件核验工作台',
          icon: Inbox,
          badge: pendingCount > 0 ? `${pendingCount} 待审` : null,
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
        },
        {
          key: 'CROSS_ACQUIRER_COLLISION',
          label: '跨机构撞库去重',
          icon: ShieldAlert,
          badge: '4 高危',
          badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
        },
        {
          key: 'MCC_COMPLIANCE',
          label: '商户行业与套码稽核',
          icon: Scale,
          badge: '3 异常',
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
        },
        {
          key: 'AUDIT_DETAIL',
          label: '审核作业详情',
          icon: FileCheck2,
          badge: selectedMerchantName ? '当前' : null,
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
        },
      ],
    },
    {
      groupId: 'supervision',
      title: '抽检与问责',
      icon: Zap,
      items: [
        {
          key: 'SWEEP_TASKS',
          label: '飞行检查专项任务',
          icon: Zap,
          badge: '3 项',
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
        },
        {
          key: 'DISPATCH_WORKORDERS',
          label: '机构限期举证工单',
          icon: Clock,
          badge: '48h',
          badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
        },
      ],
    },
    {
      groupId: 'policy',
      title: '风控策略',
      icon: SlidersHorizontal,
      items: [
        {
          key: 'RULE_SETTINGS',
          label: '规则与权重配置',
          icon: SlidersHorizontal,
          badge: null,
        },
        {
          key: 'BLACKLIST',
          label: '联防黑灰名单',
          icon: ShieldAlert,
          badge: '17 拦截',
          badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
        },
        {
          key: 'AUDIT_LOGS',
          label: '操作审计日志',
          icon: History,
          badge: null,
        },
      ],
    },
  ];

  // Breadcrumb mapping
  const breadcrumbLabels: Record<SaaSNavigationTab, string> = {
    DASHBOARD: '商户质量大屏',
    NETWORK_COCKPIT: '商户质量大屏',
    ACQUIRER_RANKING: '收单机构合规评级榜',
    ACQUIRER_BATCHES: '收单机构报送批次档案',
    APPLICATIONS: '商户进件核验工作台',
    APPLICATIONS_INBOX: '商户进件核验工作台',
    CROSS_ACQUIRER_COLLISION: '跨机构撞库去重与关联排查',
    MCC_COMPLIANCE: '商户行业与 MCC 套码稽核',
    SWEEP_TASKS: '飞行检查专项巡航任务',
    DISPATCH_WORKORDERS: '机构 48 小时限期举证工单',
    AUDIT_DETAIL: selectedMerchantName ? `审核作业详情（${selectedMerchantName}）` : '审核作业详情',
    RULE_SETTINGS: '规则与权重配置',
    BLACKLIST: '商户联防黑灰名单库',
    AUDIT_LOGS: '操作审计日志存证',
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans antialiased">
      {/* 1. Left Sidebar (简约浅色风格) */}
      <aside
        className={`bg-white text-slate-700 flex flex-col shrink-0 transition-all duration-200 z-30 select-none border-r border-slate-200 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200 bg-white">
          <div
            onClick={() => onSelectTab('NETWORK_COCKPIT')}
            className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0">
              <Network className="w-4 h-4" />
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="font-semibold text-slate-900 text-xs tracking-tight truncate">
                  商户风控审核系统
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  MERCHANT RISK AUDIT
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Two-level Navigation Groups */}
        <nav className="flex-1 py-3 px-2 space-y-3 overflow-y-auto scrollbar-none">
          {navGroups.map((group) => {
            const isGroupOpen = openGroups[group.groupId] !== false;
            const hasActiveChild = group.items.some(
              (item) => item.key === currentTab || (currentTab === 'DASHBOARD' && item.key === 'NETWORK_COCKPIT')
            );
            const GroupIcon = group.icon;

            return (
              <div key={group.groupId} className="space-y-1">
                {/* Group Header */}
                {!sidebarCollapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.groupId)}
                    className="w-full px-2.5 py-1 flex items-center justify-between text-[11px] font-medium text-slate-400 hover:text-slate-600 uppercase tracking-wider rounded transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <GroupIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{group.title}</span>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 text-slate-400 ${
                        isGroupOpen ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                  </button>
                ) : (
                  <div className="h-2" />
                )}

                {/* Submenu Items */}
                {(isGroupOpen || sidebarCollapsed) && (
                  <div className="space-y-0.5 pl-0">
                    {group.items.map((item) => {
                      const isActive =
                        currentTab === item.key ||
                        (currentTab === 'DASHBOARD' && item.key === 'NETWORK_COCKPIT');
                      const SubIcon = item.icon;

                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => onSelectTab(item.key)}
                          title={sidebarCollapsed ? item.label : undefined}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-slate-100 text-slate-900 font-semibold border border-slate-300 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                        >
                          <SubIcon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-slate-800' : 'text-slate-400'
                            }`}
                          />
                          {!sidebarCollapsed && (
                            <span className="flex-1 text-left truncate">{item.label}</span>
                          )}
                          {!sidebarCollapsed && item.badge && (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${
                                isActive
                                  ? 'bg-white text-slate-800 border-slate-300'
                                  : item.badgeColor
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar User Mini-Card */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/60">
          <div className="relative">
            <div
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs shrink-0">
                {currentUser?.name.slice(0, 1) || '张'}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-800 truncate">
                      {currentUser?.name || '张建国'}
                    </span>
                    <span className="text-[10px] px-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {currentUser?.role === 'ADMIN'
                        ? '超管'
                        : currentUser?.role === 'SENIOR_AUDITOR'
                        ? '主管'
                        : '专员'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {currentUser?.department || '风险运营中心'}
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-xs animate-in fade-in slide-in-from-bottom-2 text-slate-800">
                <div className="px-2 py-1.5 border-b border-slate-100">
                  <div className="font-semibold text-slate-900">{currentUser?.name}</div>
                  <div className="text-[11px] text-slate-500">{currentUser?.email}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    工号: {currentUser?.id}
                  </div>
                </div>

                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowSwitchRoleMenu(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center justify-between"
                  >
                    <span>切换演示身份</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onSelectTab('AUDIT_LOGS');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-50 text-slate-700 hover:text-slate-900 flex items-center justify-between"
                  >
                    <span>操作审计日志</span>
                    <History className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-rose-50 text-rose-600 hover:text-rose-700 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>退出登录</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 border-t border-slate-200 transition-colors"
          title={sidebarCollapsed ? '展开菜单' : '收起菜单'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-1 text-[11px]">
              <ChevronLeft className="w-4 h-4" />
              <span>收起侧边导航</span>
            </div>
          )}
        </button>
      </aside>

      {/* 2. Right Main Operational Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Right Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-20 shadow-2xs">
          {/* Left Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-800">
                {breadcrumbLabels[currentTab] || '商户风控审核'}
              </span>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Global Acquirer Filter Dropdown */}
            <div className="hidden md:flex items-center gap-1.5 text-xs bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500">机构范围:</span>
              <select
                value={selectedAcquirerFilter}
                onChange={(e) => onSelectAcquirerFilter && onSelectAcquirerFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-800 text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">全部收单机构 (8家)</option>
                <option value="1021000">工*银行收单部</option>
                <option value="8221000">银*商务</option>
                <option value="8261000">拉** (关注)</option>
                <option value="8311000">汇*天下 (关注)</option>
                <option value="8491000">收**</option>
                <option value="8781000">恒*通达 (限制)</option>
              </select>
            </div>

            {/* Quick Create Application */}
            <button
              onClick={onOpenNewApplication}
              className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-md shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-600" />
              <span>录入新进件</span>
            </button>

            {/* Pending Badge */}
            {pendingCount > 0 && (
              <button
                onClick={() => onSelectTab('APPLICATIONS')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{pendingCount} 户待核验</span>
              </button>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors relative"
                title="实时风险提示"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              </button>

              {showAlerts && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                    <span className="font-semibold text-slate-900">实时风险提示</span>
                    <span className="text-[10px] text-slate-400">刚刚更新</span>
                  </div>
                  <div className="py-2 space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-100 text-rose-800">
                      <div className="font-semibold text-[11px]">【跨机构一户多开】蜀**老火锅</div>
                      <div className="text-[10px] text-rose-600 mt-0.5">
                        银*商务与恒*通达同执照申报不同MCC，套用低费率代码。
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-100 text-amber-800">
                      <div className="font-semibold text-[11px]">【机构合规评级预警】恒*通达</div>
                      <div className="text-[10px] text-amber-600 mt-0.5">
                        门头照片重复率异常，已被限制日申报配额。
                      </div>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setShowAlerts(false);
                        onSelectTab('CROSS_ACQUIRER_COLLISION');
                      }}
                      className="text-[11px] text-slate-700 hover:underline font-medium"
                    >
                      查看全部撞库排查 →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-slate-200" />

            {/* Current User Pill */}
            <div className="flex items-center gap-2 pl-1">
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-medium text-xs">
                {currentUser?.name.slice(0, 1) || '张'}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-medium text-slate-800 leading-tight">
                  {currentUser?.name || '张建国'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {currentUser?.role_name || '高级审核官'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Right Main Workspace */}
        <main className="flex-1 bg-slate-50/70 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Switch Role Modal */}
      {showSwitchRoleMenu && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">切换操作员身份</h3>
              <button
                onClick={() => setShowSwitchRoleMenu(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-2.5">
              {DEMO_USERS.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    switchUser(u.id);
                    setShowSwitchRoleMenu(false);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    currentUser?.id === u.id
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                      {u.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{u.name}</span>
                        <span className="text-[10px] px-1 rounded bg-slate-100 text-slate-600">
                          {u.role_name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">{u.department}</div>
                    </div>
                  </div>
                  {currentUser?.id === u.id && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
