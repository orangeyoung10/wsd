export type AuditResultType = 'PASS' | 'WARNING' | 'FAIL' | 'INFO';
export type DecisionType = 'PASS' | 'MANUAL_REVIEW' | 'FAIL';
export type BusinessType = 'ENTERPRISE' | 'INDIVIDUAL';
export type MerchantCategory = 'ONLINE' | 'OFFLINE' | 'CROSS_BORDER';
export type ApplicationStatus = 'PENDING_AUDIT' | 'AUDITING' | 'AUTO_PASSED' | 'MANUAL_REVIEW' | 'REJECTED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type SaaSNavigationTab =
  | 'DASHBOARD'
  | 'NETWORK_COCKPIT'
  | 'ACQUIRER_RANKING'
  | 'ACQUIRER_BATCHES'
  | 'APPLICATIONS'
  | 'APPLICATIONS_INBOX'
  | 'AUDIT_DETAIL'
  | 'CROSS_ACQUIRER_COLLISION'
  | 'MCC_COMPLIANCE'
  | 'SWEEP_TASKS'
  | 'DISPATCH_WORKORDERS'
  | 'RULE_SETTINGS'
  | 'BLACKLIST'
  | 'AUDIT_LOGS';

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  role: 'ADMIN' | 'SENIOR_AUDITOR' | 'AUDITOR';
  role_name: string;
  department: string;
  phone: string;
  email: string;
  last_login: string;
}

export interface ReportMeta {
  report_id: string;
  application_id: string;
  tenant_id: string;
  generated_time: string;
  model_version: string;
  execution_time_ms: number;
}

export interface MerchantInfo {
  merchant_no: string;
  merchant_name: string;
  legal_person: string;
  unified_credit_code: string;
  business_type: BusinessType;
  merchant_category?: MerchantCategory;
  registered_capital?: string;
  establish_date?: string;
  operating_period?: string;
  registered_address?: string;
  business_scope?: string;
  settlement_account?: {
    account_name: string;
    account_no: string;
    bank_name: string;
    account_type: 'CORPORATE' | 'PERSONAL';
  };
  online_scene_url?: string;
  offline_venue_address?: string;
}

export interface CompareDetail {
  field_name: string;
  ocr_value: string;
  auth_value: string;
  is_matched: boolean;
  diff_reason?: string;
}

export interface RuleAuditItem {
  rule_code: string;
  rule_basis: string;
  item_name: string;
  result: AuditResultType;
  detail: string;
  related_target?: string;
  weight?: number;
  is_veto?: boolean;
  compare_details?: CompareDetail[];
  evidence_url?: string;
  tags?: string[];
}

export interface DocTabItem {
  tab_id: string;
  doc_name: string;
  doc_type?: string;
  doc_number?: string;
  doc_amount?: string;
  audit_rules: RuleAuditItem[];
  file_url?: string;
  summary_status?: AuditResultType;
}

export interface SubScores {
  kyc_status: AuditResultType;
  kyb_status: AuditResultType;
  risk_status: AuditResultType;
}

export interface OverallEvaluation {
  final_decision: DecisionType;
  confidence_score: number;
  sub_scores: SubScores;
  conclusion: string;
}

export interface Recommendation {
  action: string;
  focus_issues: string[];
  mitigation_conditions: string[];
}

export interface AuditSections {
  kyc: {
    status: AuditResultType;
    rules: RuleAuditItem[];
  };
  kyb: {
    agreements: DocTabItem[];
    invoices: DocTabItem[];
    venues: RuleAuditItem[];
    scene_probe: RuleAuditItem[];
    reputation: RuleAuditItem[];
  };
}

export interface ManualReviewRecord {
  reviewer_id: string;
  reviewer_name: string;
  reviewed_at: string;
  decision: 'APPROVED' | 'REJECTED' | 'SUPPLEMENTARY';
  comments: string;
  conditions?: string[];
}

export interface MerchantAuditReport {
  report_meta: ReportMeta;
  merchant_info: MerchantInfo;
  overall_evaluation: OverallEvaluation;
  audit_sections: AuditSections;
  recommendation: Recommendation;
  manual_review?: ManualReviewRecord;
}

export type AuditReport = MerchantAuditReport;
export type ManualReviewState = ManualReviewRecord;

export interface RuleDefinition {
  module: 'KYC' | 'KYB';
  rule_code: string;
  rule_name: string;
  data_source: string;
  processing_method: string;
  error_strategy: string;
  weight: number;
  is_veto: boolean;
}

