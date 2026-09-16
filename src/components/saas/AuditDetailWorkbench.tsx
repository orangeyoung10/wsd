import React, { useState } from 'react';
import {
  AuditReport,
  ManualReviewState,
  MerchantApplication,
} from '../../types';
import { OverallEvaluationCard } from '../OverallEvaluationCard';
import { KYCSection } from '../KYCSection';
import { AgreementsSection } from '../AgreementsSection';
import { InvoicesSection } from '../InvoicesSection';
import { VenuesSection } from '../VenuesSection';
import { SceneProbeSection } from '../SceneProbeSection';
import { ReputationSection } from '../ReputationSection';
import { StickyAnchorBar, AuditSectionTabId, ViewMode } from '../StickyAnchorBar';
import { WorkflowOrchestratorView } from '../WorkflowOrchestratorView';
import { maskCompanyName } from '../../utils/maskUtils';
import {
  ArrowLeft,
  Globe2,
  Store,
  Sparkles,
  Zap,
  FileDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Building
} from 'lucide-react';

interface AuditDetailWorkbenchProps {
  activeReport: AuditReport;
  availableReports: AuditReport[];
  applications: MerchantApplication[];
  onSelectApplicationById: (appId: string) => void;
  onBackToInbox: () => void;
  onTriggerAudit: (app: MerchantApplication) => void;
  onUpdateManualReview: (review: ManualReviewState) => void;
  onOpenAIReasoning: () => void;
  onOpenJSONModal: () => void;
  onDispatchWorkOrder?: (merchantName: string, reason: string) => void;
}

const ALL_TABS: { id: AuditSectionTabId; label: string; desc: string }[] = [
  { id: 'sec-overview', label: '总体研判与决策', desc: '执行流水线与综合风控放行/阻断判定' },
  { id: 'sec-kyc', label: '基础资质KYC', desc: '工商执照、法人身份证与对公结算账户核验' },
  { id: 'sec-agreements', label: '商业合同KYB', desc: '贸易供销合同、电子印章与履约条款审查' },
  { id: 'sec-invoices', label: '发票税务合规', desc: '国税增值税发票联网验真与三流合一对账' },
  { id: 'sec-venues', label: '线下场地与GIS', desc: '实体门头牌匾、EXIF/GPS拍摄地与实景排查' },
  { id: 'sec-scene', label: '线上场景与网络探针', desc: '工信部ICP备案主办单位与动态违规词探针' },
  { id: 'sec-reputation', label: '司法舆情底线', desc: '最高法失信被执行人、涉诉裁决与反洗钱负面' },
];

