import React, { useState } from 'react';
import { CrossAcquirerCollisionRecord } from '../../types';
import { DEMO_CROSS_COLLISIONS } from '../../data/cardSchemeData';
import {
  ShieldAlert,
  Building2,
  Users,
  CreditCard,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Send,
  Ban,
  FileCheck2,
  Search,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface CrossAcquirerCollisionViewProps {
  onDispatchWorkOrder?: (targetName: string, acquirerName: string) => void;
}

export const CrossAcquirerCollisionView: React.FC<CrossAcquirerCollisionViewProps> = ({
  onDispatchWorkOrder,
}) => {
  const [collisions, setCollisions] = useState<CrossAcquirerCollisionRecord[]>(DEMO_CROSS_COLLISIONS);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredCollisions = collisions.filter((c) => {
    const matchType = selectedType === 'ALL' || c.collision_type === selectedType;
    const matchSearch =
      c.target_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.risk_summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const handleBlockNetwork = (id: string, name: string) => {
    setCollisions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'VERIFIED_FRAUD' as const } : c))
    );
    showToast(`已向全网 8 家直联收单机构广播针对【${name}】的清退与全网黑名单拦截指令！`);
  };

  const handleDispatch = (record: CrossAcquirerCollisionRecord) => {
    setCollisions((prev) =>
      prev.map((c) => (c.id === record.id ? { ...c, status: 'UNDER_INVESTIGATION' as const } : c))
    );
    showToast(`已向涉及的收单机构下发《48小时限期跨机构核查澄清函》！`);
    if (onDispatchWorkOrder && record.involved_acquirers[0]) {
      onDispatchWorkOrder(record.target_name, record.involved_acquirers[0].acquirer_name);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
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
            <span>卡组织监管中枢</span>
            <span>/</span>
            <span className="text-blue-600 font-semibold">跨机构穿透核查</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            跨收单机构撞库去重与关联团伙排查
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            依托卡组织全网跨行清算底账，针对多机构一户多开、职业中介法人多挂、同一银行账号复用及物理门面冲突执行智能比对。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>检出高危撞库 {collisions.length} 起</span>
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'ALL', label: '全部撞库发现', icon: ShieldAlert, count: collisions.length },
            {
              key: 'MULTI_ACQUIRER_SAME_ENTITY',
              label: '同一实体多机构多开',
              icon: Building2,
              count: collisions.filter((c) => c.collision_type === 'MULTI_ACQUIRER_SAME_ENTITY').length,
            },
            {
              key: 'LEGAL_PERSON_EXCESSIVE',
              label: '法人名下多挂代持',
              icon: Users,
              count: collisions.filter((c) => c.collision_type === 'LEGAL_PERSON_EXCESSIVE').length,
            },
            {
              key: 'BANK_ACCOUNT_REUSED',
              label: '结算账户跨商户复用',
              icon: CreditCard,
              count: collisions.filter((c) => c.collision_type === 'BANK_ACCOUNT_REUSED').length,
            },
            {
              key: 'GEO_LOCATION_CONFLICT',
              label: '物理门面经纬度冲突',
              icon: MapPin,
              count: collisions.filter((c) => c.collision_type === 'GEO_LOCATION_CONFLICT').length,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedType === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedType(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="输入企业名称、统一社会信用代码、法人姓名或结算银行卡号搜索撞库记录..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Collision Records Cards */}
      <div className="space-y-4">
        {filteredCollisions.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                    record.risk_level === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {record.risk_level === 'CRITICAL' ? '严重违规撞库' : '高危冲突预警'}
                </span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  {record.target_name}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  侦测时间: {record.detected_at}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-medium font-mono ${
                    record.status === 'VERIFIED_FRAUD'
                      ? 'bg-rose-600 text-white'
                      : record.status === 'UNDER_INVESTIGATION'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {record.status === 'VERIFIED_FRAUD'
                    ? '已确认违规并全网阻断'
                    : record.status === 'UNDER_INVESTIGATION'
                    ? '举证督办中'
                    : '待卡组织裁定'}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Risk Summary with AI icon */}
              <div className="p-3.5 rounded-lg bg-rose-50/70 border border-rose-200 text-rose-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  <span>卡组织穿透判定与风险研判：</span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed">
                  {record.risk_summary}
                </p>
              </div>

              {/* Cross-Institution Involved Table */}
              <div>
                <div className="font-semibold text-slate-800 mb-2 flex items-center justify-between">
                  <span>涉及直联收单机构及报送详情 ({record.involved_acquirers.length} 家)：</span>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-medium">
                        <th className="py-2.5 px-3">收单机构</th>
                        <th className="py-2.5 px-3">机构申报商户店名</th>
                        <th className="py-2.5 px-3">申报行业 MCC 及扣率</th>
                        <th className="py-2.5 px-3">申报时间</th>
                        <th className="py-2.5 px-3">当前在网清算状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {record.involved_acquirers.map((acq, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {acq.acquirer_name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-800">
                            {acq.merchant_name}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">
                            {acq.mcc || '未单独指定'}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">
                            {acq.submitted_at}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                acq.status.includes('正常')
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : acq.status.includes('冻结') || acq.status.includes('一票否决')
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {acq.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleDispatch(record)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-blue-600" />
                  <span>下发48h机构澄清督办函</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBlockNetwork(record.id, record.target_name)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>一键全网联防阻断与拉黑</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