export interface PipelineStage {
  id: number;
  key: string;
  name: string;
  description: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  duration_ms: number;
  tools: string[];
  findings_count: {
    pass: number;
    warning: number;
    fail: number;
  };
}

export interface MerchantApplication {
  id: string;
  application_no: string;
  merchant_name: string;
  merchant_category: MerchantCategory;
  business_type: BusinessType;
  unified_credit_code: string;
  legal_person: string;
  registered_capital?: string;
  registered_address?: string;
  business_scope?: string;
  submission_channel: string;
  submitted_at: string;
  status: ApplicationStatus;
  score?: number;
  decision?: DecisionType;
  risk_level?: RiskLevel;
  report_id?: string;
  target_url_or_venue?: string;
  summary_findings?: string[];
  audited_at?: string;
  audit_duration_ms?: number;
  // Card Scheme governance fields
  acquirer_code?: string;
  acquirer_name?: string;
  mcc_code?: string;
  mcc_desc?: string;
  cross_collision_flag?: boolean;
}

export interface AcquirerInstitution {
  id: string;
  code: string;
  name: string;
  short_name: string;
  type: 'BANK' | 'PAYMENT_COMPANY' | 'CROSS_BORDER';
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  total_submitted: number;
  pass_rate: number;
  fake_doc_rate: number;
  penalty_points: number;
  quota_status: 'NORMAL' | 'WARNED' | 'RESTRICTED';
  green_channel: boolean;
  contact_person: string;
  contact_phone: string;
  last_batch_at: string;
}

export interface CrossAcquirerCollisionRecord {
  id: string;
  collision_type: 'MULTI_ACQUIRER_SAME_ENTITY' | 'LEGAL_PERSON_EXCESSIVE' | 'BANK_ACCOUNT_REUSED' | 'GEO_LOCATION_CONFLICT';
  target_name: string;
  target_key: string;
  involved_acquirers: {
    acquirer_name: string;
    merchant_name: string;
    submitted_at: string;
    status: string;
    mcc?: string;
  }[];
  risk_summary: string;
  risk_level: 'HIGH' | 'CRITICAL';
  detected_at: string;
  status: 'UNRESOLVED' | 'UNDER_INVESTIGATION' | 'VERIFIED_FRAUD';
}

export interface MccViolationRecord {
  id: string;
  merchant_name: string;
  acquirer_name: string;
  reported_mcc: string;
  reported_mcc_name: string;
  expected_mcc: string;
  expected_mcc_name: string;
  fee_arbitrage: string;
  evidence: string;
  confidence: number;
  status: 'PENDING' | 'DISPATCHED' | 'CONFIRMED_VIOLATION';
}

export interface SupervisionSweepTask {
  id: string;
  task_name: string;
  task_type: 'SPECIAL_INSPECTION' | 'PERIODIC_SWEEP' | 'REGULATORY_CAMPAIGN';
  target_scope: string;
  total_scanned: number;
  suspicious_count: number;
  blocked_count: number;
  created_by: string;
  created_at: string;
  status: 'RUNNING' | 'COMPLETED';
  progress: number;
  findings_summary: string;
}

export interface ComplianceWorkOrder {
  id: string;
  work_order_no: string;
  merchant_name: string;
  acquirer_code: string;
  acquirer_name: string;
  violation_type: string;
  issue_description: string;
  dispatch_time: string;
  deadline_time: string;
  hours_remaining: number;
  status: 'AWAITING_EVIDENCE' | 'UNDER_REVIEW' | 'CONFIRMED_CLEARED' | 'BLACK_LISTED';
  response_content?: string;
}

export interface RuleConfigItem {
  rule_code: string;
  rule_name: string;
  module: 'KYC' | 'KYB_ONLINE' | 'KYB_OFFLINE' | 'KYB_TRADE' | 'JUDICIAL';
  applicable_categories: MerchantCategory[];
  weight: number; // 0.1 - 2.0
  is_veto: boolean;
  enabled: boolean;
  error_strategy: string;
  data_source: string;
  processing_method: string;
  threshold_description?: string;
}

export interface GlobalThresholds {
  pass_score_threshold: number; // e.g. 85
  fail_score_threshold: number; // e.g. 60
  max_allowed_warnings: number; // e.g. 2
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action_type: 'AI_AUDIT' | 'MANUAL_REVIEW' | 'RULE_UPDATE' | 'NEW_APPLICATION' | 'BATCH_AUDIT';
  application_no: string;
  merchant_name: string;
  operator: string;
  details: string;
  result_badge?: string;
  evidence_hash?: string;
}