export const AuditDetailWorkbench: React.FC<AuditDetailWorkbenchProps> = ({
  activeReport,
  availableReports,
  applications,
  onSelectApplicationById,
  onBackToInbox,
  onTriggerAudit,
  onUpdateManualReview,
  onOpenAIReasoning,
  onOpenJSONModal,
  onDispatchWorkOrder,
}) => {
  const [activeTab, setActiveTab] = useState<AuditSectionTabId>('sec-overview');
  const [viewMode, setViewMode] = useState<ViewMode>('CARD');

  // Find matching application metadata
  const matchingApp = applications.find(
    (a) =>
      a.merchant_name === activeReport.merchant_info.merchant_name ||
      a.application_no === activeReport.report_meta.application_no
  ) || {
    id: activeReport.report_meta.report_id,
    application_no: activeReport.report_meta.application_no,
    merchant_name: activeReport.merchant_info.merchant_name,
    merchant_category: activeReport.merchant_info.business_type === 'OFFLINE_STORE' ? 'OFFLINE' : 'ONLINE',
    business_type: activeReport.merchant_info.business_type,
    unified_credit_code: activeReport.merchant_info.unified_credit_code,
    legal_person: activeReport.merchant_info.legal_person,
    registered_capital: activeReport.merchant_info.registered_capital,
    registered_address: activeReport.merchant_info.registered_address,
    business_scope: activeReport.merchant_info.business_scope,
    submission_channel: '商户自提进件',
    submitted_at: activeReport.report_meta.generated_at,
    status: 'AUTO_PASSED',
    score: activeReport.overall_evaluation.final_score,
    decision: activeReport.overall_evaluation.decision,
    risk_level: activeReport.overall_evaluation.risk_level,
  };

  const isOffline = matchingApp.merchant_category === 'OFFLINE' || activeReport.merchant_info.business_type === 'OFFLINE_STORE';
  const isOnline = matchingApp.merchant_category === 'ONLINE';

  // Dynamic tab statuses
  const tabStatuses: Record<AuditSectionTabId, 'PASS' | 'WARNING' | 'FAIL' | 'EXEMPT'> = {
    'sec-overview':
      activeReport.overall_evaluation.final_decision === 'PASS'
        ? 'PASS'
        : activeReport.overall_evaluation.final_decision === 'FAIL'
        ? 'FAIL'
        : 'WARNING',
    'sec-kyc': activeReport.audit_sections.kyc.status || 'PASS',
    'sec-agreements': activeReport.audit_sections.kyb.agreements.some((a) =>
      a.audit_rules.some((r) => r.result === 'FAIL')
    )
      ? 'FAIL'
      : activeReport.audit_sections.kyb.agreements.some((a) =>
          a.audit_rules.some((r) => r.result === 'WARNING')
        )
      ? 'WARNING'
      : 'PASS',
    'sec-invoices': activeReport.audit_sections.kyb.invoices.some((i) =>
      i.audit_rules.some((r) => r.result === 'FAIL')
    )
      ? 'FAIL'
      : activeReport.audit_sections.kyb.invoices.some((i) =>
          i.audit_rules.some((r) => r.result === 'WARNING')
        )
      ? 'WARNING'
      : 'PASS',
    'sec-venues':
      isOnline && activeReport.audit_sections.kyb.venues.length === 0
        ? 'EXEMPT'
        : activeReport.audit_sections.kyb.venues.some((v) => v.result === 'FAIL')
        ? 'FAIL'
        : activeReport.audit_sections.kyb.venues.some((v) => v.result === 'WARNING')
        ? 'WARNING'
        : 'PASS',
    'sec-scene':
      isOffline && activeReport.audit_sections.kyb.scene_probe.length === 0
        ? 'EXEMPT'
        : activeReport.audit_sections.kyb.scene_probe.some((s) => s.result === 'FAIL')
        ? 'FAIL'
        : activeReport.audit_sections.kyb.scene_probe.some((s) => s.result === 'WARNING')
        ? 'WARNING'
        : 'PASS',
    'sec-reputation': activeReport.audit_sections.kyb.reputation.some((r) => r.result === 'FAIL')
      ? 'FAIL'
      : activeReport.audit_sections.kyb.reputation.some((r) => r.result === 'WARNING')
      ? 'WARNING'
      : 'PASS',
  };

  const currentIndex = ALL_TABS.findIndex((t) => t.id === activeTab);
  const currentTabInfo = ALL_TABS[currentIndex] || ALL_TABS[0];
  const prevTab = currentIndex > 0 ? ALL_TABS[currentIndex - 1] : null;
  const nextTab = currentIndex < ALL_TABS.length - 1 ? ALL_TABS[currentIndex + 1] : null;

  return (
    <div className="space-y-5">
      {/* Top Header Breadcrumb & Switcher Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToInbox}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-blue-600 border border-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回商户进件中心</span>
          </button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Merchant Case Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">切换商户:</span>
            <select
              value={activeReport.merchant_info.merchant_name}
              onChange={(e) => {
                const targetApp = applications.find((a) => a.merchant_name === e.target.value);
                if (targetApp) {
                  onSelectApplicationById(targetApp.id);
                }
              }}
              className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer max-w-[240px] truncate"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.merchant_name}>
                  {maskCompanyName(app.merchant_name)} ({app.merchant_category === 'OFFLINE' ? '线下' : '线上'})
                </option>
              ))}
            </select>
          </div>

          {/* Category Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
              isOffline
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {isOffline ? <Store className="w-3.5 h-3.5 text-amber-600" /> : <Globe2 className="w-3.5 h-3.5 text-slate-600" />}
            <span>{isOffline ? '线下实体审核' : '线上电商审核'}</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => onTriggerAudit(matchingApp as MerchantApplication)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>重新分析</span>
          </button>

          <button
            onClick={onOpenAIReasoning}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            <span>推理溯源</span>
          </button>

          <button
            onClick={onOpenJSONModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
            title="导出结构化证据包"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>导出JSON</span>
          </button>
        </div>
      </div>

      {/* Adaptive Category Guidance Banner */}
      <div
        className={`p-3.5 rounded-xl border flex items-start gap-3 shadow-2xs ${
          isOffline
            ? 'bg-amber-50/60 border-amber-200/80 text-amber-950'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}
      >
        <div className="p-1.5 rounded-lg bg-white shadow-2xs shrink-0 border border-slate-200">
          {isOffline ? (
            <Store className="w-4 h-4 text-amber-600" />
          ) : (
            <Globe2 className="w-4 h-4 text-slate-600" />
          )}
        </div>
        <div className="flex-1 min-w-0 text-xs">
          <div className="font-semibold text-xs mb-0.5 text-slate-900">
            {isOffline
              ? '当前启用【线下餐饮与实体门店风控流水线】'
              : '当前启用【线上互联网商城与SaaS平台风控流水线】'}
          </div>
          <p className="text-slate-500 leading-relaxed text-[11px]">
            {isOffline
              ? '实体商户重点核验：门头招牌与执照字号一致性、实际经营地址与市监登记核对、防伪与盗图筛查（网络域名探针自动豁免）。'
              : '线上商户重点核验：工信部ICP备案主办单位核验、网站动态违规词探针、收银台支付通道安全分析（线下门头经纬度自动豁免）。'}
          </p>
        </div>
      </div>

      {/* Card Switcher Tab Bar */}
      <StickyAnchorBar
        activeTab={activeTab}
        onSelectTab={(id) => setActiveTab(id)}
        viewMode={viewMode}
        onToggleViewMode={(mode) => setViewMode(mode)}
        isOnlineType={isOnline}
        tabStatuses={tabStatuses}
      />

      {/* Mode 1: CARD MODE (Switch between discrete cards) */}
      {viewMode === 'CARD' ? (
        <div className="space-y-4">
          {activeTab === 'sec-overview' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <WorkflowOrchestratorView
                currentDecision={activeReport.overall_evaluation.final_decision}
                confidenceScore={activeReport.overall_evaluation.confidence_score}
                totalExecutionMs={activeReport.report_meta.execution_time_ms || 2150}
                onRunSimulation={() => onTriggerAudit(matchingApp as MerchantApplication)}
                isRunning={false}
              />

              <div id="sec-overview">
                <OverallEvaluationCard
                  evaluation={activeReport.overall_evaluation}
                  recommendation={activeReport.recommendation}
                  merchantName={activeReport.merchant_info.merchant_name}
                  reportId={activeReport.report_meta.report_id}
                  manualReview={activeReport.manual_review}
                  onUpdateManualReview={onUpdateManualReview}
                  onTriggerAIReasoning={onOpenAIReasoning}
                />
              </div>
            </div>
          )}

          {activeTab === 'sec-kyc' && (
            <div id="sec-kyc" className="animate-in fade-in-50 duration-200">
              <KYCSection
                merchantInfo={activeReport.merchant_info}
                rules={activeReport.audit_sections.kyc.rules}
                status={activeReport.audit_sections.kyc.status}
              />
            </div>
          )}

          {activeTab === 'sec-agreements' && (
            <div id="sec-agreements" className="animate-in fade-in-50 duration-200">
              <AgreementsSection
                agreements={activeReport.audit_sections.kyb.agreements}
                onTriggerAIReasoning={onOpenAIReasoning}
              />
            </div>
          )}

          {activeTab === 'sec-invoices' && (
            <div id="sec-invoices" className="animate-in fade-in-50 duration-200">
              <InvoicesSection invoices={activeReport.audit_sections.kyb.invoices} />
            </div>
          )}

          {activeTab === 'sec-venues' && (
            <div id="sec-venues" className="animate-in fade-in-50 duration-200">
              {isOnline && activeReport.audit_sections.kyb.venues.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-2xs space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">线下实体场地核验已自动豁免</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    该商户申报类别为【线上互联网商城与SaaS】，其业务主营在线上开展。系统已自动对其适用线上免测规则，豁免线下实体门头拍摄核验，转为重点探针线上支付收银台与ICP备案。
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('sec-scene')}
                      className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      前往查看「线上场景与网络探针」 &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <VenuesSection venues={activeReport.audit_sections.kyb.venues} />
              )}
            </div>
          )}

          {activeTab === 'sec-scene' && (
            <div id="sec-scene" className="animate-in fade-in-50 duration-200">
              {isOffline && activeReport.audit_sections.kyb.scene_probe.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-2xs space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
                    <Globe2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">线上网络探针核验已自动豁免</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    该商户申报类别为【线下实体门店/餐饮】，无需提供自营互联网商城域名。系统已自动豁免工信部ICP网站探针，重点核验线下门头招牌与地理围栏。
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('sec-venues')}
                      className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      前往查看「线下场地与GIS」 &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <SceneProbeSection scenes={activeReport.audit_sections.kyb.scene_probe} />
              )}
            </div>
          )}

          {activeTab === 'sec-reputation' && (
            <div id="sec-reputation" className="animate-in fade-in-50 duration-200">
              <ReputationSection reputationRules={activeReport.audit_sections.kyb.reputation} />
            </div>
          )}

          {/* Stepper Card Footer */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              {prevTab ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(prevTab.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-500" />
                  <span>上一步：{prevTab.label}</span>
                </button>
              ) : (
                <span className="text-xs text-slate-400">第一项：{currentTabInfo.label}</span>
              )}
            </div>

            {/* Stepper progress dots */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700 hidden sm:inline">
                核验项 {currentIndex + 1} / {ALL_TABS.length}
              </span>
              <div className="flex items-center gap-1">
                {ALL_TABS.map((t, idx) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(t.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      t.id === activeTab
                        ? 'w-6 bg-slate-900'
                        : idx < currentIndex
                        ? 'w-2 bg-emerald-500'
                        : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    title={t.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {nextTab ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(nextTab.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-colors cursor-pointer"
                >
                  <span>下一步：{nextTab.label}</span>
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('sec-overview');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>核验完毕 · 返回总体研判</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: FLAT MODE (All sections stacked) */
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <WorkflowOrchestratorView
            currentDecision={activeReport.overall_evaluation.final_decision}
            confidenceScore={activeReport.overall_evaluation.confidence_score}
            totalExecutionMs={activeReport.report_meta.execution_time_ms || 2150}
            onRunSimulation={() => onTriggerAudit(matchingApp as MerchantApplication)}
            isRunning={false}
          />

          <div id="sec-overview">
            <OverallEvaluationCard
              evaluation={activeReport.overall_evaluation}
              recommendation={activeReport.recommendation}
              merchantName={activeReport.merchant_info.merchant_name}
              reportId={activeReport.report_meta.report_id}
              manualReview={activeReport.manual_review}
              onUpdateManualReview={onUpdateManualReview}
              onTriggerAIReasoning={onOpenAIReasoning}
            />
          </div>

          <div id="sec-kyc">
            <KYCSection
              merchantInfo={activeReport.merchant_info}
              rules={activeReport.audit_sections.kyc.rules}
              status={activeReport.audit_sections.kyc.status}
            />
          </div>

          <div id="sec-agreements">
            <AgreementsSection
              agreements={activeReport.audit_sections.kyb.agreements}
              onTriggerAIReasoning={onOpenAIReasoning}
            />
          </div>

          <div id="sec-invoices">
            <InvoicesSection invoices={activeReport.audit_sections.kyb.invoices} />
          </div>

          <div id="sec-venues">
            <VenuesSection venues={activeReport.audit_sections.kyb.venues} />
          </div>

          <div id="sec-scene">
            <SceneProbeSection scenes={activeReport.audit_sections.kyb.scene_probe} />
          </div>

          <div id="sec-reputation">
            <ReputationSection reputationRules={activeReport.audit_sections.kyb.reputation} />
          </div>
        </div>
      )}
    </div>
  );
};

