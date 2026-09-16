import React, { useState } from 'react';
import { PlusCircle, X, Sparkles, Building, Globe, Send, RefreshCw } from 'lucide-react';
import { BusinessType, MerchantAuditReport } from '../types';
import { MerchantRiskEvaluator } from '../services/evaluator';

interface NewAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitNewReport: (report: MerchantAuditReport) => void;
}

export const NewAuditModal: React.FC<NewAuditModalProps> = ({
  isOpen,
  onClose,
  onSubmitNewReport,
}) => {
  const [merchantName, setMerchantName] = useState('上海启航新零售供应链发展有限公司');
  const [creditCode, setCreditCode] = useState('91310115MA1H98801K');
  const [legalPerson, setLegalPerson] = useState('赵天明');
  const [businessType, setBusinessType] = useState<BusinessType>('ENTERPRISE');
  const [registeredCapital, setRegisteredCapital] = useState('1000.00 万元人民币');
  const [operatingPeriod, setOperatingPeriod] = useState('2020-04-10 至 长期');
  const [businessScope, setBusinessScope] = useState(
    '日用百货销售；食品销售；食用农产品批发；供应链管理服务；国内贸易代理；货物进出口。'
  );
  const [onlineUrl, setOnlineUrl] = useState('https://www.qihang-supply.com');
  const [agreementTitle, setAgreementTitle] = useState('进出口生鲜供应链冷链年度供销代理协议');
  const [agreementAmount, setAgreementAmount] = useState('¥ 5,000,000.00');

  // Risk presets to quickly experiment
  const [riskPreset, setRiskPreset] = useState<'NORMAL' | 'SUSPICIOUS' | 'HIGH_RISK'>('NORMAL');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: 'NORMAL' | 'SUSPICIOUS' | 'HIGH_RISK') => {
    setRiskPreset(preset);
    if (preset === 'NORMAL') {
      setMerchantName('上海启航新零售供应链发展有限公司');
      setCreditCode('91310115MA1H98801K');
      setLegalPerson('赵天明');
      setBusinessScope('日用百货销售；食品销售；食用农产品批发；供应链管理服务。');
      setOnlineUrl('https://www.qihang-supply.com');
      setAgreementTitle('进出口生鲜供应链冷链年度供销代理协议');
    } else if (preset === 'SUSPICIOUS') {
      setMerchantName('成都华创数智互动传媒有限公司');
      setCreditCode('91510100MA6C9XYZ1P');
      setLegalPerson('王德发');
      setBusinessScope('数字内容制作；广告设计、代理；计算机软硬件批发。');
      setOnlineUrl('http://www.huachuang-media.cn');
      setAgreementTitle('境外算力芯片租赁与特种机房供销居间协议');
    } else {
      setMerchantName('深圳市金辉通达财富管理咨询服务部');
      setCreditCode('92440300MA5FFAKE88');
      setLegalPerson('钱大富');
      setBusinessScope('企业管理咨询；市场营销策划。');
      setOnlineUrl('http://www.jin-hui-pay88.com');
      setAgreementTitle('跨境高额理财代理返佣协议');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reportId = `RPT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;
    const appId = `APP-CUST-${Math.floor(1000 + Math.random() * 9000)}`;

    // Build rule results based on preset
    const isNormal = riskPreset === 'NORMAL';
    const isSuspicious = riskPreset === 'SUSPICIOUS';

    const kycRules = [
      {
        rule_code: 'KYC-LICENSE-01',
        rule_basis: '营业执照鉴真规范 §2.1',
        item_name: '电子证照/纸质原件检测',
        result: isNormal ? ('PASS' as const) : isSuspicious ? ('PASS' as const) : ('FAIL' as const),
        detail: isNormal
          ? '营业执照原件微缩文字完好，二维码解析合法。'
          : isSuspicious
          ? '纸质执照原图正常。'
          : '执照印章及防伪底纹有明显PS重叠与抠图伪造痕迹！',
        weight: 0.8,
      },
      {
        rule_code: 'KYC-LICENSE-03',
        rule_basis: 'GB 32100-2015 编码规范',
        item_name: '企业统一社会信用代码一致性',
        result: isNormal || isSuspicious ? ('PASS' as const) : ('FAIL' as const),
        detail: isNormal || isSuspicious ? '18位统一社会信用代码校验位合法并与底账一致。' : '统一社会信用代码校验失败，底账查无此码。',
        weight: 1.0,
        is_veto: true,
      },
      {
        rule_code: 'KYC-LICENSE-04',
        rule_basis: '工商核验标准 §1.2',
        item_name: '企业法定名称比对',
        result: 'PASS' as const,
        detail: `企业名称严格全等匹配：${merchantName}`,
        weight: 1.0,
        is_veto: true,
      },
      {
        rule_code: 'KYC-LICENSE-09',
        rule_basis: '执照期限规范 §2.3',
        item_name: '营业期限完整性与有效期',
        result: isSuspicious ? ('WARNING' as const) : ('PASS' as const),
        detail: isSuspicious ? '营业期限OCR未识别到止期，需人工复核市监网登记。' : '营业期限有效，非临近过期。',
        weight: 0.9,
      },
      {
        rule_code: 'KYC-LEGAL-02',
        rule_basis: '公安身份核验体系 §3.1',
        item_name: '法代证件字段比对 (姓名/号码/有效期)',
        result: 'PASS' as const,
        detail: `法人 ${legalPerson} 身份证联网核查一致，证件有效期正常。`,
        weight: 1.0,
        is_veto: true,
      },
      {
        rule_code: 'KYC-IMAGE-02',
        rule_basis: 'CV图像取证规范 §4.1',
        item_name: 'PS涂抹与像素篡改鉴定',
        result: isNormal || isSuspicious ? ('PASS' as const) : ('FAIL' as const),
        detail: isNormal || isSuspicious ? '未见PS涂抹噪点异常。' : '【一票否决】执照文字区域检测到高斯贴图PS篡改痕迹！',
        weight: 1.0,
        is_veto: true,
      },
    ];

    const kybAgreements = [
      {
        tab_id: 'AGREE-CUST-01',
        doc_name: agreementTitle,
        doc_amount: agreementAmount,
        summary_status: isNormal ? ('PASS' as const) : isSuspicious ? ('WARNING' as const) : ('FAIL' as const),
        audit_rules: [
          {
            rule_code: 'KYB-AGREE-00',
            rule_basis: '合同合规审查标准 §5.1',
            item_name: '协议签署方主体核验',
            result: isNormal || isSuspicious ? ('PASS' as const) : ('FAIL' as const),
            detail: `签约主体核验：${merchantName}`,
            weight: 1.0,
            is_veto: true,
          },
          {
            rule_code: 'KYB-AGREE-05',
            rule_basis: 'LLM语义契合度标准 §5.5',
            item_name: '合同品目与经营范围关联度',
            result: isNormal ? ('PASS' as const) : isSuspicious ? ('WARNING' as const) : ('FAIL' as const),
            detail: isNormal
              ? '合同标的与主营业务高度契合。'
              : isSuspicious
              ? '申报合同标的与核定经营范围存在轻微跨界差异，需人工确认。'
              : '合同涉及违规金融理财或禁入业务，经营范围完全无此项。',
            weight: 0.85,
          },
        ],
      },
    ];

    const kybInvoices = [
      {
        tab_id: 'INV-CUST-01',
        doc_name: '增值税专用发票',
        doc_amount: '¥ 680,000.00',
        summary_status: isNormal ? ('PASS' as const) : ('PASS' as const),
        audit_rules: [
          {
            rule_code: 'KYB-INV-01',
            rule_basis: '税务局底账查验平台接口规范',
            item_name: '发票真实性查验',
            result: isNormal || isSuspicious ? ('PASS' as const) : ('FAIL' as const),
            detail: isNormal || isSuspicious ? '国税直连查验一致，为有效真票。' : '【一票否决】发票代码不存在，系伪造发票！',
            weight: 1.0,
            is_veto: true,
          },
        ],
      },
    ];

    const kybVenues = [
      {
        rule_code: 'KYB-VENUE-01',
        rule_basis: '实体场地核验规范 §7.1',
        item_name: '经营场地门头牌匾文字核验',
        result: isNormal || isSuspicious ? ('PASS' as const) : ('FAIL' as const),
        detail: '门头牌匾标识文字比对。',
        weight: 0.85,
      },
      {
        rule_code: 'KYB-VENUE-02',
        rule_basis: 'EXIF传感器取证标准 §7.2',
        item_name: '照片EXIF原始信息与GPS解析',
        result: isSuspicious ? ('WARNING' as const) : ('PASS' as const),
        detail: isSuspicious ? '场地照片缺失GPS经纬度信息，需人工复核。' : 'GPS经纬度与注册地围栏偏差 < 100米。',
        weight: 0.7,
      },
    ];

    const kybScenes = [
      {
        rule_code: 'KYB-SCENE-01',
        rule_basis: '工信部域名备案管理办法 §8.1',
        item_name: '网络场景ICP备案与主体一致性',
        result: isNormal || isSuspicious ? ('PASS' as const) : ('FAIL' as const),
        detail: isNormal || isSuspicious ? `域名 ${onlineUrl} 工信部ICP备案主办方一致。` : '【一票否决】申报域名未取得工信部合法ICP备案。',
        weight: 1.0,
        is_veto: true,
      },
    ];

    const kybReputation = [
      {
        rule_code: 'KYB-REPUT-01',
        rule_basis: '最高人民法院失信黑名单管理规范',
        item_name: '最高法失信被执行人一票否决',
        result: isNormal || isSuspicious ? ('PASS' as const) : ('FAIL' as const),
        detail: isNormal || isSuspicious ? '全国法院失信被执行人库查验未命中。' : '【一票否决】法定代表人命中最高法失信被执行人黑名单！',
        weight: 1.0,
        is_veto: true,
      },
    ];

    // Evaluate full report using MerchantRiskEvaluator
    const allFlattenedRules = [
      ...kycRules,
      ...kybAgreements.flatMap((a) => a.audit_rules),
      ...kybInvoices.flatMap((i) => i.audit_rules),
      ...kybVenues,
      ...kybScenes,
      ...kybReputation,
    ];

    const evaluator = new MerchantRiskEvaluator();
    const evalResult = evaluator.evaluate(allFlattenedRules);

    const newReport: MerchantAuditReport = {
      report_meta: {
        report_id: reportId,
        application_id: appId,
        tenant_id: 'TENANT-CUSTOM-SUBMISSION',
        generated_time: new Date().toISOString(),
        model_version: 'MAAP-Engine-v3.8.2-Prod',
        execution_time_ms: Math.floor(1400 + Math.random() * 800),
      },
      merchant_info: {
        merchant_no: `MCH-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        merchant_name: merchantName,
        legal_person: legalPerson,
        unified_credit_code: creditCode,
        business_type: businessType,
        registered_capital: registeredCapital,
        establish_date: '2020-04-10',
        operating_period: operatingPeriod,
        registered_address: '中国自由贸易试验区临港新片区环湖西二路888号',
        business_scope: businessScope,
        settlement_account: {
          account_name: merchantName,
          account_no: '6214 **** **** 8819',
          bank_name: '中国招*银行上海分行',
          account_type: 'CORPORATE',
        },
        online_scene_url: onlineUrl,
      },
      overall_evaluation: {
        final_decision: evalResult.decision,
        confidence_score: evalResult.final_score,
        sub_scores: evalResult.sub_scores,
        conclusion: evalResult.conclusion,
      },
      audit_sections: {
        kyc: {
          status: evalResult.sub_scores.kyc_status,
          rules: kycRules,
        },
        kyb: {
          agreements: kybAgreements,
          invoices: kybInvoices,
          venues: kybVenues,
          scene_probe: kybScenes,
          reputation: kybReputation,
        },
      },
      recommendation: {
        action: evalResult.decision === 'PASS' ? 'APPROVE_AUTOMATICALLY' : evalResult.decision === 'MANUAL_REVIEW' ? 'REQUIRE_MANUAL_VERIFICATION' : 'REJECT_AND_BLACKLIST',
        focus_issues: evalResult.focus_issues,
        mitigation_conditions: evalResult.mitigation_conditions,
      },
    };

    onSubmitNewReport(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">
                新建商户进件申请与智能审核 (New Merchant Submission)
              </h2>
              <p className="text-xs text-slate-500">
                录入商户基础工商材料、业务申报及合同品目，触发 5 阶段并联 AI 审核引擎
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Quick Preset Selector */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              快速套用典型业务场景进件样本:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleApplyPreset('NORMAL')}
                className={`py-2 px-3 rounded-lg font-semibold border cursor-pointer transition-all ${
                  riskPreset === 'NORMAL'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                1. 真实合规供应链商户 (准入)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('SUSPICIOUS')}
                className={`py-2 px-3 rounded-lg font-semibold border cursor-pointer transition-all ${
                  riskPreset === 'SUSPICIOUS'
                    ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                2. 品目跨界待人工核验商户 (复核)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('HIGH_RISK')}
                className={`py-2 px-3 rounded-lg font-semibold border cursor-pointer transition-all ${
                  riskPreset === 'HIGH_RISK'
                    ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                3. PS伪造证照失信商户 (拦截)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">商户法定名称 *</label>
              <input
                type="text"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-blue-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">统一社会信用代码 *</label>
              <input
                type="text"
                value={creditCode}
                onChange={(e) => setCreditCode(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-blue-500 font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">法定代表人姓名 *</label>
              <input
                type="text"
                value={legalPerson}
                onChange={(e) => setLegalPerson(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-blue-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">主体经营类型</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-blue-500 text-slate-800"
              >
                <option value="ENTERPRISE">企业法人 (ENTERPRISE)</option>
                <option value="INDIVIDUAL">个体工商户 (INDIVIDUAL)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">核定经营范围 (执照OCR提取值)</label>
            <textarea
              value={businessScope}
              onChange={(e) => setBusinessScope(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-blue-500 text-slate-800 leading-relaxed font-mono text-[11px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">申报线上场景域名/商城URL</label>
              <input
                type="text"
                value={onlineUrl}
                onChange={(e) => setOnlineUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-blue-500 text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">申报业务合作协议名称</label>
              <input
                type="text"
                value={agreementTitle}
                onChange={(e) => setAgreementTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-blue-500 text-slate-800"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-slate-600 text-[11px] leading-relaxed">
            提示：点击“提交并启动智能审核流水线”后，系统将模拟执行材料鉴真、工商与国税底账交叉核验、网络场景动态探测，并通过
            Drools 评分引擎执行 30+ 规则原子项打分与决策判定。
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>提交并启动智能审核流水线</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
