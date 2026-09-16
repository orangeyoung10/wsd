import { DecisionType, MerchantAuditReport, OverallEvaluation, RuleAuditItem, SubScores } from '../types';

export interface EvaluatorResult {
  decision: DecisionType;
  final_score: number;
  focus_issues: string[];
  mitigation_conditions: string[];
  sub_scores: SubScores;
  conclusion: string;
  is_vetoed: boolean;
  veto_rule_codes: string[];
  total_rules: number;
  pass_count: number;
  warning_count: number;
  fail_count: number;
}

export class MerchantRiskEvaluator {
  private veto_rules: string[];

  constructor(veto_rules?: string[]) {
    // Default system veto rules matching specification
    this.veto_rules = veto_rules || [
      'KYC-LICENSE-03',
      'KYC-LICENSE-04',
      'KYC-LICENSE-06',
      'KYC-LEGAL-02',
      'KYC-LEGAL-03',
      'KYC-LEGAL-04',
      'KYC-IMAGE-02',
      'KYB-AGREE-00',
      'KYB-AGREE-07',
      'KYB-INV-01',
      'KYB-INV-02',
      'KYB-VENUE-04',
      'KYB-SCENE-01',
      'KYB-SCENE-05',
      'KYB-REPUT-01',
      'KYB-REPUT-02',
    ];
  }

  /**
   * Evaluates all flattened rule items according to Section 4.2:
   * base_score = 100.0
   * FAIL: base_score -= (r.weight * 40.0), check veto
   * WARNING: base_score -= (r.weight * 15.0)
   * if is_vetoed or final_score < 60: FAIL
   * elif final_score < 85 or warnings > 2: MANUAL_REVIEW
   * else: PASS
   */
  public evaluate(results: RuleAuditItem[]): EvaluatorResult {
    let base_score = 100.0;
    const focus_issues: string[] = [];
    const mitigation_conditions: string[] = [];
    let is_vetoed = false;
    const veto_rule_codes: string[] = [];

    let pass_count = 0;
    let warning_count = 0;
    let fail_count = 0;

    for (const r of results) {
      const weight = r.weight ?? 0.8;
      const isVetoItem = r.is_veto || this.veto_rules.includes(r.rule_code);

      if (r.result === 'FAIL') {
        fail_count++;
        if (isVetoItem) {
          is_vetoed = true;
          veto_rule_codes.push(r.rule_code);
        }
        base_score -= weight * 40.0;
        focus_issues.push(`【拦截】${r.rule_code} (${r.item_name}): ${r.detail}`);
      } else if (r.result === 'WARNING') {
        warning_count++;
        base_score -= weight * 15.0;
        focus_issues.push(`【关注】${r.rule_code} (${r.item_name}): ${r.detail}`);
      } else if (r.result === 'PASS') {
        pass_count++;
      }
    }

    const final_score = Math.max(0, Math.min(100, Math.round(base_score)));

    // Decision logic as specified in section 4.2
    let decision: DecisionType;
    if (is_vetoed || final_score < 60) {
      decision = 'FAIL';
    } else if (final_score < 85 || warning_count > 2) {
      decision = 'MANUAL_REVIEW';
    } else {
      decision = 'PASS';
    }

    // Determine sub-scores
    const kycRules = results.filter((r) => r.rule_code.startsWith('KYC'));
    const kybRules = results.filter((r) => r.rule_code.startsWith('KYB') && !r.rule_code.startsWith('KYB-REPUT'));
    const riskRules = results.filter((r) => r.rule_code.startsWith('KYB-REPUT'));

    const calcSubStatus = (items: RuleAuditItem[]): 'PASS' | 'WARNING' | 'FAIL' => {
      if (items.some((i) => i.result === 'FAIL')) return 'FAIL';
      if (items.some((i) => i.result === 'WARNING')) return 'WARNING';
      return 'PASS';
    };

    const sub_scores: SubScores = {
      kyc_status: calcSubStatus(kycRules),
      kyb_status: calcSubStatus(kybRules),
      risk_status: calcSubStatus(riskRules),
    };

    // Conclusion text generation
    let conclusion = '';
    if (decision === 'PASS') {
      conclusion = `商户综合资质核验通过，置信度得分 ${final_score}分。各项营业资质、法人身份、业务贸易背景真实有效，网络探测与司法筛查未发现准入风险，建议予以准入进件。`;
      mitigation_conditions.push('定期触发网络场景活性巡检（周期：30天）');
      mitigation_conditions.push('开通初始交易额度：单笔限额 50,000 元，月度限额 1,000,000 元');
    } else if (decision === 'MANUAL_REVIEW') {
      conclusion = `商户综合评定为“待人工复核”，置信度得分 ${final_score}分。存在 ${warning_count} 项中度风险关注点，涉及部分材料识别差异或未完全匹配，需人工审核员进行真实性确权后予以定损。`;
      mitigation_conditions.push('人工核验营业执照有效期限，核对全国企业信用信息公示系统最新登记备案');
      mitigation_conditions.push('补充近1个月经营实体场地包含清晰GPS定位水印之实拍照片');
      mitigation_conditions.push('要求商户补充上游品牌方授权书或完整业务链路补充协议');
    } else {
      conclusion = `商户综合评定为“直接拒绝/高危拦截”，置信度得分 ${final_score}分。命中 ${veto_rule_codes.length} 项一票否决强规则或综合分低于60分准入阈值，存在材料篡改、失信主体或贸易背景虚假等不可逆合规风险。`;
      mitigation_conditions.push('禁止准入并同步将商户统一社会信用代码及法人加入平台风险黑名单库');
      mitigation_conditions.push('触发反洗钱与风险防范上报机制');
    }

    return {
      decision,
      final_score,
      focus_issues,
      mitigation_conditions,
      sub_scores,
      conclusion,
      is_vetoed,
      veto_rule_codes,
      total_rules: results.length,
      pass_count,
      warning_count,
      fail_count,
    };
  }

  /**
   * Helper to collect all rule items from a report
   */
  public static collectAllRules(report: MerchantAuditReport): RuleAuditItem[] {
    const list: RuleAuditItem[] = [];

    // KYC
    if (report.audit_sections.kyc?.rules) {
      list.push(...report.audit_sections.kyc.rules);
    }

    // KYB Agreements
    if (report.audit_sections.kyb?.agreements) {
      for (const ag of report.audit_sections.kyb.agreements) {
        list.push(...ag.audit_rules);
      }
    }

    // KYB Invoices
    if (report.audit_sections.kyb?.invoices) {
      for (const inv of report.audit_sections.kyb.invoices) {
        list.push(...inv.audit_rules);
      }
    }

    // KYB Venues
    if (report.audit_sections.kyb?.venues) {
      list.push(...report.audit_sections.kyb.venues);
    }

    // KYB Scene probe
    if (report.audit_sections.kyb?.scene_probe) {
      list.push(...report.audit_sections.kyb.scene_probe);
    }

    // KYB Reputation
    if (report.audit_sections.kyb?.reputation) {
      list.push(...report.audit_sections.kyb.reputation);
    }

    return list;
  }
}
