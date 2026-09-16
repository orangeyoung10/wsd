import React, { useState, useEffect } from 'react';
import {
  SaaSNavigationTab,
  MerchantApplication,
  RuleConfigItem,
  GlobalThresholds,
  AuditLogEntry,
  DecisionType,
  ManualReviewRecord,
  MerchantAuditReport
} from './types';
import {
  INITIAL_APPLICATIONS,
  INITIAL_RULES_CONFIG,
  INITIAL_THRESHOLDS,
  INITIAL_AUDIT_LOGS
} from './data/applicationsData';
import { SAMPLE_CASES } from './data/sampleCases';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { SaaSLayout } from './components/layout/SaaSLayout';
import { DashboardView } from './components/saas/DashboardView';
import { ApplicationsInboxView } from './components/saas/ApplicationsInboxView';
import { AuditDetailWorkbench } from './components/saas/AuditDetailWorkbench';
import { RuleSettingsView } from './components/saas/RuleSettingsView';
import { AuditLogsView } from './components/saas/AuditLogsView';
import { BlacklistView } from './components/saas/BlacklistView';
import { TypeAwareAuditModal } from './components/saas/TypeAwareAuditModal';
import { NewApplicationModal } from './components/saas/NewApplicationModal';
import { AIReasoningModal } from './components/AIReasoningModal';
import { JSONReportModal } from './components/JSONReportModal';
import { NetworkCockpitView } from './components/card-scheme/NetworkCockpitView';
import { AcquirerGovernanceView } from './components/card-scheme/AcquirerGovernanceView';
import { CrossAcquirerCollisionView } from './components/card-scheme/CrossAcquirerCollisionView';
import { MccComplianceView } from './components/card-scheme/MccComplianceView';
import { SupervisionEnforcementView } from './components/card-scheme/SupervisionEnforcementView';

