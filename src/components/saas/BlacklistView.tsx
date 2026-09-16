import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  PlusCircle,
  AlertTriangle,
  Globe2,
  Store,
  UserX,
  FileX,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface BlacklistItem {
  id: string;
  target_type: 'PERSON' | 'DOMAIN' | 'PHOTO_HASH' | 'ENTERPRISE';
  target_name: string;
  risk_reason: string;
  source: string;
  intercept_count: number;
  added_time: string;
  status: 'ACTIVE' | 'DISABLED';
}

export const BlacklistView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const [items, setItems] = useState<BlacklistItem[]>([
    {
      id: 'BLK-001',
      target_type: 'PHOTO_HASH',
      target_name: 'pHash:e3f89a02b1c4 (58同城转店盗图库)',
      risk_reason: '公共商业出租门面盗图，已被3起冒领POS机进件命中',
      source: '多模态反向搜图黑样本库',
      intercept_count: 14,
      added_time: '2026-08-15',
      status: 'ACTIVE',
    },
    {
      id: 'BLK-002',
      target_type: 'PERSON',
      target_name: '王大福 (41010519800512****)',
      risk_reason: '最高人民法院失信被执行人（涉案未执行金额 120 万元）',
      source: '全国法院被执行人信息网',
      intercept_count: 5,
      added_time: '2026-07-20',
      status: 'ACTIVE',
    },
    {
      id: 'BLK-003',
      target_type: 'DOMAIN',
      target_name: 'pay-fastcash-global.xyz',
      risk_reason: '涉及境外博彩代收代付（跑分洗钱中继重定向网关）',
      source: '网信办与反诈白名单穿透',
      intercept_count: 28,
      added_time: '2026-09-01',
      status: 'ACTIVE',
    },
    {
      id: 'BLK-004',
      target_type: 'ENTERPRISE',
      target_name: '鼎盛通达商贸工作室',
      risk_reason: '营业执照PS伪造涂抹、虚假经营地址',
      source: '人工复核一票否决归档',
      intercept_count: 3,
      added_time: '2026-09-10',
      status: 'ACTIVE',
    },
  ]);

  const filtered = items.filter((item) => {
    if (filterType !== 'ALL' && item.target_type !== filterType) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        item.target_name.toLowerCase().includes(term) ||
        item.risk_reason.toLowerCase().includes(term) ||
        item.source.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>风险名单与底线负面库</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            维护失信法人、涉诈违规域名、虚假门头盗图样本。凡进件触发名单者直接执行一票否决
          </p>
        </div>

        <button
          onClick={() => alert('此功能面向风控管理员开放批量导入与新增')}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>录入风险名单</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索风险主体名称、命中原因、数据来源..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-slate-500 mr-1 whitespace-nowrap">主体类型:</span>
          {[
            { key: 'ALL', label: '全部名单' },
            { key: 'PERSON', label: '失信人员' },
            { key: 'DOMAIN', label: '涉诈域名' },
            { key: 'PHOTO_HASH', label: '盗图黑图库' },
            { key: 'ENTERPRISE', label: '失信企业' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setFilterType(t.key)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                filterType === t.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">风险主体 / 特征目标</th>
              <th className="py-3 px-3">主体类型</th>
              <th className="py-3 px-3">风险认定原因</th>
              <th className="py-3 px-3">情报数据来源</th>
              <th className="py-3 px-3">累计拦截进件</th>
              <th className="py-3 px-3">录入日期</th>
              <th className="py-3 px-4 text-center">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  {item.target_name}
                </td>
                <td className="py-3.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.target_type === 'PERSON'
                        ? 'bg-amber-100 text-amber-800'
                        : item.target_type === 'DOMAIN'
                        ? 'bg-blue-100 text-blue-800'
                        : item.target_type === 'PHOTO_HASH'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.target_type === 'PERSON'
                      ? '失信自然人'
                      : item.target_type === 'DOMAIN'
                      ? '高危域名'
                      : item.target_type === 'PHOTO_HASH'
                      ? '门头黑图库'
                      : '失信企业'}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-slate-700 max-w-xs">{item.risk_reason}</td>
                <td className="py-3.5 px-3 text-slate-500">{item.source}</td>
                <td className="py-3.5 px-3 font-mono font-bold text-rose-600">
                  {item.intercept_count} 次
                </td>
                <td className="py-3.5 px-3 font-mono text-slate-500">{item.added_time}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    已生效拦截
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
