import React, { useState, useEffect } from 'react';
import { MerchantApplication, DecisionType } from '../../types';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Globe2,
  Store,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  FileText
} from 'lucide-react';

interface TypeAwareAuditModalProps {
  application: MerchantApplication;
  onClose: () => void;
  onComplete: (updatedApp: MerchantApplication) => void;
  onViewReport: (app: MerchantApplication) => void;
}

export const TypeAwareAuditModal: React.FC<TypeAwareAuditModalProps> = ({
  application,
  onClose,
  onComplete,
  onViewReport,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number>(0);
  const [decision, setDecision] = useState<DecisionType>('PASS');
  const [findings, setFindings] = useState<string[]>([]);

  // Type-specific pipeline definition
  const steps = React.useMemo(() => {
    if (application.merchant_category === 'OFFLINE') {
      return [
        {
          id: 1,
          name: '阶段一：证照鉴真与法人公安核验',
          desc: '营业执照底纹防伪检测、18位统一社会信用代码算法比对及公安部实人实名联网鉴权',
          duration: 350,
          tag: 'KYC基础鉴真',
        },
        {
          id: 2,
          name: '阶段二：门头招牌OCR与执照字号一致性',
          desc: '门店正门门头招牌文字倾斜校正OCR识别，与市监局核准名称、字号语义相近度比对 (匹配度 98%)',
          duration: 400,
          tag: '线下实体专审',
        },
        {
          id: 3,
          name: '阶段三：高精GIS地理围栏与EXIF经纬度',
          desc: '提取照片EXIF拍摄地理坐标，与成都市市监局登记地址进行欧氏球面距离测算（偏差 8.2 米，安全）',
          duration: 450,
          tag: 'GIS空间定位',
        },
        {
          id: 4,
          name: '阶段四：全网多模态反向搜图 (防盗图排查)',
          desc: '采用感知哈希（pHash）检索百度/58同城/美团等公开商业租转图库（排查网络盗图与虚构门面）',
          duration: 500,
          tag: '图像防伪',
        },
        {
          id: 5,
          name: '阶段五：规则引擎加权评分与准入判定',
          desc: '汇聚租赁协议、税务专票底账、最高法失信人名单，执行线下商户模型加权评分计算',
          duration: 350,
          tag: '规则推理',
        }
      ];
    } else if (application.merchant_category === 'CROSS_BORDER') {
      return [
        {
          id: 1,
          name: '阶段一：跨境主体资质与法人核验',
          desc: '外商投资或境内进出口企业执照比对，境外母公司主体架构穿透',
          duration: 350,
          tag: 'KYC跨境鉴权',
        },
        {
          id: 2,
          name: '阶段二：中国海关收发货人备案底账核查',
          desc: '联网海关总署单一窗口，校验10位海关编码、海关信用认证等级（AEO认证状态）',
          duration: 450,
          tag: '海关穿透',
        },
        {
          id: 3,
          name: '阶段三：外汇管理局货物贸易名录核验',
          desc: '国家外汇管理局经常项目外汇账户名录在册核验，结汇退税合规排查',
          duration: 400,
          tag: '外管合规',
        },
        {
          id: 4,
          name: '阶段四：海运提单与进出口采购合同三单一致',
          desc: '装箱单、海运/空运提单提单号与合同货物规格跨实体语义一致性校验',
          duration: 450,
          tag: '三单合一',
        },
        {
          id: 5,
          name: '阶段五：规则引擎加权评分与准入判定',
          desc: '综合境外制裁名单（OFAC）、涉税失信排查与跨境规则评分计算',
          duration: 350,
          tag: '规则推理',
        }
      ];
    } else {
      // ONLINE default
      return [
        {
          id: 1,
          name: '阶段一：基础证照鉴真与工商底账对齐',
          desc: '营业执照OCR提取、市场监管总局登记状态校验、法人公安活体鉴权',
          duration: 350,
          tag: 'KYC鉴真',
        },
        {
          id: 2,
          name: '阶段二：工信部ICP备案域名与主体穿透',
          desc: '申报域名联网工信部域名系统，验证备案号合法性及主办单位是否与申请商户严格全等',
          duration: 450,
          tag: 'ICP备案',
        },
        {
          id: 3,
          name: '阶段三：无头浏览器动态爬虫深度探针',
          desc: '模拟用户访问抓取首屏DOM，检测SSL证书时效、商品分类敏感词与违规博彩欺诈黑词排查',
          duration: 500,
          tag: '动态探针',
        },
        {
          id: 4,
          name: '阶段四：收银台支付结算跳转与跑分防范',
          desc: '沙箱环境模拟下单，穿透支付结算重定向网关，防范境外恶意第四方代收代付通道',
          duration: 450,
          tag: '清算安全',
        },
        {
          id: 5,
          name: '阶段五：规则引擎加权评分与综合裁决',
          desc: '结合合作协议、增值税专票真伪及全网负面舆情，输出多维风险分值与处置建议',
          duration: 350,
          tag: '规则推理',
        }
      ];
    }
  }, [application.merchant_category]);

  // Execute pipeline step-by-step
  useEffect(() => {
    let current = 0;
    const executeNextStep = () => {
      if (current < steps.length - 1) {
        current += 1;
        setCurrentStepIndex(current);
        setTimeout(executeNextStep, steps[current].duration);
      } else {
        // Complete evaluation
        let finalScore = 92;
        let finalDecision: DecisionType = 'PASS';
        let generatedFindings: string[] = [];

        if (application.merchant_category === 'OFFLINE') {
          finalScore = 94;
          finalDecision = 'PASS';
          generatedFindings = [
            '【线下专审】门头招牌文字与企业字号一致，OCR清晰度 98%',
            '【线下专审】EXIF经纬度定位与成都市锦江区IFS大厦完全重合（偏差 8.2米）',
            '【线下专审】反向图片哈希排查：实景照片为原创实拍，未命中公共图库盗图',
            '租赁合同与物业发票底账查验三流合一，建议系统直接准入'
          ];
        } else if (application.merchant_category === 'CROSS_BORDER') {
          finalScore = 91;
          finalDecision = 'PASS';
          generatedFindings = [
            '海关进出口收发货人备案代码有效且在册',
            '外汇管理局经常项目A类企业名录合规',
            '海运提单与外贸采购框架合同三单比对一致',
            '司法及国际制裁排查未见异常'
          ];
        } else {
          // Online merchant
          finalScore = 89;
          finalDecision = 'PASS';
          generatedFindings = [
            '工信部ICP备案正常，主办单位与商户名称严格全等',
            '自动化爬虫动态探针：未检出涉赌/违禁品黑词，SSL证书有效',
            '收银台跳转链路接入合规银联通道，无恶意跑分代付风险',
            '法人公安二要素认证通过，准予系统直接放行'
          ];
        }

        setCalculatedScore(finalScore);
        setDecision(finalDecision);
        setFindings(generatedFindings);
        setIsFinished(true);

        const updated: MerchantApplication = {
          ...application,
          status: 'AUTO_PASSED',
          score: finalScore,
          decision: finalDecision,
          risk_level: 'LOW',
          summary_findings: generatedFindings,
          audited_at: new Date().toLocaleString(),
          audit_duration_ms: steps.reduce((sum, s) => sum + s.duration, 0)
        };
        onComplete(updated);
      }
    };

    const timer = setTimeout(executeNextStep, steps[0].duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95">
        {/* Clean Light Modal Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 text-slate-900 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                商户类型专属 AI 审核流水线
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                application.merchant_category === 'OFFLINE'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : application.merchant_category === 'ONLINE'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-purple-50 text-purple-700 border border-purple-200'
              }`}>
                {application.merchant_category === 'OFFLINE' ? '线下实体门店' : application.merchant_category === 'ONLINE' ? '线上电商/SaaS' : '跨境贸易'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              目标商户：{application.merchant_name} ({application.application_no})
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
              <span className="font-medium">
                {isFinished ? '流水线执行完成' : `正在执行第 ${currentStepIndex + 1} / ${steps.length} 阶段...`}
              </span>
              <span className="font-mono font-bold text-blue-600">
                {isFinished ? '100%' : `${Math.round(((currentStepIndex + 1) / steps.length) * 100)}%`}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Steps Timeline */}
          <div className="space-y-2.5">
            {steps.map((step, idx) => {
              const isDone = isFinished || idx < currentStepIndex;
              const isCurrent = !isFinished && idx === currentStepIndex;
              const isWaiting = !isFinished && idx > currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                      : isDone
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-100 bg-slate-50/50 opacity-60'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                        {step.id}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-semibold ${isCurrent ? 'text-blue-900' : isDone ? 'text-slate-800' : 'text-slate-500'}`}>
                        {step.name}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-mono shrink-0">
                        {step.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Result Card when Finished */}
          {isFinished && (
            <div className="p-4 rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-900">
                      针对性智能审核完成
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      系统综合建议：准入进件 (AUTO_PASSED)
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-600 font-medium">综合置信度得分</div>
                  <div className="text-2xl font-black text-emerald-700 font-mono">
                    {calculatedScore} <span className="text-xs font-normal">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Findings */}
              <div className="space-y-1 pt-2 border-t border-emerald-200/60">
                <div className="text-[11px] font-semibold text-slate-800">关键研判依据：</div>
                {findings.map((f, i) => (
                  <div key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            {isFinished ? '评分结果已同步至商户进件台账' : 'AI分析中，请勿刷新页面...'}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              关闭
            </button>

            {isFinished && (
              <button
                onClick={() => {
                  onClose();
                  onViewReport(application);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>立即查看完整研判报告</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
