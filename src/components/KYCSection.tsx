import React, { useState } from 'react';
import { MerchantInfo, RuleAuditItem } from '../types';
import { CompareCard } from './CompareCard';
import {
  Building2,
  UserCheck,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Layers,
  FileCheck2,
  Scan,
  Sparkles
} from 'lucide-react';

interface KYCSectionProps {
  merchantInfo: MerchantInfo;
  rules: RuleAuditItem[];
  status: 'PASS' | 'WARNING' | 'FAIL';
}

export const KYCSection: React.FC<KYCSectionProps> = ({ merchantInfo, rules, status }) => {
  const [activeDocTab, setActiveDocTab] = useState<number>(0);
  const [showMatrixView, setShowMatrixView] = useState<boolean>(false);

  const licenseRules = rules.filter((r) => r.rule_code.startsWith('KYC-LICENSE'));
  const legalRules = rules.filter((r) => r.rule_code.startsWith('KYC-LEGAL'));
  const settleRules = rules.filter((r) => r.rule_code.startsWith('KYC-SETTLE'));
  const imageRules = rules.filter((r) => r.rule_code.startsWith('KYC-IMAGE'));

  const docInspectionList = [
    {
      id: 'doc-license',
      title: '营业执照',
      type: '原件扫描 / 电子证照',
      copyCheck: { status: 'PASS', text: '原件色彩自然，无复印件二次翻拍黑白失真' },
      watermarkCheck: { status: 'PASS', text: '无恶意阻断水印，仅包含标准电子证照说明水印' },
      tamperCheck: { status: 'PASS', text: '边缘连续性良好，印章及文字无PS图层拼接或篡改痕迹' }
    },
    {
      id: 'doc-id-front',
      title: '法代身份证正面',
      type: '人像面彩色原件',
      copyCheck: { status: 'PASS', text: '原件真实拍摄，微缩防伪底纹清晰可辨' },
      watermarkCheck: { status: 'PASS', text: '符合白名单水印规范（或无遮挡性水印）' },
      tamperCheck: { status: 'PASS', text: '人像边缘、字体排版无PS篡改与换头痕迹' }
    },
    {
      id: 'doc-id-back',
      title: '法代身份证反面',
      type: '国徽面彩色原件',
      copyCheck: { status: 'PASS', text: '国徽及长城纹理清晰，无黑白复印或屏幕翻拍摩尔纹' },
      watermarkCheck: { status: 'PASS', text: '无影响文字核验的水印遮盖' },
      tamperCheck: { status: 'PASS', text: '签发机关与有效期限文字对齐自然，无篡改痕迹' }
    },
    {
      id: 'doc-card-front',
      title: '结算银行卡正面',
      type: '借记卡凸印/平印面',
      copyCheck: { status: 'PASS', text: '真实塑料实体卡拍摄，磁条/芯片反光自然' },
      watermarkCheck: { status: 'PASS', text: '未见遮挡16/19位卡号的违规水印' },
      tamperCheck: { status: 'PASS', text: '卡号凸字与银行LOGO无数字修改或修图痕迹' }
    },
    {
      id: 'doc-card-back',
      title: '结算银行卡反面',
      type: '签名栏与磁条面',
      copyCheck: { status: 'PASS', text: '持卡人手写签名栏无二次涂改与遮掩' },
      watermarkCheck: { status: 'PASS', text: '无遮盖安全码的恶意水印' },
      tamperCheck: { status: 'PASS', text: 'CVN2及客服电话区域无数字替换痕迹' }
    }
  ];

  return (
    <div id="sec-kyc" className="space-y-6 pt-4">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              KYC 基础资质与证照鉴真 (KYC Verification Matrix)
            </h2>
            <p className="text-xs text-slate-500">
              营业执照版式时效、工商底账穿透、法人身份合规、结算主体一致性及图像防伪
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">板块状态:</span>
          {status === 'PASS' ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              资质全量通过 (PASS)
            </span>
          ) : status === 'WARNING' ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              存在关注项 (WARNING)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              强规拦截 (FAIL)
            </span>
          )}
        </div>
      </div>

      {/* Merchant Business Profile Meta Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-slate-600" />
          <span>商户企业主体备案全景资料</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400">统一社会信用代码:</span>
            <div className="font-mono font-bold text-slate-800 text-sm">
              {merchantInfo.unified_credit_code}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400">企业法定名称:</span>
            <div className="font-semibold text-slate-800 text-sm">
              {merchantInfo.merchant_name}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400">法定代表人:</span>
            <div className="font-semibold text-slate-800 text-sm">
              {merchantInfo.legal_person}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400">商户主体类型:</span>
            <div className="font-medium text-slate-800">
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                {merchantInfo.business_type === 'ENTERPRISE' ? '企业法人 (ENTERPRISE)' : '个体工商户 (INDIVIDUAL)'}
              </span>
            </div>
          </div>

          {merchantInfo.registered_capital && (
            <div className="space-y-1">
              <span className="text-slate-400">注册资本:</span>
              <div className="font-medium text-slate-800">{merchantInfo.registered_capital}</div>
            </div>
          )}
          {merchantInfo.operating_period && (
            <div className="space-y-1">
              <span className="text-slate-400">营业期限:</span>
              <div className="font-medium text-slate-800">{merchantInfo.operating_period}</div>
            </div>
          )}
          {merchantInfo.registered_address && (
            <div className="space-y-1 sm:col-span-2">
              <span className="text-slate-400">登记住所 / 经营场所:</span>
              <div className="font-medium text-slate-800">{merchantInfo.registered_address}</div>
            </div>
          )}

          {merchantInfo.settlement_account && (
            <div className="space-y-1 sm:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                绑定结算银行账户:
              </span>
              <div className="font-mono text-slate-800 font-semibold mt-0.5">
                {merchantInfo.settlement_account.account_name} · {merchantInfo.settlement_account.account_no}
                <span className="text-slate-500 font-normal ml-2">({merchantInfo.settlement_account.bank_name})</span>
              </div>
            </div>
          )}

          {merchantInfo.business_scope && (
            <div className="space-y-1 sm:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-500 font-medium">核定经营范围:</span>
              <div className="text-slate-700 leading-relaxed text-[11px] mt-0.5 line-clamp-3">
                {merchantInfo.business_scope}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rules Subsections */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>营业执照字段比对与版本时效核验 (KYC-LICENSE-01 ~ 11)</span>
        </div>
        <div className="space-y-3">
          {licenseRules.map((rule) => (
            <CompareCard key={rule.rule_code} rule={rule} />
          ))}
        </div>

        <div className="text-xs font-bold text-slate-700 flex items-center gap-2 pt-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>法定代表人身份与公安底账鉴权 (KYC-LEGAL-01 ~ 05)</span>
        </div>
        <div className="space-y-3">
          {legalRules.map((rule) => (
            <CompareCard key={rule.rule_code} rule={rule} />
          ))}
        </div>

        {settleRules.length > 0 && (
          <>
            <div className="text-xs font-bold text-slate-700 flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>结算账户主体一致性校验 (KYC-SETTLE-01)</span>
            </div>
            <div className="space-y-3">
              {settleRules.map((rule) => (
                <CompareCard key={rule.rule_code} rule={rule} />
              ))}
            </div>
          </>
        )}

        {imageRules.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>证照介质与视觉防伪鉴别 (KYC-IMAGE-01 ~ 03 / 多文档质检矩阵)</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => setShowMatrixView(false)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    !showMatrixView ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  规则卡片流
                </button>
                <button
                  type="button"
                  onClick={() => setShowMatrixView(true)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                    showMatrixView ? 'bg-white text-blue-700 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Layers className="w-3 h-3 text-blue-600" />
                  <span>5×3 文档质检矩阵</span>
                </button>
              </div>
            </div>

            {showMatrixView ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4 shadow-xs">
                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
                  {docInspectionList.map((doc, idx) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => setActiveDocTab(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        activeDocTab === idx
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                      }`}
                    >
                      {doc.title}
                    </button>
                  ))}
                </div>

                {/* Active Tab Content */}
                {(() => {
                  const curr = docInspectionList[activeDocTab];
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-slate-800">{curr.title}</span>
                          <span className="text-slate-400">|</span>
                          <span className="text-slate-600">{curr.type}</span>
                        </div>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                          3/3 质检项全通过
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">1. 复印件 / 翻拍检测</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{curr.copyCheck.text}</p>
                          <span className="text-[10px] text-emerald-600 font-medium">状态: 原件拍摄/扫描</span>
                        </div>

                        <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">2. 水印语义与合规性</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{curr.watermarkCheck.text}</p>
                          <span className="text-[10px] text-emerald-600 font-medium">状态: 白名单合规水印</span>
                        </div>

                        <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">3. PS篡改与拼接鉴别</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{curr.tamperCheck.text}</p>
                          <span className="text-[10px] text-emerald-600 font-medium">状态: 无图层拼装篡改</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="space-y-3">
                {imageRules.map((rule) => (
                  <CompareCard key={rule.rule_code} rule={rule} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
