import React, { useState } from 'react';
import { OverallEvaluation, Recommendation, ManualReviewRecord } from '../types';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Building,
  FileCheck2,
  FileSpreadsheet,
  HelpCircle,
  Clock,
  Sparkles,
  Send,
  MessageSquare
} from 'lucide-react';

interface OverallEvaluationCardProps {
  evaluation: OverallEvaluation;
  recommendation: Recommendation;
  merchantName: string;
  reportId: string;
  manualReview?: ManualReviewRecord;
  onUpdateManualReview?: (review: ManualReviewRecord) => void;
  onTriggerAIReasoning?: () => void;
}

export const OverallEvaluationCard: React.FC<OverallEvaluationCardProps> = ({
  evaluation,
  recommendation,
  merchantName,
  reportId,
  manualReview,
  onUpdateManualReview,
  onTriggerAIReasoning,
}) => {
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [reviewerName, setReviewerName] = useState('高级风控合规审核员');
  const [reviewDecision, setReviewDecision] = useState<'APPROVED' | 'REJECTED' | 'SUPPLEMENTARY'>('APPROVED');
  const [reviewNotes, setReviewNotes] = useState('');
  const [submittedReview, setSubmittedReview] = useState<ManualReviewRecord | undefined>(manualReview);

  const isPass = evaluation.final_decision === 'PASS';
  const isWarning = evaluation.final_decision === 'MANUAL_REVIEW';
  const isFail = evaluation.final_decision === 'FAIL';

  const getDecisionBadge = () => {
    if (submittedReview) {
      if (submittedReview.decision === 'APPROVED') {
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-xs shadow-2xs">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>人工复核放行 (MANUAL_APPROVED)</span>
          </div>
        );
      } else if (submittedReview.decision === 'REJECTED') {
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-xs shadow-2xs">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>人工复核驳回 (MANUAL_REJECTED)</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-xs shadow-2xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>待商户补件 (SUPPLEMENTARY)</span>
          </div>
        );
      }
    }

    if (isPass) {
      return (
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-xs shadow-2xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>准入通过 (PASS)</span>
        </div>
      );
    }
    if (isWarning) {
      return (
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-xs shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>待人工复核 (MANUAL_REVIEW)</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-xs shadow-2xs">
        <XCircle className="w-4 h-4 text-rose-600" />
        <span>直接拦截 / 拒绝 (REJECT / FAIL)</span>
      </div>
    );
  };

  const getSubStatusBadge = (status: 'PASS' | 'WARNING' | 'FAIL') => {
    if (status === 'PASS') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          合规正常
        </span>
      );
    }
    if (status === 'WARNING') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          存在存疑
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
        <XCircle className="w-3 h-3 text-rose-600" />
        高危不合规
      </span>
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const record: ManualReviewRecord = {
      reviewer_id: 'REV-99201',
      reviewer_name: reviewerName || '合规审核专员',
      reviewed_at: new Date().toLocaleString(),
      decision: reviewDecision,
      comments: reviewNotes || (reviewDecision === 'APPROVED' ? '经人工核实市监登记网及原厂授权协议，要素无实质冲突，同意准入。' : '核实存在严重虚假风险，予以驳回。'),
    };
    setSubmittedReview(record);
    setShowReviewPanel(false);
    if (onUpdateManualReview) {
      onUpdateManualReview(record);
    }
  };

  return (
    <div
      id="sec-overview"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300"
    >
      {/* Clean Light Header with Merchant Name & Final Decision */}
      <div className="p-5 bg-white border-b border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            <span className="font-medium text-slate-700">商户综合审核决策看板</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-slate-500">报告编号: {reportId}</span>
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60">
              <Building className="w-5 h-5" />
            </div>
            <span>{merchantName}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {getDecisionBadge()}
          {onTriggerAIReasoning && (
            <button
              onClick={onTriggerAIReasoning}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="调用大模型引擎对合同与经营范围执行深度语义一致性推理"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI 语义深度研判</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row: Confidence Score & Sub-scores */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-slate-100 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-white">
        {/* Confidence Score Dial */}
        <div className="p-5 flex items-center justify-between md:justify-center gap-4">
          <div>
            <div className="text-xs text-slate-500 font-medium">模型置信度得分</div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">100 分制量化</div>
          </div>
          <div className="relative flex items-center justify-center">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl border-2 ${
                evaluation.confidence_score >= 85
                  ? 'border-emerald-500 text-emerald-700 bg-emerald-50/60'
                  : evaluation.confidence_score >= 60
                  ? 'border-amber-500 text-amber-700 bg-amber-50/60'
                  : 'border-rose-500 text-rose-700 bg-rose-50/60'
              }`}
            >
              {evaluation.confidence_score}
            </div>
          </div>
        </div>

        {/* Sub Score 1: KYC */}
        <div className="p-5 space-y-1.5">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>KYC 基础身份与证照</span>
            {getSubStatusBadge(evaluation.sub_scores.kyc_status)}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            涵盖营业执照防伪、工商底账穿透、法人身份核验与对公结算主体。
          </p>
        </div>

        {/* Sub Score 2: KYB */}
        <div className="p-5 space-y-1.5">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>KYB 业务背景与场景</span>
            {getSubStatusBadge(evaluation.sub_scores.kyb_status)}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            涵盖合作供销协议、发票税局三流合一、场地EXIF/GPS及网络探针。
          </p>
        </div>

        {/* Sub Score 3: Risk / Reputation */}
        <div className="p-5 space-y-1.5">
          <div className="text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>司法失信与舆情底线</span>
            {getSubStatusBadge(evaluation.sub_scores.risk_status)}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            最高法失信人一票否决、重大税收违法、历史涉诉裁判及反诈舆情。
          </p>
        </div>
      </div>

      {/* Main Conclusion Statement */}
      <div className="p-6 space-y-5">
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex items-start gap-3 shadow-2xs">
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-blue-600 mt-0.5 shrink-0 shadow-2xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-semibold text-slate-900">【MAAP 综合定损与审核结论】</div>
            <div className="text-slate-600 leading-relaxed">{evaluation.conclusion}</div>
          </div>
        </div>

        {/* Focus Issues & Mitigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Focus Issues */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                关键关注与拦截风险清单 (Focus Issues)
              </span>
              <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                {recommendation.focus_issues.length} 项
              </span>
            </div>

            {recommendation.focus_issues.length === 0 ? (
              <div className="text-xs text-emerald-700 bg-emerald-50/60 p-3 rounded-lg border border-emerald-100 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>各项合规规则全量通过，未触发任何风险拦截或中度关注项。</span>
              </div>
            ) : (
              <div className="space-y-2">
                {recommendation.focus_issues.map((issue, idx) => {
                  const isIntercept = issue.includes('【拦截】');
                  return (
                    <div
                      key={idx}
                      className={`text-xs p-2.5 rounded-lg border leading-relaxed ${
                        isIntercept
                          ? 'bg-rose-50/60 text-rose-800 border-rose-200/80 font-medium'
                          : 'bg-amber-50/50 text-amber-900 border-amber-200/80'
                      }`}
                    >
                      {issue}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mitigation Conditions */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                准入核准处置与风险缓释条件
              </span>
              <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                {recommendation.mitigation_conditions.length} 条
              </span>
            </div>

            <div className="space-y-2">
              {recommendation.mitigation_conditions.map((cond, idx) => (
                <div
                  key={idx}
                  className="text-xs p-2.5 rounded-lg bg-slate-50/60 border border-slate-200 text-slate-700 flex items-start gap-2"
                >
                  <span className="font-semibold text-blue-600 font-mono mt-0.5">{idx + 1}.</span>
                  <span>{cond}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Manual Review History or Action Trigger */}
        {submittedReview ? (
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-emerald-900">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                人工审核复核已完成 ({submittedReview.decision})
              </span>
              <span className="text-slate-500 font-normal">复核时间: {submittedReview.reviewed_at}</span>
            </div>
            <div className="text-slate-700 bg-white p-2.5 rounded-lg border border-emerald-100">
              <span className="font-semibold text-slate-900 mr-2">复核员: {submittedReview.reviewer_name}</span>
              <span>意见: {submittedReview.comments}</span>
            </div>
          </div>
        ) : isWarning ? (
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-xs text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                该商户当前处于“待人工复核”状态
              </div>
              <div className="text-[11px] text-amber-800">
                需要具备审批权限的风控审核员核验差异项并录入复核定损结论。
              </div>
            </div>
            <button
              onClick={() => setShowReviewPanel(!showReviewPanel)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-2xs cursor-pointer whitespace-nowrap transition-colors"
            >
              {showReviewPanel ? '收起复核面板' : '进入人工复核工作台'}
            </button>
          </div>
        ) : null}

        {/* Interactive Manual Review Panel Form */}
        {showReviewPanel && (
          <form
            onSubmit={handleSubmitReview}
            className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 shadow-2xs"
          >
            <div className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              人工审核复核工作台 (Manual Review Desk)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">审核员姓名 / 工号</label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-blue-500 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">终审复核裁决结论</label>
                <select
                  value={reviewDecision}
                  onChange={(e) => setReviewDecision(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-blue-500 text-slate-800 font-medium"
                >
                  <option value="APPROVED">核准放行 (APPROVED) - 要素确权无风险</option>
                  <option value="SUPPLEMENTARY">要求补充材料 (SUPPLEMENTARY) - 待补件</option>
                  <option value="REJECTED">终审驳回 (REJECTED) - 违规不予准入</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-700 mb-1">复核意见与风险定损备注</label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="例如：经核验市监局官方底账，营业期限确为长期，折痕识别缺失属OCR偶发盲区；合同原厂协议已取得盖章件，同意放行准入..."
                rows={3}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-blue-500 text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewPanel(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>提交审核定损并归档</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