function MainAppContent() {
  const { isAuthenticated, currentUser } = useAuth();

  // Navigation
  const [currentTab, setCurrentTab] = useState<SaaSNavigationTab>('DASHBOARD');

  // Business Data
  const [selectedAcquirerFilter, setSelectedAcquirerFilter] = useState<string>('ALL');
  const [applications, setApplications] = useState<MerchantApplication[]>(INITIAL_APPLICATIONS);
  const [rules, setRules] = useState<RuleConfigItem[]>(INITIAL_RULES_CONFIG);
  const [thresholds, setThresholds] = useState<GlobalThresholds>(INITIAL_THRESHOLDS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Detailed Reports (SAMPLE_CASES)
  const [cases, setCases] = useState<MerchantAuditReport[]>(SAMPLE_CASES);
  const [activeReport, setActiveReport] = useState<MerchantAuditReport>(SAMPLE_CASES[0]);

  // Modals
  const [auditTargetApp, setAuditTargetApp] = useState<MerchantApplication | null>(null);
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [showAIReasoning, setShowAIReasoning] = useState(false);
  const [showJSONReport, setShowJSONReport] = useState(false);

  // Pending count for sidebar and top badges
  const pendingCount = applications.filter((a) => a.status === 'PENDING_AUDIT').length;

  // Selected merchant name for top nav indicator
  const selectedMerchantName = activeReport.merchant_info.merchant_name;

  // Sync with backend API if running
  useEffect(() => {
    fetch('/api/cases')
      .then((res) => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCases(data);
        }
      })
      .catch(() => {
        // Fallback to local state seamlessly
      });
  }, []);

  // Handle selecting an application to view full report
  const handleSelectApplication = (app: MerchantApplication) => {
    // Find matching report or adapt standard report
    const foundReport = cases.find(
      (c) =>
        c.merchant_info.merchant_name === app.merchant_name ||
        c.report_meta.application_no === app.application_no
    );

    if (foundReport) {
      setActiveReport(foundReport);
    } else {
      const baseReport = cases[0];
      const customReport: MerchantAuditReport = {
        ...baseReport,
        report_meta: {
          ...baseReport.report_meta,
          report_id: `REP-${app.id}`,
          application_no: app.application_no,
          generated_at: new Date().toLocaleString(),
        },
        merchant_info: {
          ...baseReport.merchant_info,
          merchant_name: app.merchant_name,
          unified_credit_code: app.unified_credit_code,
          legal_person: app.legal_person,
          registered_capital: app.registered_capital,
          registered_address: app.registered_address,
          business_scope: app.business_scope,
          business_type: app.merchant_category === 'OFFLINE' ? 'OFFLINE_STORE' : 'ONLINE_ECOMMERCE',
        },
        overall_evaluation: {
          ...baseReport.overall_evaluation,
          final_score: app.score || 92,
          confidence_score: (app.score || 92) / 100,
          final_decision: app.decision || 'PASS',
          risk_level: app.risk_level || 'LOW',
        },
      };
      setActiveReport(customReport);
    }

    setCurrentTab('AUDIT_DETAIL');
  };

  // Handle selecting an application by ID from the workbench dropdown
  const handleSelectApplicationById = (appId: string) => {
    const target = applications.find((a) => a.id === appId);
    if (target) {
      handleSelectApplication(target);
    }
  };

  // Trigger type-aware AI audit modal
  const handleTriggerAudit = (app: MerchantApplication) => {
    setAuditTargetApp(app);
  };

  // Complete audit flow
  const handleCompleteAudit = (updatedApp: MerchantApplication) => {
    // 1. Update applications list
    setApplications((prev) =>
      prev.map((a) => (a.id === updatedApp.id ? updatedApp : a))
    );

    // 2. Append to audit logs
    const operatorName = currentUser ? `${currentUser.name} (${currentUser.role_name})` : 'MAAP 智能审核引擎';
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      application_no: updatedApp.application_no,
      merchant_name: updatedApp.merchant_name,
      operator: operatorName,
      action_type: 'AI_AUDIT',
      details: `多维流水线完成【${
        updatedApp.merchant_category === 'OFFLINE' ? '线下实体门店' : '线上电商平台'
      }】针对性机审，评分: ${updatedApp.score}分 (${updatedApp.decision})`,
      evidence_hash: `sha256:e8f9b${Math.floor(10000000 + Math.random() * 90000000)}...`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // 3. Update active report if currently viewing
    if (activeReport.merchant_info.merchant_name === updatedApp.merchant_name) {
      setActiveReport((prev) => ({
        ...prev,
        overall_evaluation: {
          ...prev.overall_evaluation,
          final_score: updatedApp.score || prev.overall_evaluation.final_score,
          confidence_score: (updatedApp.score || 92) / 100,
          final_decision: updatedApp.decision || prev.overall_evaluation.final_decision,
          risk_level: updatedApp.risk_level || prev.overall_evaluation.risk_level,
        },
      }));
    }
  };

  // Batch audit execution
  const handleTriggerBatchAudit = (targetApps: MerchantApplication[]) => {
    const updatedList = applications.map((app) => {
      if (targetApps.some((t) => t.id === app.id) && app.status === 'PENDING_AUDIT') {
        const score = app.merchant_category === 'OFFLINE' ? 94 : 89;
        return {
          ...app,
          status: 'AUTO_PASSED' as const,
          score,
          decision: 'PASS' as DecisionType,
          risk_level: 'LOW' as const,
          audited_at: new Date().toLocaleString(),
          summary_findings: [
            '批量机审流水线执行完成',
            '证照真实有效，多方底账核验无违规'
          ]
        };
      }
      return app;
    });

    setApplications(updatedList);

    const operatorName = currentUser?.name || '风控审核专员';
    const batchLog: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      application_no: `BATCH-${targetApps.length}`,
      merchant_name: `批量处理 ${targetApps.length} 户商户`,
      operator: operatorName,
      action_type: 'AI_AUDIT',
      details: `批量调度针对性审核流水线，完成 ${targetApps.length} 户商户机审`,
      evidence_hash: `sha256:batch_${Date.now()}`
    };
    setAuditLogs((prev) => [batchLog, ...prev]);
  };

  // Quick manual review from inbox table
  const handleQuickManualReview = (
    app: MerchantApplication,
    decision: DecisionType,
    notes: string
  ) => {
    const newStatus =
      decision === 'PASS'
        ? ('AUTO_PASSED' as const)
        : decision === 'FAIL'
        ? ('REJECTED' as const)
        : ('MANUAL_REVIEW' as const);

    const updated = {
      ...app,
      status: newStatus,
      decision,
      summary_findings: [
        `人工复核结论：${decision === 'PASS' ? '准入放行' : decision === 'FAIL' ? '拒绝准入' : '补充资质材料'}`,
        notes || '专员核验一致'
      ]
    };

    setApplications((prev) => prev.map((a) => (a.id === app.id ? updated : a)));

    const operatorName = currentUser ? `${currentUser.name} (${currentUser.role_name})` : '风控复核专员';
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      application_no: app.application_no,
      merchant_name: app.merchant_name,
      operator: operatorName,
      action_type: 'MANUAL_REVIEW',
      details: `人工复核录入：${decision}，意见：${notes || '符合准入规范'}`,
      evidence_hash: `sha256:rev_${Date.now()}`
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Update manual review inside detail report
  const handleUpdateReportManualReview = (review: ManualReviewRecord) => {
    const updated = { ...activeReport, manual_review: review };
    setActiveReport(updated);

    const mappedDecision: DecisionType =
      review.decision === 'APPROVED' ? 'PASS' : review.decision === 'REJECTED' ? 'FAIL' : 'MANUAL_REVIEW';
    const newStatus =
      review.decision === 'APPROVED'
        ? 'AUTO_PASSED'
        : review.decision === 'REJECTED'
        ? 'REJECTED'
        : 'MANUAL_REVIEW';

    setApplications((prev) =>
      prev.map((a) => {
        if (a.merchant_name === activeReport.merchant_info.merchant_name) {
          return {
            ...a,
            status: newStatus,
            decision: mappedDecision,
          };
        }
        return a;
      })
    );

    const operatorName = currentUser ? `${currentUser.name} (${currentUser.role_name})` : review.reviewer_name || '合规复核专员';
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      application_no: activeReport.report_meta.application_no,
      merchant_name: activeReport.merchant_info.merchant_name,
      operator: operatorName,
      action_type: 'MANUAL_REVIEW',
      details: `报告详情页提交复核决议: ${review.decision}, 意见: ${review.comments || '核验一致'}`,
      evidence_hash: `sha256:man_${Date.now()}`
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Create new merchant application
  const handleCreateNewApplication = (
    newApp: MerchantApplication,
    runAuditImmediately: boolean
  ) => {
    setApplications((prev) => [newApp, ...prev]);

    const operatorName = currentUser ? `${currentUser.name} (${currentUser.role_name})` : '风控专员';
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      application_no: newApp.application_no,
      merchant_name: newApp.merchant_name,
      operator: operatorName,
      action_type: 'NEW_APPLICATION',
      details: `新商户进件录入完成，业态：${
        newApp.merchant_category === 'OFFLINE' ? '线下实体' : '线上电商'
      }`,
      evidence_hash: `sha256:in_${Date.now()}`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    if (runAuditImmediately) {
      setAuditTargetApp(newApp);
    } else {
      setCurrentTab('APPLICATIONS');
    }
  };

  // Save rules and thresholds
  const handleSaveRules = (
    updatedRules: RuleConfigItem[],
    updatedThresholds: GlobalThresholds
  ) => {
    setRules(updatedRules);
    setThresholds(updatedThresholds);

    const operatorName = currentUser ? `${currentUser.name} (${currentUser.role_name})` : '系统管理员';
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      application_no: 'SYS-RULES-CONF',
      merchant_name: '系统全局风控策略',
      operator: operatorName,
      action_type: 'RULE_UPDATE',
      details: `调整 ${updatedRules.length} 项规则权重与准入线(放行: ≥${updatedThresholds.pass_score_threshold}分, 拦截: <${updatedThresholds.fail_score_threshold}分)`,
      evidence_hash: `sha256:policy_${Date.now()}`
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Reset rules to defaults
  const handleResetRules = () => {
    setRules(INITIAL_RULES_CONFIG);
    setThresholds(INITIAL_THRESHOLDS);
  };

  // If not logged in, display the domestic enterprise login screen
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // If logged in, display the standard domestic B2B back-office layout:
  // Left Sidebar + Right Operational Workspace
  return (
    <SaaSLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      pendingCount={pendingCount}
      onOpenNewApplication={() => setShowNewAppModal(true)}
      selectedMerchantName={selectedMerchantName}
      selectedAcquirerFilter={selectedAcquirerFilter}
      onSelectAcquirerFilter={setSelectedAcquirerFilter}
    >
      {/* Workspace Area according to currentTab */}
      {(currentTab === 'DASHBOARD' || currentTab === 'NETWORK_COCKPIT') && (
        <NetworkCockpitView
          applications={applications}
          onSelectTab={setCurrentTab}
          onSelectApplication={(app) => {
            handleSelectApplication(app);
            setCurrentTab('AUDIT_DETAIL');
          }}
          onNavigateToCollision={() => setCurrentTab('CROSS_ACQUIRER_COLLISION')}
          onNavigateToAcquirers={() => setCurrentTab('ACQUIRER_RANKING')}
          onNavigateToSweeps={() => setCurrentTab('SWEEP_TASKS')}
          onSelectMerchantByName={(name) => {
            const found = applications.find((a) => a.merchant_name.includes(name));
            if (found) {
              handleSelectApplication(found);
              setCurrentTab('AUDIT_DETAIL');
            } else {
              setCurrentTab('APPLICATIONS');
            }
          }}
        />
      )}

      {(currentTab === 'ACQUIRER_RANKING' || currentTab === 'ACQUIRER_BATCHES') && (
        <AcquirerGovernanceView
          onTriggerSweepForAcquirer={() => setCurrentTab('SWEEP_TASKS')}
        />
      )}

      {(currentTab === 'APPLICATIONS' || currentTab === 'APPLICATIONS_INBOX') && (
        <ApplicationsInboxView
          applications={
            selectedAcquirerFilter === 'ALL'
              ? applications
              : applications.filter((a) => a.acquirer_code === selectedAcquirerFilter)
          }
          onSelectApplication={handleSelectApplication}
          onTriggerAudit={handleTriggerAudit}
          onTriggerBatchAudit={handleTriggerBatchAudit}
          onOpenNewApplication={() => setShowNewAppModal(true)}
          onQuickManualReview={handleQuickManualReview}
        />
      )}

      {currentTab === 'CROSS_ACQUIRER_COLLISION' && (
        <CrossAcquirerCollisionView
          onDispatchWorkOrder={() => setCurrentTab('DISPATCH_WORKORDERS')}
        />
      )}

      {currentTab === 'MCC_COMPLIANCE' && <MccComplianceView />}

      {currentTab === 'SWEEP_TASKS' && (
        <SupervisionEnforcementView initialSubTab="SWEEP_TASKS" />
      )}

      {currentTab === 'DISPATCH_WORKORDERS' && (
        <SupervisionEnforcementView initialSubTab="DISPATCH_WORKORDERS" />
      )}

      {currentTab === 'AUDIT_DETAIL' && (
        <AuditDetailWorkbench
          activeReport={activeReport}
          availableReports={cases}
          applications={applications}
          onSelectApplicationById={handleSelectApplicationById}
          onBackToInbox={() => setCurrentTab('APPLICATIONS')}
          onTriggerAudit={handleTriggerAudit}
          onUpdateManualReview={handleUpdateReportManualReview}
          onOpenAIReasoning={() => setShowAIReasoning(true)}
          onOpenJSONModal={() => setShowJSONReport(true)}
          onDispatchWorkOrder={(_merchantName, _reason) => {
            setCurrentTab('DISPATCH_WORKORDERS');
          }}
        />
      )}

      {currentTab === 'RULE_SETTINGS' && (
        <RuleSettingsView
          rules={rules}
          thresholds={thresholds}
          applications={applications}
          onSaveRules={handleSaveRules}
          onResetDefaults={handleResetRules}
        />
      )}

      {currentTab === 'BLACKLIST' && <BlacklistView />}

      {currentTab === 'AUDIT_LOGS' && <AuditLogsView logs={auditLogs} />}

      {/* Type-Aware Dynamic Pipeline Runner Modal */}
      {auditTargetApp && (
        <TypeAwareAuditModal
          application={auditTargetApp}
          onClose={() => setAuditTargetApp(null)}
          onComplete={handleCompleteAudit}
          onViewReport={handleSelectApplication}
        />
      )}

      {/* Create New Application Modal */}
      {showNewAppModal && (
        <NewApplicationModal
          onClose={() => setShowNewAppModal(false)}
          onSubmit={handleCreateNewApplication}
        />
      )}

      {/* Gemini AI Reasoning Modal */}
      <AIReasoningModal
        isOpen={showAIReasoning}
        onClose={() => setShowAIReasoning(false)}
        report={activeReport}
      />

      {/* JSON Evidence Export Modal */}
      <JSONReportModal
        isOpen={showJSONReport}
        onClose={() => setShowJSONReport(false)}
        report={activeReport}
      />
    </SaaSLayout>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
