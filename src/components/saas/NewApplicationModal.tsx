import React, { useState } from 'react';
import { MerchantApplication, MerchantCategory } from '../../types';
import {
  Building2,
  Globe2,
  Store,
  Compass,
  FileCheck2,
  PlusCircle,
  XCircle,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface NewApplicationModalProps {
  onClose: () => void;
  onSubmit: (newApp: MerchantApplication, runAuditImmediately: boolean) => void;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [merchantCategory, setMerchantCategory] = useState<MerchantCategory>('OFFLINE');
  const [merchantName, setMerchantName] = useState('');
  const [legalPerson, setLegalPerson] = useState('');
  const [unifiedCreditCode, setUnifiedCreditCode] = useState('');
  const [registeredCapital, setRegisteredCapital] = useState('100.00 万元人民币');
  const [targetLocation, setTargetLocation] = useState('');
  const [submissionChannel, setSubmissionChannel] = useState('商户自提进件');
  const [businessScope, setBusinessScope] = useState('');
  const [autoRun, setAutoRun] = useState(true);

  // Prefill templates for quick demo
  const handleApplyTemplate = (type: MerchantCategory) => {
    setMerchantCategory(type);
    if (type === 'OFFLINE') {
      setMerchantName('巴蜀味道餐饮连锁（成都）有限公司');
      setLegalPerson('王建华');
      setUnifiedCreditCode('91510104MA6890123L');
      setTargetLocation('成都市武侯区人民南路四段19号1栋2层');
      setBusinessScope('大型餐饮服务；食品销售；餐饮管理；酒水销售。');
    } else if (type === 'ONLINE') {
      setMerchantName('星芒优品数码电商（杭州）有限公司');
      setLegalPerson('陈雪峰');
      setUnifiedCreditCode('91330108MA7711223P');
      setTargetLocation('https://mall.starlight-digital.cn');
      setBusinessScope('互联网信息服务；电子产品销售；软件开发；第二类增值电信业务。');
    } else {
      setMerchantName('海联跨境供应链科技（宁波）有限公司');
      setLegalPerson('赵海洋');
      setUnifiedCreditCode('91330201MA8822334K');
      setTargetLocation('https://www.hailian-supply.com');
      setBusinessScope('海运进出口货运代理；国际贸易；货物进出口；保税仓储服务。');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantName.trim() || !unifiedCreditCode.trim()) {
      alert('请填写商户名称和统一社会信用代码');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newApp: MerchantApplication = {
      id: `APP-NEW-${Date.now()}`,
      application_no: `APP-${merchantCategory === 'OFFLINE' ? 'CD' : merchantCategory === 'ONLINE' ? 'HZ' : 'NB'}-2026-${randomSuffix}`,
      merchant_name: merchantName,
      merchant_category: merchantCategory,
      business_type: 'ENTERPRISE',
      unified_credit_code: unifiedCreditCode,
      legal_person: legalPerson || '张明',
      registered_capital: registeredCapital,
      registered_address: targetLocation,
      business_scope: businessScope,
      submission_channel: submissionChannel,
      submitted_at: new Date().toLocaleString(),
      status: 'PENDING_AUDIT',
      target_url_or_venue: targetLocation,
      summary_findings: [
        `新申报进件，商户类型为【${merchantCategory === 'OFFLINE' ? '线下实体' : merchantCategory === 'ONLINE' ? '线上电商' : '跨境外贸'}】`,
        '待启动针对性多维AI并联审核流水线'
      ]
    };

    onSubmit(newApp, autoRun);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95">
        <div className="bg-white px-6 py-4 border-b border-slate-200 text-slate-900 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <PlusCircle className="w-4 h-4" />
              </div>
              <span>录入新商户进件申请</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              录入后系统将按商户类型自动分配专属审核流水线
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Category Choice */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800 block">选择申报商户类型：</label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleApplyTemplate('OFFLINE')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  merchantCategory === 'OFFLINE'
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-amber-900 mb-1">
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>线下实体商户</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-snug">
                  餐饮/商超/生活服务。核验门头OCR、GIS围栏、实景防盗图。
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleApplyTemplate('ONLINE')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  merchantCategory === 'ONLINE'
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-blue-900 mb-1">
                  <Globe2 className="w-4 h-4 text-blue-600" />
                  <span>线上电商/SaaS</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-snug">
                  独立站/网络平台。核验工信部ICP备案、动态探针、跑分跳转。
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleApplyTemplate('CROSS_BORDER')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  merchantCategory === 'CROSS_BORDER'
                    ? 'border-purple-500 bg-purple-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-purple-900 mb-1">
                  <Compass className="w-4 h-4 text-purple-600" />
                  <span>跨境供应链</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-snug">
                  外贸进出口。核验海关报关单、外管局收支合规名录。
                </p>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-slate-700">商户法定全称 *</label>
              <input
                type="text"
                required
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                placeholder="例如：巴蜀味道餐饮管理有限公司"
                className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">统一社会信用代码 *</label>
              <input
                type="text"
                required
                value={unifiedCreditCode}
                onChange={(e) => setUnifiedCreditCode(e.target.value)}
                placeholder="18位统一代码"
                className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">法定代表人姓名</label>
              <input
                type="text"
                value={legalPerson}
                onChange={(e) => setLegalPerson(e.target.value)}
                placeholder="法人姓名"
                className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-700">进件接入渠道</label>
              <select
                value={submissionChannel}
                onChange={(e) => setSubmissionChannel(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="商户自提进件">商户自提进件</option>
                <option value="API开放平台自动进件">API开放平台自动进件</option>
                <option value="渠道大客户经理代办">渠道大客户经理代办</option>
                <option value="移动端服务商APP录入">移动端服务商APP录入</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-slate-700">
              {merchantCategory === 'OFFLINE' ? '实体经营地址 / 门头位置 *' : '网络场景 URL / 域名 *'}
            </label>
            <input
              type="text"
              required
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              placeholder={
                merchantCategory === 'OFFLINE'
                  ? '例如：成都市武侯区人民南路四段19号1栋2层'
                  : '例如：https://mall.starlight-digital.cn'
              }
              className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-slate-700">营业执照核定经营范围</label>
            <textarea
              rows={2}
              value={businessScope}
              onChange={(e) => setBusinessScope(e.target.value)}
              placeholder="执照经营范围描述..."
              className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoRun}
                onChange={(e) => setAutoRun(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-700 font-medium">创建后立即启动 AI 针对性智能审核</span>
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>提交并录入进件</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
