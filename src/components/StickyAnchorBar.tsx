import React from 'react';
import {
  ShieldCheck,
  FileCheck,
  Award,
  FileSpreadsheet,
  Building2,
  Globe2,
  Scale,
  Layers,
  AlignJustify
} from 'lucide-react';

export type AuditSectionTabId =
  | 'sec-overview'
  | 'sec-kyc'
  | 'sec-agreements'
  | 'sec-invoices'
  | 'sec-venues'
  | 'sec-scene'
  | 'sec-reputation';

export type ViewMode = 'CARD' | 'FLAT';

export interface AnchorItem {
  id: AuditSectionTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  status?: 'PASS' | 'WARNING' | 'FAIL' | 'EXEMPT';
}

interface StickyAnchorBarProps {
  activeTab?: AuditSectionTabId;
  onSelectTab?: (id: AuditSectionTabId) => void;
  viewMode?: ViewMode;
  onToggleViewMode?: (mode: ViewMode) => void;
  isOnlineType?: boolean;
  tabStatuses?: Partial<Record<AuditSectionTabId, 'PASS' | 'WARNING' | 'FAIL' | 'EXEMPT'>>;
}

export const StickyAnchorBar: React.FC<StickyAnchorBarProps> = ({
  activeTab = 'sec-overview',
  onSelectTab,
  viewMode = 'CARD',
  onToggleViewMode,
  isOnlineType = false,
  tabStatuses = {},
}) => {
  const anchors: AnchorItem[] = [
    {
      id: 'sec-overview',
      label: '总体研判与决策',
      icon: ShieldCheck,
      status: tabStatuses['sec-overview'] || 'PASS',
    },
    {
      id: 'sec-kyc',
      label: '基础资质KYC',
      icon: Award,
      status: tabStatuses['sec-kyc'] || 'PASS',
    },
    {
      id: 'sec-agreements',
      label: '商业合同KYB',
      icon: FileCheck,
      status: tabStatuses['sec-agreements'] || 'PASS',
    },
    {
      id: 'sec-invoices',
      label: '发票税务合规',
      icon: FileSpreadsheet,
      status: tabStatuses['sec-invoices'] || 'PASS',
    },
    {
      id: 'sec-venues',
      label: '线下场地与GIS',
      icon: Building2,
      status: tabStatuses['sec-venues'] || (isOnlineType ? 'EXEMPT' : 'PASS'),
    },
    {
      id: 'sec-scene',
      label: '线上场景与网络探针',
      icon: Globe2,
      status: tabStatuses['sec-scene'] || (!isOnlineType ? 'EXEMPT' : 'PASS'),
    },
    {
      id: 'sec-reputation',
      label: '司法舆情底线',
      icon: Scale,
      status: tabStatuses['sec-reputation'] || 'PASS',
    },
  ];

  const handleTabClick = (id: AuditSectionTabId) => {
    if (onSelectTab) {
      onSelectTab(id);
    }
    if (viewMode === 'FLAT') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const renderStatusIndicator = (status?: 'PASS' | 'WARNING' | 'FAIL' | 'EXEMPT') => {
    if (!status) return null;
    if (status === 'PASS') {
      return <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="核验正常" />;
    }
    if (status === 'WARNING') {
      return <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="存在预警/待审" />;
    }
    if (status === 'FAIL') {
      return <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="存在高危异常" />;
    }
    if (status === 'EXEMPT') {
      return (
        <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200">
          豁免
        </span>
      );
    }
    return null;
  };

  const activeAnchorIndex = anchors.findIndex((a) => a.id === activeTab);
  const activeAnchorItem = anchors[activeAnchorIndex] || anchors[0];

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-2xs p-3 space-y-2.5">
      {/* Top Line: Navigation Title, Current Status & View Mode Switcher */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-slate-800 rounded-full inline-block"></span>
            核验维度导航
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">|</span>
          <span className="text-xs text-slate-500 hidden sm:flex items-center gap-1.5 truncate">
            <span>当前环节：</span>
            <span className="font-semibold text-slate-800">{activeAnchorItem.label}</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-mono">
              {activeAnchorIndex + 1}/7
            </span>
          </span>
        </div>

        {/* View Mode Switcher */}
        {onToggleViewMode && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-slate-400 hidden sm:inline">视图模式:</span>
            <div className="bg-slate-100 p-0.5 rounded-lg flex items-center gap-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => onToggleViewMode('CARD')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'CARD'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="卡片分步切换查看"
              >
                <Layers className="w-3.5 h-3.5 text-slate-600" />
                <span>卡片切换</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleViewMode('FLAT')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'FLAT'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="全部平铺长页面"
              >
                <AlignJustify className="w-3.5 h-3.5 text-slate-600" />
                <span>平铺总览</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Second Line: 7 Dimension Buttons in Adaptive Grid/Flex Wrap */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2">
        {anchors.map((item, idx) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer text-left ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/90'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0 truncate">
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? 'text-slate-100' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="shrink-0 pl-1">
                {renderStatusIndicator(item.status)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

