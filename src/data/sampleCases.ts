import { MerchantAuditReport } from '../types';

export const SAMPLE_CASES: MerchantAuditReport[] = [
  // ==========================================
  // CASE 1: PASS - 某大型合规零售电商商户
  // ==========================================
  {
    report_meta: {
      report_id: 'RPT-20260912-882194',
      application_id: 'APP-HZ-2026-09941',
      tenant_id: 'TENANT-DEFAULT-ALIPAY-CHNL',
      generated_time: '2026-09-12T14:32:18Z',
      model_version: 'MAAP-Engine-v3.8.2-Prod',
      execution_time_ms: 1840,
    },
    merchant_info: {
      merchant_no: 'MCH-9812739281',
      merchant_name: '盒马**（杭州）有限公司',
      legal_person: '张建国',
      unified_credit_code: '91330108MA28W88X9N',
      business_type: 'ENTERPRISE',
      registered_capital: '5000.00 万元人民币',
      establish_date: '2018-05-18',
      operating_period: '2018-05-18 至 2038-05-17',
      registered_address: '浙江省杭州市滨江区长河街道网商路699号3幢801室',
      business_scope: '软件开发；计算机系统服务；食用农产品零售；初级农产品收购；日用百货销售；食品互联网销售（销售预包装食品）；供应链管理服务。',
      settlement_account: {
        account_name: '盒马**（杭州）有限公司',
        account_no: '3301 **** **** 8829',
        bank_name: '中国工*银行杭州滨江支行',
        account_type: 'CORPORATE',
      },
      online_scene_url: 'https://mall.hema-yanxuan.com',
    },
    overall_evaluation: {
      final_decision: 'PASS',
      confidence_score: 96,
      sub_scores: {
        kyc_status: 'PASS',
        kyb_status: 'PASS',
        risk_status: 'PASS',
      },
      conclusion: '商户综合资质核验通过，置信度得分 96分。营业执照原件清晰且工商底账全项比对一致，法人身份证有效并完成实人联网鉴权；合同及发票实现三流合一穿透；线上商城ICP备案正常且支付流程闭环，司法及舆情排查无风险，建议予以系统直接准入。',
    },
    audit_sections: {
      kyc: {
        status: 'PASS',
        rules: [
          {
            rule_code: 'KYC-LICENSE-01',
            rule_basis: '营业执照鉴真规范 §2.1',
            item_name: '电子证照/纸质原件检测',
            result: 'PASS',
            detail: '营业执照采用国家市场监管总局标准版式，防伪微缩文字及底纹连续完整，右下角国家企业信用信息公示系统二维码解析无误。',
            related_target: '营业执照原图',
            weight: 0.8,
            compare_details: [
              { field_name: '证照版式', ocr_value: '新版营业执照（含横版二维码）', auth_value: '新版营业执照标准规范', is_matched: true },
              { field_name: '防伪微缩文字', ocr_value: '清晰可见无畸变', auth_value: '清晰连续', is_matched: true },
              { field_name: '二维码解析URL', ocr_value: 'http://gsxt.zj.gov.cn/notice/c/330108MA28W88X9N', auth_value: 'http://gsxt.zj.gov.cn/notice/c/330108MA28W88X9N', is_matched: true }
            ]
          },
          {
            rule_code: 'KYC-LICENSE-02',
            rule_basis: '工商状态核验标准 §1.4',
            item_name: '证照版本时效性',
            result: 'PASS',
            detail: '执照OCR发证日期与省市监局最新登记发照日期一致（2023-03-12），非失效或历史版本。',
            related_target: '发照日期比对',
            weight: 0.9,
            compare_details: [
              { field_name: '发照日期', ocr_value: '2023-03-12', auth_value: '2023-03-12', is_matched: true }
            ]
          },
          {
            rule_code: 'KYC-LICENSE-03',
            rule_basis: 'GB 32100-2015 编码规范',
            item_name: '企业统一社会信用代码一致性',
            result: 'PASS',
            detail: '18位统一社会信用代码校验位算法合法，国家发改委底账与执照全量一致。',
            related_target: '91330108MA28W88X9N',
            weight: 1.0,
            is_veto: true,
            compare_details: [
              { field_name: '统一社会信用代码', ocr_value: '91330108MA28W88X9N', auth_value: '91330108MA28W88X9N', is_matched: true }
            ]
          },
          {
            rule_code: 'KYC-LICENSE-04',
            rule_basis: '工商核验标准 §1.2',
            item_name: '企业法定名称比对',
            result: 'PASS',
            detail: '申报商户名称与执照OCR名称、市监底账全量全等，无错漏字或简称混用。',
            related_target: '盒马**（杭州）有限公司',
            weight: 1.0,
            is_veto: true,
            compare_details: [
              { field_name: '企业名称', ocr_value: '盒马**（杭州）有限公司', auth_value: '盒马**（杭州）有限公司', is_matched: true }
            ]
          },
          {
            rule_code: 'KYC-LICENSE-06',
            rule_basis: '工商核验标准 §1.5',
            item_name: '法定代表人姓名比对',
            result: 'PASS',
            detail: '法定代表人姓名三向严格匹配（执照OCR / 申报信息 / 市监登记）。',
            related_target: '张建国',
            weight: 1.0,
            is_veto: true,
            compare_details: [
              { field_name: '法定代表人', ocr_value: '张建国', auth_value: '张建国', is_matched: true }
            ]
          },
          {
            rule_code: 'KYC-LICENSE-09',
            rule_basis: '执照期限规范 §2.3',
            item_name: '营业期限完整性与有效期',
            result: 'PASS',
            detail: '营业期限至2038年5月17日，距今有效期限大于10年。',
            related_target: '2018-05-18 至 2038-05-17',
            weight: 0.9,
            compare_details: [
              { field_name: '营业期限起', ocr_value: '2018-05-18', auth_value: '2018-05-18', is_matched: true },
              { field_name: '营业期限止', ocr_value: '2038-05-17', auth_value: '2038-05-17', is_matched: true }
            ]
          },
          {
            rule_code: 'KYC-LEGAL-02',
            rule_basis: '公安身份核验体系 §3.1',
            item_name: '法代证件字段比对 (姓名/号码/有效期)',
            result: 'PASS',
            detail: '二代居民身份证人像面与国徽面OCR提取无误，公安部NCIIC公民身份直连鉴权一致，有效期限至2035年。',
            related_target: '张建国 (33010619800812****)',
            weight: 1.0,
            is_veto: true,
            compare_details: [
              { field_name: '姓名', ocr_value: '张建国', auth_value: '张建国', is_matched: true },
              { field_name: '公民身份号码', ocr_value: '33010619800812451X', auth_value: '33010619800812451X', is_matched: true },
              { field_name: '证件有效期止', ocr_value: '2035-10-20', auth_value: '2035-10-20', is_matched: true }
            ]
          },
          {
            rule_code: 'KYC-SETTLE-01',
            rule_basis: '央行结算规范 银发[2019]85号',
            item_name: '结算账户主体一致性',
            result: 'PASS',
            detail: '开户许可证显示对公账户开户名与企业法定名称严格一致，大额行号联网验真成功。',
            related_target: '中国工*银行杭州滨江支行',
            weight: 0.85,
            compare_details: [
              { field_name: '结算账户户名', ocr_value: '盒马**（杭州）有限公司', auth_value: '盒马**（杭州）有限公司', is_matched: true },
              { field_name: '账户性质', ocr_value: '基本存款账户', auth_value: '基本存款账户', is_matched: true }
            ]
          },
          {
            rule_code: 'KYC-IMAGE-02',
            rule_basis: 'CV图像取证规范 §4.1',
            item_name: 'PS涂抹与像素篡改鉴定',
            result: 'PASS',
            detail: 'ELA错误级别分析与频域高频噪点检测未见涂抹痕迹，文字边缘过渡自然，无任何拼接特征。',
            related_target: '营业执照及法代原件影像',
            weight: 1.0,
            is_veto: true
          }
        ]
      },
      kyb: {
        agreements: [
          {
            tab_id: 'AGREE-01',
            doc_name: '生鲜果蔬农产品年度供销战略合作框架协议',
            doc_type: '供应链供销合同',
            doc_number: 'HM-SUPPLY-2026-081',
            doc_amount: '¥ 12,000,000.00',
            summary_status: 'PASS',
            audit_rules: [
              {
                rule_code: 'KYB-AGREE-00',
                rule_basis: '合同合规审查标准 §5.1',
                item_name: '协议签署方主体核验',
                result: 'PASS',
                detail: '合同甲方为进件商户“盒马**（杭州）有限公司”，乙方为“浙江**生态农业有限公司”，签约主体与进件商户一致。',
                related_target: '甲方：盒马严选 / 乙方：浙江绿鲜',
                weight: 1.0,
                is_veto: true,
                compare_details: [
                  { field_name: '合同甲方', ocr_value: '盒马**（杭州）有限公司', auth_value: '盒马**（杭州）有限公司', is_matched: true },
                  { field_name: '合同乙方', ocr_value: '浙江**生态农业有限公司', auth_value: '浙江**生态农业有限公司', is_matched: true }
                ]
              },
              {
                rule_code: 'KYB-AGREE-02',
                rule_basis: '上下游工商穿透标准 §5.3',
                item_name: '合作方工商存续穿透',
                result: 'PASS',
                detail: '合作方“浙江**生态农业有限公司”注册资本2000万元，存续经营状态正常，无失信涉诉。',
                related_target: '91330602MA29U8991P',
                weight: 0.9
              },
              {
                rule_code: 'KYB-AGREE-05',
                rule_basis: 'LLM语义契合度标准 §5.5',
                item_name: '合同品目与经营范围关联度',
                result: 'PASS',
                detail: '合同主要标的“优质高山蓝莓、精品网纹瓜采购”，与商户经营范围“食用农产品零售；初级农产品收购”高度契合（语义相似度 0.94）。',
                related_target: '果蔬农产品购销',
                weight: 0.85
              },
              {
                rule_code: 'KYB-AGREE-07',
                rule_basis: '印章取证技术规范 §5.7',
                item_name: '合同印章与骑缝章核验',
                result: 'PASS',
                detail: '双方加盖合同专用公章及骑缝章，印章文字OCR提取完整且椭圆防伪五角星轮廓清晰无篡改。',
                related_target: '双方鲜章及法定代表人签章',
                weight: 0.95,
                is_veto: true
              }
            ]
          }
        ],
        invoices: [
          {
            tab_id: 'INV-01',
            doc_name: '增值税专用发票（农产品初级采购）',
            doc_number: '23332000000018991201',
            doc_amount: '¥ 1,450,800.00',
            summary_status: 'PASS',
            audit_rules: [
              {
                rule_code: 'KYB-INV-01',
                rule_basis: '税务局底账查验平台接口规范',
                item_name: '发票真实性查验',
                result: 'PASS',
                detail: '发票代码与号码直连国家税务总局发票查验平台，返回结果为正常已报税真票，无作废或红冲记录。',
                related_target: '发票代码 23332000000018991201',
                weight: 1.0,
                is_veto: true,
                compare_details: [
                  { field_name: '发票真伪状态', ocr_value: '查验一致（真票）', auth_value: '国税底账正常存根', is_matched: true },
                  { field_name: '开票金额（不含税）', ocr_value: '1331009.17', auth_value: '1331009.17', is_matched: true },
                  { field_name: '开票日期', ocr_value: '2026-08-15', auth_value: '2026-08-15', is_matched: true }
                ]
              },
              {
                rule_code: 'KYB-INV-02',
                rule_basis: '三流合一核对标准 §6.2',
                item_name: '发票销售方/购买方主体一致性',
                result: 'PASS',
                detail: '购买方纳税人识别号与进件商户统一社会信用代码完全一致，销售方纳税人识别号与合作协议乙方全量吻合。',
                related_target: '购买方：盒马严选 / 销售方：浙江绿鲜',
                weight: 0.95,
                is_veto: true,
                compare_details: [
                  { field_name: '购买方纳税人识别号', ocr_value: '91330108MA28W88X9N', auth_value: '91330108MA28W88X9N', is_matched: true },
                  { field_name: '销售方纳税人识别号', ocr_value: '91330602MA29U8991P', auth_value: '91330602MA29U8991P', is_matched: true }
                ]
              }
            ]
          }
        ],
        venues: [
          {
            rule_code: 'KYB-VENUE-01',
            rule_basis: '实体场地核验规范 §7.1',
            item_name: '经营场地门头牌匾文字核验',
            result: 'PASS',
            detail: '现场门头招牌清晰悬挂“盒马严选科技研发与运营中心”，与营业执照字号严格匹配。',
            related_target: '门头实景照片',
            weight: 0.85
          },
          {
            rule_code: 'KYB-VENUE-02',
            rule_basis: 'EXIF传感器取证标准 §7.2',
            item_name: '照片EXIF原始信息与GPS解析',
            result: 'PASS',
            detail: '照片保留完整原始EXIF元数据，包含GPS经纬度（120.2081, 30.1872），拍摄时间为2026-09-08 10:14:22，设备为iPhone 15 Pro。',
            related_target: '经纬度 120.2081°E, 30.1872°N',
            weight: 0.7,
            compare_details: [
              { field_name: '拍摄GPS解析', ocr_value: '30.1872, 120.2081 (杭州市滨江区网商路)', auth_value: '执照注册地滨江区网商路699号', is_matched: true }
            ]
          },
          {
            rule_code: 'KYB-VENUE-04',
            rule_basis: '反向图像检索标准 §7.4',
            item_name: '场地图片网络图库排查 (反向搜图)',
            result: 'PASS',
            detail: '经全网图库（百度、谷歌、网盘）反向哈希比对，未检索到公开网络盗图，判定为真实实拍。',
            related_target: '门头与办公区实景',
            weight: 0.95,
            is_veto: true
          }
        ],
        scene_probe: [
          {
            rule_code: 'KYB-SCENE-01',
            rule_basis: '工信部域名备案管理办法 §8.1',
            item_name: '网络场景ICP备案与主体一致性',
            result: 'PASS',
            detail: '申报商城域名 mall.hema-yanxuan.com ICP备案号“浙ICP备18029941号-3”，主办单位为进件商户本身，备案状态正常存续。',
            related_target: 'mall.hema-yanxuan.com',
            weight: 1.0,
            is_veto: true,
            compare_details: [
              { field_name: 'ICP主办单位名称', ocr_value: '盒马**（杭州）有限公司', auth_value: '盒马**（杭州）有限公司', is_matched: true },
              { field_name: 'ICP备案号', ocr_value: '浙ICP备18029941号-3', auth_value: '浙ICP备18029941号-3', is_matched: true }
            ]
          },
          {
            rule_code: 'KYB-SCENE-03',
            rule_basis: '无头浏览器活性探测规范 §8.3',
            item_name: '在线场景活性与动态探测',
            result: 'PASS',
            detail: '无头浏览器成功加载页面，HTTP返回200 OK，DOM树完整渲染农产品分类、商品详情页与用户登录中心。',
            related_target: 'https://mall.hema-yanxuan.com',
            weight: 0.9
          },
          {
            rule_code: 'KYB-SCENE-05',
            rule_basis: '清算合规标准 银发[2017]281号',
            item_name: '支付结算流程闭环与渠道穿透',
            result: 'PASS',
            detail: '收银台集成正规银联/支付宝直连收银SDK，下达订单能正常生成合规支付网关流水，无恶意跳出或私设资金池迹象。',
            related_target: '收银台SDK组件',
            weight: 0.95,
            is_veto: true
          }
        ],
        reputation: [
          {
            rule_code: 'KYB-REPUT-01',
            rule_basis: '最高人民法院失信黑名单管理规范',
            item_name: '最高法失信被执行人一票否决',
            result: 'PASS',
            detail: '全国法院失信被执行人名单库双主体（企业 + 法人张建国）查验无命中，无任何被限制高消费记录。',
            related_target: '企业与法人双主体检索',
            weight: 1.0,
            is_veto: true
          },
          {
            rule_code: 'KYB-REPUT-02',
            rule_basis: '国税重大税收违法失信案件公布办法',
            item_name: '重大税收违法失信案件名单',
            result: 'PASS',
            detail: '国家税务总局黑名单库未命中，纳税信用等级为 A 级。',
            related_target: '纳税人信用评级',
            weight: 1.0,
            is_veto: true
          },
          {
            rule_code: 'KYB-REPUT-04',
            rule_basis: '反诈预警与声誉风险库 §9.4',
            item_name: '全网负面舆情与涉诈风险监控',
            result: 'PASS',
            detail: '全网7x24小时舆情监控引擎未检索到虚假宣传、跑路、涉诈等负面舆情，风险评级极低。',
            related_target: '全网舆情与工单舆情',
            weight: 0.8
          }
        ]
      }
    },
    recommendation: {
      action: 'APPROVE_AUTOMATICALLY',
      focus_issues: [],
      mitigation_conditions: [
        '按合规流程自动开通商户收单权限，初始日限额 500,000 元',
        '系统启动常规每月网络场景活性定时巡检（KYB-SCENE-03）'
      ]
    }
  },

  // ==========================================
  // CASE 2: MANUAL_REVIEW - 待人工复核科技服务商户
  // ==========================================
  {
    report_meta: {
      report_id: 'RPT-20260912-771822',
      application_id: 'APP-SZ-2026-08311',
      tenant_id: 'TENANT-DEFAULT-WECHAT-CHNL',
      generated_time: '2026-09-12T16:11:05Z',
      model_version: 'MAAP-Engine-v3.8.2-Prod',
      execution_time_ms: 2410,
    },
    merchant_info: {
      merchant_no: 'MCH-5510298412',
      merchant_name: '极速**数字科技有限公司',
      legal_person: '李瑞华',
      unified_credit_code: '91440300MA5H9XYZ7B',
      business_type: 'ENTERPRISE',
      registered_capital: '200.00 万元人民币',
      establish_date: '2021-11-09',
      operating_period: '2021-11-09 至 长期',
      registered_address: '深圳市南山区粤海街道高新南四道18号创维半导体设计大厦西座1402',
      business_scope: '软件技术开发、技术咨询；计算机软硬件销售；信息系统集成服务；电子产品批发兼零售；企业管理咨询。',
      settlement_account: {
        account_name: '极速**数字科技有限公司',
        account_no: '7559 **** **** 3301',
        bank_name: '招*银行深圳高新园支行',
        account_type: 'CORPORATE',
      },
      online_scene_url: 'https://www.jisu-xinghuo.tech',
    },
    overall_evaluation: {
      final_decision: 'MANUAL_REVIEW',
      confidence_score: 74,
      sub_scores: {
        kyc_status: 'WARNING',
        kyb_status: 'WARNING',
        risk_status: 'PASS',
      },
      conclusion: '商户综合评定为“待人工复核”，置信度得分 74分。系统检测到 3 项中度风险关注项：① 营业执照OCR未识别到具体营业期限截止日期（执照打印“长期”因折痕阴影识别为缺省），需人工复核市监网底账；② 申报合同品目“无人配送巡检机器人整机经销”与工商经营范围中“软件开发及电子产品”存在跨品类边界差异；③ 门头照片缺少原始EXIF GPS地理定位标签，存在代拍可能。建议由人工审核员确权后放行。',
    },
    audit_sections: {
      kyc: {
        status: 'WARNING',
        rules: [
          {
            rule_code: 'KYC-LICENSE-01',
            rule_basis: '营业执照鉴真规范 §2.1',
            item_name: '电子证照/纸质原件检测',
            result: 'PASS',
            detail: '营业执照为真实纸质拍照件，边缘特征完好，公章国徽印迹正常。',
            related_target: '营业执照原件',
            weight: 0.8
          },
          {
            rule_code: 'KYC-LICENSE-03',
            rule_basis: 'GB 32100-2015 编码规范',
            item_name: '企业统一社会信用代码一致性',
            result: 'PASS',
            detail: '91440300MA5H9XYZ7B 代码校验无误，与深圳市企业信用平台一致。',
            related_target: '91440300MA5H9XYZ7B',
            weight: 1.0,
            is_veto: true
          },
          {
            rule_code: 'KYC-LICENSE-04',
            rule_basis: '工商核验标准 §1.2',
            item_name: '企业法定名称比对',
            result: 'PASS',
            detail: '极速**数字科技有限公司 字段完全匹配。',
            related_target: '极速**数字科技有限公司',
            weight: 1.0,
            is_veto: true
          },
          {
            rule_code: 'KYC-LICENSE-06',
            rule_basis: '工商核验标准 §1.5',
            item_name: '法定代表人姓名比对',
            result: 'PASS',
            detail: '李瑞华 字段比对一致。',
            related_target: '李瑞华',
            weight: 1.0,
            is_veto: true
          },
          {
            rule_code: 'KYC-LICENSE-09',
            rule_basis: '执照期限规范 §2.3',
            item_name: '营业期限完整性与有效期',
            result: 'WARNING',
            detail: '营业执照OCR因折角折痕未能精确识别营业期限截止日期（OCR识别值为空），而工商底账返回为“长期”，存在字段缺失差异，需人工复核确认。',
            related_target: '营业期限字段缺失',
            weight: 0.9,
            compare_details: [
              { field_name: '营业期限起', ocr_value: '2021-11-09', auth_value: '2021-11-09', is_matched: true },
              { field_name: '营业期限止', ocr_value: '未识别到文本（折痕阴影）', auth_value: '长期 (2099-12-31)', is_matched: false, diff_reason: '未识别到营业期限止，需人工确认执照实物真实性' }
            ]
          },
          {
            rule_code: 'KYC-LEGAL-02',
            rule_basis: '公安身份核验体系 §3.1',
            item_name: '法代证件字段严格比对',
            result: 'PASS',
            detail: '身份证人像与底账库照片比对相似度98%，证号合法，有效期限至2032年。',
            related_target: '李瑞华 (44030119850415****)',
            weight: 1.0,
            is_veto: true,
            compare_details: [
              { field_name: '姓名', ocr_value: '李瑞华', auth_value: '李瑞华', is_matched: true },
              { field_name: '公民身份号码', ocr_value: '440301198504153921', auth_value: '440301198504153921', is_matched: true },
              { field_name: '有效期限止', ocr_value: '2032-04-15', auth_value: '2032-04-15', is_matched: true }
            ]
          },
          {
            rule_code: 'KYC-IMAGE-01',
            rule_basis: '证件介质检测规范 §4.2',
            item_name: '证件介质与防伪 (纸质/复印件)',
            result: 'PASS',
            detail: '执照有正常反光和微观纸张纹理，未见翻拍与扫描伪造特征。',
            related_target: '执照正本',
            weight: 0.7
          }
        ]
      },
      kyb: {
        agreements: [
          {
            tab_id: 'AGREE-01',
            doc_name: '智能仓储巡检机器人产品代销服务协议',
            doc_type: '硬件代理销售合同',
            doc_number: 'JS-BOT-2026-003',
            doc_amount: '¥ 3,500,000.00',
            summary_status: 'WARNING',
            audit_rules: [
              {
                rule_code: 'KYB-AGREE-00',
                rule_basis: '合同合规审查标准 §5.1',
                item_name: '协议签署方主体核验',
                result: 'PASS',
                detail: '协议签署乙方为进件商户“极速**数字科技有限公司”，签署主体合规。',
                related_target: '乙方：极速**数字科技有限公司',
                weight: 1.0,
                is_veto: true
              },
              {
                rule_code: 'KYB-AGREE-05',
                rule_basis: 'LLM语义契合度标准 §5.5',
                item_name: '合同品目与商户经营范围一致性',
                result: 'WARNING',
                detail: '合同履约标的为“高精度工业无人巡检机器人整机供货与代销”，商户经营范围主要为“软件开发；电子产品销售”，机器人整机属于智能特种装备范畴，超出常规普通电子产品范畴，语义匹配度 0.61（阈值0.75），需人工研判是否涉及超范围高危销售。',
                related_target: '工业无人巡检机器人 vs 软件/电子产品',
                weight: 0.85,
                compare_details: [
                  { field_name: '合同交易标的品目', ocr_value: '智能工业特种无人配送巡检机器人硬件整机', auth_value: '软硬件销售、系统集成', is_matched: false, diff_reason: '品目超出主营常规软件范围，疑似跨行业代理' }
                ]
              },
              {
                rule_code: 'KYB-AGREE-07',
                rule_basis: '印章取证技术规范 §5.7',
                item_name: '合同印章与签署期',
                result: 'PASS',
                detail: '双方公章完备无缺损，签署日期距今约90天（2026-06-10）。',
                related_target: '合同专用章',
                weight: 0.95,
                is_veto: true
              }
            ]
          }
        ],
        invoices: [
          {
            tab_id: 'INV-01',
            doc_name: '增值税普通发票（技术咨询与服务费）',
            doc_number: '0440321001119281923',
            doc_amount: '¥ 180,000.00',
            summary_status: 'PASS',
            audit_rules: [
              {
                rule_code: 'KYB-INV-01',
                rule_basis: '税务局底账查验平台接口规范',
                item_name: '发票真实性查验',
                result: 'PASS',
                detail: '税务查验成功，发票状态正常，开具方与购买方纳税人识别号一致。',
                related_target: '0440321001119281923',
                weight: 1.0,
                is_veto: true
              }
            ]
          }
        ],
        venues: [
          {
            rule_code: 'KYB-VENUE-01',
            rule_basis: '实体场地核验规范 §7.1',
            item_name: '经营场地门头牌匾文字核验',
            result: 'PASS',
            detail: '创维半导体大厦西座1402门口挂牌“极速星火数字研发中心”，文字一致。',
            related_target: '办公室大门水牌',
            weight: 0.85
          },
          {
            rule_code: 'KYB-VENUE-02',
            rule_basis: 'EXIF传感器取证标准 §7.2',
            item_name: '照片EXIF原始信息与GPS解析',
            result: 'WARNING',
            detail: '上传的门头及内部全景照片元数据缺失 EXIF GPS 坐标信息（疑似经微信等即时通讯工具传输压缩被自动抹除元数据），无法直接算法计算地址围栏距离，转人工抽检核实。',
            related_target: 'EXIF GPS Data Missing',
            weight: 0.7,
            compare_details: [
              { field_name: 'GPS定位经纬度', ocr_value: '未包含GPS元数据 (无头元数据)', auth_value: '113.9531, 22.5389 (创维大厦)', is_matched: false, diff_reason: '缺失GPS坐标，无法完成电子地理围栏自动化对齐' }
            ]
          },
          {
            rule_code: 'KYB-VENUE-04',
            rule_basis: '反向图像检索标准 §7.4',
            item_name: '场地图片网络图库排查 (反向搜图)',
            result: 'PASS',
            detail: '搜图未发现互联网公开图库痕迹，排除网图盗用可能。',
            related_target: '实景照片图库指纹检索',
            weight: 0.95,
            is_veto: true
          }
        ],
        scene_probe: [
          {
            rule_code: 'KYB-SCENE-01',
            rule_basis: '工信部域名备案管理办法 §8.1',
            item_name: '网络场景ICP备案与主体一致性',
            result: 'PASS',
            detail: '域名 jisu-xinghuo.tech 备案号“粤ICP备21089201号-1”，主体名称全等匹配。',
            related_target: 'jisu-xinghuo.tech',
            weight: 1.0,
            is_veto: true
          },
          {
            rule_code: 'KYB-SCENE-03',
            rule_basis: '无头浏览器活性探测规范 §8.3',
            item_name: '在线场景活性与动态探测',
            result: 'PASS',
            detail: '网站可正常访问，展示数字化解决方案与软硬件订购咨询留言表单。',
            related_target: 'https://www.jisu-xinghuo.tech',
            weight: 0.9
          }
        ],
        reputation: [
          {
            rule_code: 'KYB-REPUT-01',
            rule_basis: '最高人民法院失信黑名单管理规范',
            item_name: '最高法失信被执行人一票否决',
            result: 'PASS',
            detail: '全国法院失信被执行人双主体检索未命中，司法信用良好。',
            related_target: '极速星火 / 李瑞华',
            weight: 1.0,
            is_veto: true
          },
          {
            rule_code: 'KYB-REPUT-03',
            rule_basis: '涉诉风险加权模型 §9.3',
            item_name: '涉诉涉裁与被执行人历史涉案深度',
            result: 'PASS',
            detail: '企业历史上无大额经济纠纷与诉讼执行记录，涉案金额为0。',
            related_target: '裁判文书网',
            weight: 0.75
          }
        ]
      }
    },
    recommendation: {
      action: 'REQUIRE_MANUAL_VERIFICATION',
      focus_issues: [
        '【关注】KYC-LICENSE-09: 营业执照OCR未识别到营业期限止，需人工核验国家企业信用信息公示系统登记存续期',
        '【关注】KYB-AGREE-05: 合同品目“工业机器人特种硬件”与营业执照经营范围中“软件与普通电子”存在轻度偏差',
        '【关注】KYB-VENUE-02: 场地照片EXIF缺失GPS经纬度标签，需核实是否为真实营业现场或要求商户重新上传原图'
      ],
      mitigation_conditions: [
        '请审核员登录全国企业信用信息公示系统核对“极速**数字科技有限公司”营业期限是否为“长期”',
        '要求商户提供上游机器人厂商特许授权分销证书或补充协议',
        '要求商户通过企业微信直传未压缩的原图（带时间与定位水印）'
      ]
    }
  },

  // ==========================================
  // CASE 3: FAIL - 高危拦截（PS造假/失信黑名单/无备案违规）
  // ==========================================
  {
    report_meta: {
      report_id: 'RPT-20260912-990013',
      application_id: 'APP-GZ-2026-01209',
      tenant_id: 'TENANT-DEFAULT-UNIONPAY-CHNL',
      generated_time: '2026-09-12T17:45:30Z',
      model_version: 'MAAP-Engine-v3.8.2-Prod',
      execution_time_ms: 1250,
    },
    merchant_info: {
      merchant_no: 'MCH-1102938491',
      merchant_name: '鼎盛**商贸发展工作室',
      legal_person: '陈大发',
      unified_credit_code: '92440101MA5CYFAKE1',
      business_type: 'INDIVIDUAL',
      registered_capital: '10.00 万元人民币',
      establish_date: '2024-02-14',
      operating_period: '2024-02-14 至 2029-02-13',
      registered_address: '广州市白云区石井街道大岗工业区28号B栋201',
      business_scope: '日用百货零售；箱包服装批发；个人网络销售。',
      settlement_account: {
        account_name: '陈大发',
        account_no: '6228 **** **** 9102',
        bank_name: '中国农*银行广州白云支行',
        account_type: 'PERSONAL',
      },
      online_scene_url: 'http://vip-shopping888.cc',
    },
    overall_evaluation: {
      final_decision: 'FAIL',
      confidence_score: 28,
      sub_scores: {
        kyc_status: 'FAIL',
        kyb_status: 'FAIL',
        risk_status: 'FAIL',
      },
      conclusion: '商户综合评定为“直接拦截/高危驳回”，置信度得分 28分。触发 4 项一票否决严重违规：① 营业执照原图检测到严重PS图层重叠与高频噪声篡改（KYC-IMAGE-02 FAIL, 一票否决）；② 法人陈大发被最高人民法院列入“失信被执行人黑名单”且涉重大经济纠纷（KYB-REPUT-01 FAIL, 一票否决）；③ 发票税局直查查无此票，疑似套开假发票（KYB-INV-01 FAIL, 一票否决）；④ 申报网络商城无工信部ICP备案且页面注入高危外部涉赌/跑分支付跳转链接（KYB-SCENE-01/05 FAIL, 一票否决）。系统已自动拉黑处置。',
    },
    audit_sections: {
      kyc: {
        status: 'FAIL',
        rules: [
          {
            rule_code: 'KYC-LICENSE-01',
            rule_basis: '营业执照鉴真规范 §2.1',
            item_name: '电子证照/纸质原件检测',
            result: 'FAIL',
            detail: '执照二维码无法解析有效市监局链接，右下角印章轮廓存在明显数字抠图羽化痕迹。',
            related_target: '营业执照影像件',
            weight: 0.8
          },
          {
            rule_code: 'KYC-IMAGE-02',
            rule_basis: 'CV图像取证规范 §4.1',
            item_name: 'PS涂抹与像素篡改鉴定',
            result: 'FAIL',
            detail: '【高危拦截】ELA错误级别分析与高斯频域滤波检测到企业名称及统一社会信用代码区域存在显著像素阶跃与二次压缩噪点，判定为PS篡改伪造证照！',
            related_target: '执照核心文本区域',
            weight: 1.0,
            is_veto: true,
            compare_details: [
              { field_name: '企业名称区域噪点均方差', ocr_value: 'MSE: 148.2 (存在显著异质图层重叠)', auth_value: 'MSE < 12.0 (基准自然原图)', is_matched: false, diff_reason: '名称位置存在明显矩形贴图涂抹，文字字体与官方标准方正宋体不符' },
              { field_name: '统一信用代码区域', ocr_value: '92440101MA5CYFAKE1', auth_value: '市监底账查无此码 (代码校验算法失败)', is_matched: false, diff_reason: '篡改代码校验码不合法' }
            ]
          },
          {
            rule_code: 'KYC-LEGAL-02',
            rule_basis: '公安身份核验体系 §3.1',
            item_name: '法代证件字段严格比对',
            result: 'WARNING',
            detail: '身份证人像面模糊，且身份证有效期限已于2026年3月届满（已过期超6个月）。',
            related_target: '陈大发 (44011119780210****)',
            weight: 1.0,
            is_veto: true,
            compare_details: [
              { field_name: '身份证有效期止', ocr_value: '2026-03-01', auth_value: '当前时间 2026-09-12', is_matched: false, diff_reason: '法定代表人身份证件已过期' }
            ]
          }
        ]
      },
      kyb: {
        agreements: [
          {
            tab_id: 'AGREE-01',
            doc_name: '品牌鞋服代销采购框架协议书',
            doc_type: '商品代销合同',
            doc_number: 'DS-2026-991',
            doc_amount: '¥ 8,800,000.00',
            summary_status: 'FAIL',
            audit_rules: [
              {
                rule_code: 'KYB-AGREE-02',
                rule_basis: '上下游工商穿透标准 §5.3',
                item_name: '合作对手方存续状态穿透',
                result: 'FAIL',
                detail: '【高危】协议甲方“广州**商贸发展有限公司”已被广州市市监局列入“经营异常名录”并于2025年12月吊销营业执照，合作方为空壳失信主体！',
                related_target: '甲方：广州**商贸发展有限公司',
                weight: 0.9,
                compare_details: [
                  { field_name: '甲方工商存续状态', ocr_value: '合同载明正常经营', auth_value: '已吊销（未注销）', is_matched: false, diff_reason: '签约对手方为已吊销企业，协议无效' }
                ]
              },
              {
                rule_code: 'KYB-AGREE-07',
                rule_basis: '印章取证技术规范 §5.7',
                item_name: '合同印章与骑缝章核验',
                result: 'FAIL',
                detail: '甲方与乙方印章经OpenCV检测边缘色相完全一致且无任何自然印油浸润渗透，判定为电子图章PS伪造！',
                related_target: '合同末页盖章',
                weight: 0.95,
                is_veto: true
              }
            ]
          }
        ],
        invoices: [
          {
            tab_id: 'INV-01',
            doc_name: '增值税普通发票（日用品批发）',
            doc_number: '0440020001118889912',
            doc_amount: '¥ 450,000.00',
            summary_status: 'FAIL',
            audit_rules: [
              {
                rule_code: 'KYB-INV-01',
                rule_basis: '税务局底账查验平台接口规范',
                item_name: '发票真实性查验',
                result: 'FAIL',
                detail: '【一票否决】发票直连国税查验平台返回：查无此票！发票代码与号码组合不存在，判定为虚假伪造发票！',
                related_target: '0440020001118889912',
                weight: 1.0,
                is_veto: true,
                compare_details: [
                  { field_name: '发票查验结果', ocr_value: '票面载明金额 ¥450,000.00', auth_value: '国税底账无存根（假票）', is_matched: false, diff_reason: '国税总局发票查验接口报错：发票代码不存在' }
                ]
              }
            ]
          }
        ],
        venues: [
          {
            rule_code: 'KYB-VENUE-01',
            rule_basis: '实体场地核验规范 §7.1',
            item_name: '经营场地门头牌匾文字核验',
            result: 'FAIL',
            detail: '照片门头招牌文字为“天天特惠生鲜超市”，与进件商户“鼎盛**商贸发展工作室”无任何语义关联。',
            related_target: '门头照片',
            weight: 0.85
          },
          {
            rule_code: 'KYB-VENUE-04',
            rule_basis: '反向图像检索标准 §7.4',
            item_name: '场地图片网络图库排查 (反向搜图)',
            result: 'FAIL',
            detail: '【高危拦截】门头与室内货架照片经图像哈希（pHash）反向检索，命中58同城二手商铺转让出租贴（发布于2023年4月），为100%网络盗图！',
            related_target: '58同城转店图库',
            weight: 0.95,
            is_veto: true,
            compare_details: [
              { field_name: '网络搜图相似度', ocr_value: '商户上传原图', auth_value: '58同城URL: /shop/transfer/182991', is_matched: false, diff_reason: '图片相似度 99.8%，属于网络公共盗图' }
            ]
          }
        ],
        scene_probe: [
          {
            rule_code: 'KYB-SCENE-01',
            rule_basis: '工信部域名备案管理办法 §8.1',
            item_name: '网络场景ICP备案与主体一致性',
            result: 'FAIL',
            detail: '【一票否决】申报域名 vip-shopping888.cc 经工信部ICP备案系统查询，未取得任何ICP备案号，属于境内无备案非法运营站点！',
            related_target: 'vip-shopping888.cc',
            weight: 1.0,
            is_veto: true,
            compare_details: [
              { field_name: '工信部ICP备案状态', ocr_value: '申报为正规商城', auth_value: '未备案 (No ICP Record Found)', is_matched: false, diff_reason: '境外顶级域且无工信部合法ICP备案' }
            ]
          },
          {
            rule_code: 'KYB-SCENE-05',
            rule_basis: '清算合规标准 银发[2017]281号',
            item_name: '支付结算流程闭环与渠道穿透',
            result: 'FAIL',
            detail: '【一票否决】动态爬虫进入下单支付结算页，发现外链重定向跳转至境外未命名跑分充值页面（涉嫌为网络黑灰产提供第四方代收代付通道）！',
            related_target: '恶意跳转网关',
            weight: 0.95,
            is_veto: true
          }
        ],
        reputation: [
          {
            rule_code: 'KYB-REPUT-01',
            rule_basis: '最高人民法院失信黑名单管理规范',
            item_name: '最高法失信被执行人一票否决',
            result: 'FAIL',
            detail: '【一票否决】法定代表人陈大发命中最高法失信被执行人（老赖名单），涉及(2025)粤01执1882号未履行经济标的超240万元，已被限制高消费！',
            related_target: '失信被执行人：陈大发',
            weight: 1.0,
            is_veto: true,
            compare_details: [
              { field_name: '执行法院与案号', ocr_value: '未如实申报', auth_value: '广州市中级人民法院 (2025)粤01执1882号', is_matched: false, diff_reason: '有履行能力而拒不履行生效法律文书确定义务，一票否决' }
            ]
          },
          {
            rule_code: 'KYB-REPUT-04',
            rule_basis: '反诈预警与声誉风险库 §9.4',
            item_name: '全网负面舆情与涉诈风险监控',
            result: 'FAIL',
            detail: '反诈黑产监控库显示该商户绑定的结算银行卡号近30天被多起电信网络诈骗受害人举报投诉。',
            related_target: '涉案涉诈预警库',
            weight: 0.8
          }
        ]
      }
    },
    recommendation: {
      action: 'REJECT_AND_BLACKLIST',
      focus_issues: [
        '【拦截】KYC-IMAGE-02: 营业执照原图存在严重PS涂抹与文字图层篡改',
        '【拦截】KYB-REPUT-01: 法人陈大发被最高人民法院列为失信被执行人（一票否决）',
        '【拦截】KYB-INV-01: 发票国税底账查验不存在，系虚构伪造假发票（一票否决）',
        '【拦截】KYB-SCENE-01/05: 申报网络场景域名无工信部ICP备案，且下单流程涉嫌恶意跳转洗钱跑分网关',
        '【拦截】KYB-VENUE-04: 门头照片系从58同城公开商铺转让贴盗用的网络图'
      ],
      mitigation_conditions: [
        '一票否决，直接拒绝进件',
        '将商户统一社会信用代码及法人陈大发身份证号加入集团高危风险黑名单，锁定期5年',
        '生成反洗钱合规可疑交易线索报告，移交风控合规部留档'
      ]
    }
  },
  // ==========================================
  // CASE 4: PASS - 线下实体餐饮连锁（蜀香源老火锅）
  // ==========================================
  {
    report_meta: {
      report_id: 'RPT-20260912-998821',
      application_id: 'APP-CD-2026-09882',
      tenant_id: 'TENANT-DEFAULT-ACQUIRING-CHNL',
      generated_time: '2026-09-12T15:45:10Z',
      model_version: 'MAAP-Offline-Engine-v3.8.2',
      execution_time_ms: 1920,
    },
    merchant_info: {
      merchant_no: 'MCH-8829104819',
      merchant_name: '蜀**餐饮管理（成都）有限公司',
      legal_person: '李蜀峰',
      unified_credit_code: '91510104MABX88129K',
      business_type: 'ENTERPRISE',
      merchant_category: 'OFFLINE',
      registered_capital: '200.00 万元人民币',
      establish_date: '2021-08-15',
      operating_period: '2021-08-15 至 2041-08-14',
      registered_address: '四川省成都市锦江区春熙路街道东大街68号IFS国际金融中心L4-09',
      business_scope: '餐饮服务；食品销售；企业管理咨询；餐饮文化交流活动策划。',
      settlement_account: {
        account_name: '蜀**餐饮管理（成都）有限公司',
        account_no: '5101 **** **** 6621',
        bank_name: '成都银行春熙支行',
        account_type: 'CORPORATE',
      },
      offline_venue_address: '成都市锦江区东大街68号IFS国际金融中心L4-09'
    },
    overall_evaluation: {
      final_decision: 'PASS',
      confidence_score: 94,
      sub_scores: {
        kyc_status: 'PASS',
        kyb_status: 'PASS',
        risk_status: 'PASS',
      },
      conclusion: '【线下实体商户专项审核通过】综合评分 94分。门头实景与招牌文字经OCR核验与企业字号一致，经纬度GIS定位与成都市锦江区IFS大厦完全重合（偏差仅8米）；反向搜图证实场地实拍图为原创无盗图；食品经营许可证与商场物业租赁合同三流合一；无司法失信与负面舆情，建议予以系统直接准入。',
    },
    audit_sections: {
      kyc: {
        status: 'PASS',
        rules: [
          {
            rule_code: 'KYC-LICENSE-01',
            rule_basis: '电子营业执照国家规范',
            item_name: '电子证照/纸质检测',
            result: 'PASS',
            detail: '执照为四川省市场监督管理局签发新版标准电子营业执照，二维码可反查直连。',
            weight: 0.8
          },
          {
            rule_code: 'KYC-LICENSE-03',
            rule_basis: 'GB 32100-2015 编码规范',
            item_name: '统一社会信用代码一致性',
            result: 'PASS',
            detail: '91510104MABX88129K 校验码无误，市监局登记状态：存续（在营）。',
            weight: 1.0,
            is_veto: true
          },
          {
            rule_code: 'KYC-LEGAL-02',
            rule_basis: '公安联网二要素核验',
            item_name: '法定代表人身份真实性',
            result: 'PASS',
            detail: '法人李蜀峰身份信息与公安部底账完全匹配，人脸活体认证置信度 99.1%。',
            weight: 1.0,
            is_veto: true
          }
        ]
      },
      kyb: {
        agreements: [
          {
            tab_id: 'tab-lease',
            doc_name: '成都IFS商业综合体商铺租赁协议',
            doc_type: '商业地产租赁合同',
            doc_number: 'CD-IFS-2024-L4-098',
            doc_amount: '¥ 680,000 元/年',
            summary_status: 'PASS',
            audit_rules: [
              {
                rule_code: 'KYB-AGREE-00',
                rule_basis: '经营实体权属规范',
                item_name: '租赁合同跨实体主体一致性',
                result: 'PASS',
                detail: '承租方名称与商户名称“蜀**餐饮管理（成都）有限公司”完全全等，出租方为九龙仓（成都）**管理有限公司，印章有效。',
                weight: 0.85
              }
            ]
          }
        ],
        invoices: [
          {
            tab_id: 'inv-lease',
            doc_name: '租金及物业服务费增值税专用发票',
            doc_type: '增值税专用发票',
            doc_number: '245120000000192831',
            doc_amount: '¥ 170,000.00',
            summary_status: 'PASS',
            audit_rules: [
              {
                rule_code: 'KYB-INV-01',
                rule_basis: '国家税务总局全国增值税发票查验平台',
                item_name: '增值税发票真伪查验',
                result: 'PASS',
                detail: '全国发票查验平台返回：查验成功，发票状态正常，购买方与商户一致。',
                weight: 1.0,
                is_veto: true
              }
            ]
          }
        ],
        venues: [
          {
            rule_code: 'KYB-VENUE-01',
            rule_basis: '线下商户实体巡检规范 §3.1',
            item_name: '门头牌匾招牌与商户名称一致性',
            result: 'PASS',
            detail: '门店正门门头招牌文字“蜀香源老火锅（春熙路旗舰店）”与企业字号高度吻合，OCR字形清晰无遮挡。',
            related_target: '门头正面高清照',
            weight: 0.85,
            compare_details: [
              { field_name: '门头招牌文字', ocr_value: '蜀香源老火锅（春熙路旗舰店）', auth_value: '蜀**餐饮管理（成都）有限公司', is_matched: true }
            ]
          },
          {
            rule_code: 'KYB-VENUE-02',
            rule_basis: '高德GIS地图高精测距定位标准 §4.2',
            item_name: '场地拍照EXIF经纬度与GIS围栏校验',
            result: 'PASS',
            detail: '上传实拍图EXIF坐标（104.08125, 30.65582）与登记地址成都市IFS大厦匹配，实际测距偏差仅 8.2 米（远小于100米安全阈值）。',
            related_target: 'GPS: 104.08125, 30.65582',
            weight: 0.9,
            compare_details: [
              { field_name: '拍摄地理位置', ocr_value: '成都市锦江区红星路三段IFS商场', auth_value: '成都市锦江区东大街68号IFS', is_matched: true, diff_reason: '同一商业地块红线范围内' }
            ]
          },
          {
            rule_code: 'KYB-VENUE-03',
            rule_basis: 'AI CV场景目标检测标准 §5.1',
            item_name: '店内收银台及实体就餐经营要素排查',
            result: 'PASS',
            detail: 'CV模型在内景实测照片中识别出商用电磁炉餐桌、智能收银台、扫码点餐台卡及灭火器消防设施，经营要素完整度 96%。',
            related_target: '室内就餐大厅与收银台实景',
            weight: 0.8
          },
          {
            rule_code: 'KYB-VENUE-04',
            rule_basis: '全网公共图库反向哈希检索规范 §7.2',
            item_name: '场地照片反向网络图库排查 (防盗图)',
            result: 'PASS',
            detail: '【无盗图风险】门头与室内实景照片经感知哈希（pHash）检索百度/美团/58同城公开图库，未命中任何历史二手租售盗图记录，确认为原创实拍。',
            related_target: '防盗图指纹校验',
            weight: 0.95,
            is_veto: true
          }
        ],
        scene_probe: [
          {
            rule_code: 'KYB-SCENE-OFFLINE',
            rule_basis: '线下生活服务商户网络场景准入免试规范',
            item_name: '线下实体商户免网络场景探测',
            result: 'INFO',
            detail: '商户申报类型为纯线下实体餐饮门店，已自动减免工信部ICP备案及网站爬虫探针考核。已同步核验其美团/大众点评商户号（美团评分4.7星）。',
            related_target: '美团餐饮商户号: 8291048',
            weight: 0.2
          }
        ],
        reputation: [
          {
            rule_code: 'KYB-REPUT-01',
            rule_basis: '最高法失信名单库',
            item_name: '最高法失信被执行人一票否决',
            result: 'PASS',
            detail: '法人李蜀峰及商户主体全网司法排查正常，未命中失信被执行人或限高记录。',
            weight: 1.0,
            is_veto: true
          },
          {
            rule_code: 'KYB-REPUT-FOOD',
            rule_basis: '食品安全卫生专项黑名单',
            item_name: '市监局食品安全重大行政处罚排查',
            result: 'PASS',
            detail: '成都市市监局食品安全信用库未见重大违法失信处罚，食品安全量化等级为 A 级。',
            weight: 0.8
          }
        ]
      }
    },
    recommendation: {
      action: 'APPROVE_FOR_OFFLINE_POS',
      focus_issues: [],
      mitigation_conditions: [
        '核准准入，开通线下智能聚合收银台及智能POS终端刷卡交易权限',
        '配置单笔免密限额 1,000 元，单日聚合扫码上限 50,000 元',
        '建立季度实体巡店签到机制'
      ]
    }
  },
  // ==========================================
  // CASE 5: MANUAL_REVIEW - 线上泛娱乐互娱（云境互娱）
  // ==========================================
  {
    report_meta: {
      report_id: 'RPT-20260912-550192',
      application_id: 'APP-GZ-2026-09405',
      tenant_id: 'TENANT-DEFAULT-ONLINE-CHNL',
      generated_time: '2026-09-12T13:22:15Z',
      model_version: 'MAAP-Online-Engine-v3.8.2',
      execution_time_ms: 3120,
    },
    merchant_info: {
      merchant_no: 'MCH-4401928312',
      merchant_name: '云境**互动网络（广州）有限公司',
      legal_person: '林子豪',
      unified_credit_code: '91440101MA59U4189T',
      business_type: 'ENTERPRISE',
      merchant_category: 'ONLINE',
      registered_capital: '1000.00 万元人民币',
      establish_date: '2020-03-10',
      operating_period: '2020-03-10 至 2040-03-09',
      registered_address: '广州市天河区科韵路信息港F栋702',
      business_scope: '网络游戏研发；数字文化创意软件开发；增值电信业务；互联网信息服务。',
      settlement_account: {
        account_name: '云境**互动网络（广州）有限公司',
        account_no: '4401 **** **** 8890',
        bank_name: '招*银行广州科技支行',
        account_type: 'CORPORATE',
      },
      online_scene_url: 'https://game.yunjing-meta.cn'
    },
    overall_evaluation: {
      final_decision: 'MANUAL_REVIEW',
      confidence_score: 68,
      sub_scores: {
        kyc_status: 'PASS',
        kyb_status: 'WARNING',
        risk_status: 'PASS',
      },
      conclusion: '【线上数娱商户专项预警】综合评分 68分。营业执照与增值电信业务许可证有效；但动态爬虫探测到在线商城充值页使用了未报备的聚合收银SDK，且首屏缺乏未成年人防沉迷显著标识，域名解析至境外Cloudflare CDN存在跳转跳板疑虑。需人工审核员核验网络文化经营许可证（文网文）与国家新闻出版署游戏版号批文后定损。',
    },
    audit_sections: {
      kyc: {
        status: 'PASS',
        rules: [
          {
            rule_code: 'KYC-LICENSE-01',
            rule_basis: '电子证照规范',
            item_name: '营业执照原件检测',
            result: 'PASS',
            detail: '执照OCR信息与广东省市监局一致。',
            weight: 0.8
          },
          {
            rule_code: 'KYC-LICENSE-03',
            rule_basis: 'GB 32100-2015',
            item_name: '统一社会信用代码一致性',
            result: 'PASS',
            detail: '91440101MA59U4189T 校验无误。',
            weight: 1.0,
            is_veto: true
          }
        ]
      },
      kyb: {
        agreements: [
          {
            tab_id: 'tab-game-lic',
            doc_name: '游戏联运与数字版权分发授权协议',
            doc_type: '数字娱乐联运协议',
            doc_number: 'YJ-GZ-2025-019',
            doc_amount: '¥ 3,500,000 元',
            summary_status: 'WARNING',
            audit_rules: [
              {
                rule_code: 'KYB-AGREE-05',
                rule_basis: '网络游戏版号合规审查标准',
                item_name: '游戏出版物版号与授权链路穿透',
                result: 'WARNING',
                detail: '协议所附游戏版号（国新出审[2024]1082号）运营单位为关联母公司，未提供两级母子公司版权联合运营补充授权书。',
                weight: 0.9,
                compare_details: [
                  { field_name: '版号申请单位', ocr_value: '云境**互动网络（广州）有限公司', auth_value: '云境**互动娱乐集团有限公司', is_matched: false, diff_reason: '版号挂靠母公司，需补充集团内部独占联运声明' }
                ]
              }
            ]
          }
        ],
        invoices: [
          {
            tab_id: 'inv-tech',
            doc_name: '服务器集群租赁发票',
            doc_type: '增值税普通发票',
            doc_number: '244420000000881901',
            doc_amount: '¥ 240,000.00',
            summary_status: 'PASS',
            audit_rules: [
              {
                rule_code: 'KYB-INV-01',
                rule_basis: '国家税务总局发票底账',
                item_name: '发票真伪查验',
                result: 'PASS',
                detail: '查验成功，开票方为腾讯云计算（北京）有限责任公司。',
                weight: 1.0
              }
            ]
          }
        ],
        venues: [
          {
            rule_code: 'KYB-VENUE-OFFICE',
            rule_basis: '线上科技类企业办公场地实地免核准则',
            item_name: '写字楼办公场所租赁备案核验',
            result: 'PASS',
            detail: '广州科韵路信息港F栋702办公租赁备案号核查正常。',
            weight: 0.5
          }
        ],
        scene_probe: [
          {
            rule_code: 'KYB-SCENE-01',
            rule_basis: '工信部ICP域名备案管理办法',
            item_name: '网络场景ICP备案与主体一致性',
            result: 'PASS',
            detail: '申报域名 yunjing-meta.cn 经工信部ICP备案系统核验，备案号：粤ICP备2020088192号-2，主办单位与申请商户全等。',
            weight: 1.0,
            is_veto: true
          },
          {
            rule_code: 'KYB-SCENE-03',
            rule_basis: '动态爬虫探针标准 §4.3',
            item_name: '充值首屏未成年人保护合规性探针',
            result: 'WARNING',
            detail: '无头浏览器探针抓取游戏收银台充值页面，未发现“未成年人单日充值限额及退费专线”常驻弹窗，合规展示不达标。',
            related_target: 'https://game.yunjing-meta.cn/pay/checkout',
            weight: 0.85
          },
          {
            rule_code: 'KYB-SCENE-04',
            rule_basis: '网络安全与CDN解析穿透 §5.2',
            item_name: '服务器网络解析节点安全性',
            result: 'WARNING',
            detail: '主站DNS解析指向境外Cloudflare CDN代理节点，存在源站IP被屏蔽且容易发生DNS劫持的风险。',
            related_target: 'DNS: 104.21.88.19 (Cloudflare)',
            weight: 0.7
          }
        ],
        reputation: [
          {
            rule_code: 'KYB-REPUT-01',
            rule_basis: '最高法失信被执行人排查',
            item_name: '最高法失信被执行人一票否决',
            result: 'PASS',
            detail: '法人与商户主体均无失信被执行人记录。',
            weight: 1.0,
            is_veto: true
          }
        ]
      }
    },
    recommendation: {
      action: 'REQUIRE_SUPPLEMENTARY',
      focus_issues: [
        '【关注】KYB-AGREE-05: 游戏版号运营单位为母公司，缺少独家授权证明文件',
        '【关注】KYB-SCENE-03: 支付收银台未配置未成年人防沉迷充值限额显著标识',
        '【关注】KYB-SCENE-04: CDN解析至境外Cloudflare节点'
      ],
      mitigation_conditions: [
        '补充母子公司独家游戏出版物运营授权书加盖公章原件扫描件',
        '前端充值页面限期3个工作日内整改接入未成年人防沉迷校验模块',
        '限额开通测试环境支付通道，禁止向未实名认证账号开通支付'
      ]
    }
  },
  // ==========================================
  // CASE 6: 枝江市**百货店 (标准商户实战机审判例)
  // ==========================================
  {
    report_meta: {
      report_id: 'RPT-20260819-001317',
      application_id: 'APP-HB-2026-001317',
      tenant_id: 'TENANT-STANDARD-GATEWAY',
      generated_time: '2026-08-19 16:54:48',
      model_version: 'InspectEngine-v3.8.2',
      execution_time_ms: 1840,
    },
    merchant_info: {
      merchant_no: '302608250000131793',
      merchant_name: '枝江市**百货店',
      legal_person: '王启远',
      unified_credit_code: '92420583MACEQG4N01',
      business_type: 'INDIVIDUAL',
      merchant_category: 'ONLINE',
      establish_date: '2023-04-10',
      operating_period: '2023-04-10 至 长期',
      registered_address: '湖北省宜昌市枝江市马家店街道民主大道以东七星大道以北电商产业园二楼976工位',
      business_scope: '一般项目：日用百货销售，服装服饰零售，鞋帽零售，化妆品零售，文具用品零售，珠宝首饰零售，五金产品零售，针纺织品销售，个人卫生用品销售，日用品销售，礼品花卉销售，母婴用品销售，钟表销售，眼镜销售（不含隐形眼镜），箱包销售，玩具、动漫及游艺用品销售，家用视听设备销售，通信设备销售，灯具销售，家具销售，互联网销售（除销售需要许可的商品）。（除许可业务外，可自主依法经营法律法规非禁止或限制的项目）',
      settlement_account: {
        account_name: '王启远',
        account_no: '6222031208011302474',
        bank_name: '中国工*银行总行清算中心',
        account_type: 'PERSONAL',
      },
      online_scene_url: 'https://juy.duxinyuan.help/',
    },
    overall_evaluation: {
      final_decision: 'MANUAL_REVIEW',
      confidence_score: 75,
      sub_scores: {
        kyc_status: 'WARNING',
        kyb_status: 'WARNING',
        risk_status: 'PASS',
      },
      conclusion: '共88项细粒度审核规则，其中66项通过，22项存疑需关注。虽然营业执照与法人身份证真实有效无涂抹，发票经国税平台验真合规，但申报线上WAP场景ICP备案主办单位为「平度市**洗衣店」，与申办商户完全不符，存在严重借壳跳板嫌疑；且网站仅为帮助文档工具，电商交易4探针（商品展示、订单管理、在线支付、实名认证）全部缺失；合作协议对手方存续异常。建议转人工审核并下发48小时限期举证核查函。',
    },
    audit_sections: {
      kyc: {
        status: 'WARNING',
        rules: [
          {
            rule_code: 'KYC-LICENSE-01',
            rule_basis: '电子营业执照规范',
            item_name: '是否为电子证照',
            result: 'WARNING',
            detail: '检测为电子证照，需进一步确认二维码有效性。证照右侧包含二维码及"电子营业执照文件仅供信息参考"字样，且左侧说明栏包含数字签名信息，符合电子营业执照特征。',
            related_target: '营业执照原图',
            weight: 0.8,
            compare_details: [
              { field_name: '电子印章与签名', ocr_value: '电子印章及签名信息完备', auth_value: '国家市场监管总局标准电子证照', is_matched: true },
              { field_name: '二维码有效性', ocr_value: '含防伪微缩二维码', auth_value: '待扫描联网验证', is_matched: false, diff_reason: '电子证照需人工扫码验证二维码实时状态' }
            ]
          },
          {
            rule_code: 'KYC-LICENSE-02',
            rule_basis: '营业执照核准时效',
            item_name: '是否最新版本',
            result: 'PASS',
            detail: '营业执照核准日期「2023-04-10」与市监局公示系统一致，为最新有效版本。',
            weight: 0.9,
          },
          {
            rule_code: 'KYC-LICENSE-03',
            rule_basis: '主体证照字段逐项对碰',
            item_name: '证照全要素双源对冲 (OCR识别 vs 工商底账)',
            result: 'WARNING',
            detail: '营业执照8项要素完全一致，但OCR未识别到营业期限截至日期（接口上送值为「长期」），需人工确认。',
            related_target: '营业执照要素',
            weight: 1.0,
            compare_details: [
              { field_name: '企业名称', ocr_value: '枝江市**百货店', auth_value: '枝江市**百货店', is_matched: true },
              { field_name: '统一社会信用代码', ocr_value: '92420583MACEQG4N01', auth_value: '92420583MACEQG4N01', is_matched: true },
              { field_name: '注册时间', ocr_value: '2023-04-10', auth_value: '2023-04-10', is_matched: true },
              { field_name: '截至日期', ocr_value: '未识别', auth_value: '长期', is_matched: false, diff_reason: "OCR未识别到'营业期限_止'，接口上送值为「长期」，需人工确认" },
              { field_name: '核准日期', ocr_value: '2023-04-10', auth_value: '2023-04-10', is_matched: true },
              { field_name: '成立日期', ocr_value: '2023-04-10', auth_value: '2023-04-10', is_matched: true },
              { field_name: '经营状态', ocr_value: '存续', auth_value: '在营（开业）', is_matched: true },
              { field_name: '注册地址', ocr_value: '湖北省宜昌市枝江市马家店街道民主大道以东七星大道以北电商产业园二楼976工位', auth_value: '湖北省宜昌市枝江市马家店街道民主大道以东七星大道以北电商产业园二楼976工位', is_matched: true },
              { field_name: '经营范围', ocr_value: '日用百货销售，服装服饰零售，鞋帽零售，化妆品零售，五金产品零售，互联网销售...', auth_value: '日用百货销售，服装服饰零售，鞋帽零售，化妆品零售，五金产品零售，互联网销售...', is_matched: true }
            ]
          },
          {
            rule_code: 'KYC-LEGAL-01',
            rule_basis: '居民身份证联网核查',
            item_name: '法代国籍与身份要素核验',
            result: 'PASS',
            detail: '法定代表人为中国大陆公民（CHN），二代居民身份证公安联网核验通过，人证比对一致。',
            weight: 1.0,
            compare_details: [
              { field_name: '姓名', ocr_value: '王启远', auth_value: '王启远', is_matched: true },
              { field_name: '公民身份号码', ocr_value: '422802198207272111', auth_value: '422802198207272111', is_matched: true },
              { field_name: '证件起始日期', ocr_value: '2022-12-30', auth_value: '2022-12-30', is_matched: true },
              { field_name: '证件截至日期', ocr_value: '2042-12-30', auth_value: '2042-12-30', is_matched: true }
            ]
          },
          {
            rule_code: 'KYC-SETTLE-01',
            rule_basis: '结算账户合规管理',
            item_name: '结算卡账户主体与卡号核验',
            result: 'WARNING',
            detail: '结算账号与开户行匹配，但结算材料OCR未识别到持卡人姓名，法代姓名为「王启远」，需人工核验实物卡照片。',
            weight: 0.85,
            compare_details: [
              { field_name: '账户名称 vs 企业名称', ocr_value: '未识别', auth_value: '王启远', is_matched: false, diff_reason: 'OCR未识别到持卡人姓名，法代姓名为「王启远」，需人工核验实物卡' },
              { field_name: '结算账号 vs 接口上送', ocr_value: '6222031208011302474', auth_value: '6222031208011302474', is_matched: true },
              { field_name: '开户行信息', ocr_value: '中国工*银行', auth_value: '中国工*银行总行清算中心', is_matched: true }
            ]
          },
          {
            rule_code: 'KYC-IMAGE-01',
            rule_basis: '证件图像防伪与水印白名单',
            item_name: '证照原件/复印件与PS篡改筛查',
            result: 'PASS',
            detail: '营业执照、身份证正反面、银行卡正反面经多模态AI检测，均为真实原件拍摄/扫描，未发现复印灰度失真或PS修图拼接，水印检测通过。',
            weight: 0.9
          }
        ]
      },
      kyb: {
        agreements: [
          {
            tab_id: 'agr-1',
            doc_name: '协议_合作协议',
            doc_type: '线上平台合作协议',
            doc_number: 'XY-HZ-2026-0802',
            summary_status: 'WARNING',
            audit_rules: [
              {
                rule_code: 'KYB-AGREE-00',
                rule_basis: '协议核验规范 §1.1',
                item_name: '协议类型与商户签署方核验',
                result: 'PASS',
                detail: '识别为合作协议；商户「枝江市**百货店」为签约主体之一，协议涉及线上平台技术开发与流量分成。',
                weight: 1.0,
                compare_details: [
                  { field_name: '商户签署方', ocr_value: '枝江市**百货店', auth_value: '枝江市**百货店', is_matched: true },
                  { field_name: '协议类型', ocr_value: '合作协议', auth_value: '合作协议', is_matched: true },
                  { field_name: '签署日期', ocr_value: '2026-08-02', auth_value: '距今17天 (合理)', is_matched: true }
                ]
              },
              {
                rule_code: 'KYB-AGREE-02',
                rule_basis: '合作方工商存续穿透',
                item_name: '合作对手方经营状态与资质穿透',
                result: 'WARNING',
                detail: '合作方「青岛**互联科技有限公司」在全国工商底账中查询异常（未找到存续企业信息），合作方真实履约能力存疑。',
                weight: 0.9,
                compare_details: [
                  { field_name: '合作方名称', ocr_value: '青岛**互联科技有限公司', auth_value: '未在全国企业信用系统检索到存续主体', is_matched: false, diff_reason: '合作方经营异常或公司名称不准确' }
                ]
              },
              {
                rule_code: 'KYB-AGREE-05',
                rule_basis: '协议场景与申报业务一致性',
                item_name: '应用场景契合度深度核验',
                result: 'WARNING',
                detail: '合同内容与申报线上网址「https://juy.duxinyuan.help/」严重脱节。该网址为帮助文档技术站点，无法承载合作协议约定之电商交易。',
                weight: 0.85
              }
            ]
          },
          {
            tab_id: 'agr-2',
            doc_name: '协议_采购合同',
            doc_type: '商品采购合同',
            doc_number: 'CG-2026-0716',
            doc_amount: '¥14,500.00',
            summary_status: 'WARNING',
            audit_rules: [
              {
                rule_code: 'KYB-AGREE-01',
                rule_basis: '采购合同要素审查',
                item_name: '采购标的与金额核验',
                result: 'PASS',
                detail: '采购品目为日用百货收纳杂品，合同总金额¥14,500.00，签署日期2026-07-16（距今34天合理）。',
                weight: 0.9
              },
              {
                rule_code: 'KYB-AGREE-02',
                rule_basis: '供货方主体工商状态',
                item_name: '供货对手方工商状态穿透',
                result: 'WARNING',
                detail: '供货方「平度启服装服饰销售店(个体工商户)」未查询到有效工商存续信息，疑似名称登记存在笔误或已注销。',
                weight: 0.85
              }
            ]
          },
          {
            tab_id: 'agr-3',
            doc_name: '协议_租赁合同',
            doc_type: '场地/仓储租赁合同',
            doc_number: 'ZL-2026-0403',
            summary_status: 'WARNING',
            audit_rules: [
              {
                rule_code: 'KYB-AGREE-03',
                rule_basis: '租赁合同出租方审查',
                item_name: '出租方主体与仓储资质',
                result: 'WARNING',
                detail: '出租方为个人「刘洋」，无法提供合规仓储经营资质或房屋权属证明；签署人王启远为商户法代。',
                weight: 0.75
              }
            ]
          }
        ],
        invoices: [
          {
            tab_id: 'inv-1',
            doc_name: '增值税普通发票 (No.26922000000913903546)',
            doc_type: '增值税普通发票（电子）',
            doc_number: '26922000000913903546',
            doc_amount: '¥14,500.00',
            summary_status: 'PASS',
            audit_rules: [
              {
                rule_code: 'KYB-INV-01',
                rule_basis: '国家税务总局全国发票查验平台直连',
                item_name: '发票真实性与有效性',
                result: 'PASS',
                detail: '经直连税务总局发票查验平台验证，发票状态为正常已开具，无红冲作废记录。',
                weight: 1.0,
                is_veto: true
              },
              {
                rule_code: 'KYB-INV-02',
                rule_basis: '三单对碰金额偏差率计算',
                item_name: '发票金额 vs 采购合同金额对冲',
                result: 'PASS',
                detail: '发票价税合计 ¥14,500.00 与采购合同约定价款 ¥14,500.00 完全一致（偏差 0.0%）。',
                weight: 0.9,
                compare_details: [
                  { field_name: '发票价税合计', ocr_value: '¥14,500.00', auth_value: '¥14,500.00', is_matched: true },
                  { field_name: '采购合同金额', ocr_value: '¥14,500.00', auth_value: '¥14,500.00', is_matched: true },
                  { field_name: '金额偏差率', ocr_value: '0.0%', auth_value: '<= 1.0%', is_matched: true }
                ]
              },
              {
                rule_code: 'KYB-INV-03',
                rule_basis: '税务总局商品税收分类编码',
                item_name: '开票品目与经营范围契合度',
                result: 'PASS',
                detail: '开票品目为「日用杂品、木制品」，税率 1%（符合小规模纳税人优惠税率），与营业执照百货零售经营范围相符。',
                weight: 0.8
              },
              {
                rule_code: 'KYB-INV-04',
                rule_basis: '购销双方主体穿透',
                item_name: '购销双方与合同对手一致性',
                result: 'PASS',
                detail: '购买方为申办商户「枝江市**百货店」，销售方为采购合同对手方「平度市鲸启服装服饰销售店」，三单闭环。',
                weight: 0.95
              }
            ]
          }
        ],
        venues: [
          {
            rule_code: 'KYB-VENUE-01',
            rule_basis: '线上电商类型商户场地审核规范',
            item_name: '线下实体门头与经营场地审核',
            result: 'INFO',
            detail: '商户申报为纯线上移动电商平台（WAP），无线下实体店铺，依据卡组织线上商户管理指引自动豁免实体场地审核。',
            weight: 0.0
          }
        ],
        scene_probe: [
          {
            rule_code: 'KYB-SCENE-01',
            rule_basis: '工信部ICP域名备案管理办法 §12',
            item_name: '网络场景ICP备案与主体一致性 (借壳穿透)',
            result: 'FAIL',
            detail: '工信部ICP备案查询正常（鲁ICP备2026000993号-3），但备案主办单位为「平度市**洗衣店」，与进件商户「枝江市**百货店」完全不一致！涉嫌借用其他商户备案域名挂靠入网！',
            related_target: 'https://juy.duxinyuan.help/',
            weight: 1.0,
            is_veto: true,
            compare_details: [
              { field_name: '申报网址', ocr_value: 'https://juy.duxinyuan.help/', auth_value: 'https://juy.duxinyuan.help/', is_matched: true },
              { field_name: 'ICP备案号', ocr_value: '鲁ICP备2026000993号-3', auth_value: '鲁ICP备2026000993号-3', is_matched: true },
              { field_name: '备案主办单位', ocr_value: '枝江市**百货店', auth_value: '平度市**洗衣店', is_matched: false, diff_reason: '备案主体与进件商户不一致，存在严重借壳跳板嫌疑！' },
              { field_name: '域名WHOIS归属', ocr_value: '未公开/个人隐私保护', auth_value: '信息不完整', is_matched: false, diff_reason: '域名所有者信息遮蔽，无法确认权属' }
            ]
          },
          {
            rule_code: 'KYB-SCENE-02',
            rule_basis: '网络销售主营业务一致性',
            item_name: '主营内容与经营范围匹配探针',
            result: 'WARNING',
            detail: '探针爬取目标网站页面DOM结构，该站点仅为个人搭建的技术帮助文档与工具类页面，未发现任何百货零售或实体商品交易功能。',
            weight: 0.95
          },
          {
            rule_code: 'KYB-SCENE-03',
            rule_basis: '电子商务交易平台基本规范',
            item_name: '电商交易 4 大核心功能探针',
            result: 'WARNING',
            detail: '自动化探针扫描目标WAP站点，未发现商品展示货架、未发现购物车/订单流转系统、未发现收银台在线支付入口、未发现会员实名注册机制，不具备电商运营能力。',
            weight: 0.9,
            compare_details: [
              { field_name: '商品展示货架', ocr_value: '缺失', auth_value: '应具备', is_matched: false, diff_reason: '页面仅有文档章节目录，无商品SKU展示' },
              { field_name: '订单交易管理', ocr_value: '缺失', auth_value: '应具备', is_matched: false, diff_reason: '未检测到购物车与下单系统' },
              { field_name: '在线支付入口', ocr_value: '缺失', auth_value: '应具备', is_matched: false, diff_reason: '未检测到支付网关接入' },
              { field_name: '用户实名注册', ocr_value: '缺失', auth_value: '应具备', is_matched: false, diff_reason: '未发现用户注册登录鉴权模块' }
            ]
          }
        ],
        reputation: [
          {
            rule_code: 'KYB-REPUT-01',
            rule_basis: '全网司法与舆情底线排查',
            item_name: '负面舆情、涉诉与被执行人全量排查',
            result: 'PASS',
            detail: '企业主体「枝江市**百货店」与法人王启远经全网大数据检索：无负面舆情、无涉诉文书、无行政处罚、无人行及法院失信被执行记录。',
            weight: 1.0
          }
        ]
      }
    },
    recommendation: {
      action: 'REQUIRE_MANUAL_REVIEW',
      focus_issues: [
        '【借壳高危】KYB-SCENE-01: 申报WAP域名ICP备案主办单位为「平度市**洗衣店」，与商户主体不符',
        '【交易缺失】KYB-SCENE-03: 网站无商品展示、无订单系统、无在线支付入口、无实名注册',
        '【业务脱节】KYB-SCENE-02: 申报百货零售，实际网站为帮助文档技术页面',
        '【合同对手】KYB-AGREE-02: 合作协议对手方青岛**互联在工商系统未检索到有效存续信息',
        '【结算核验】KYC-SETTLE-01: 结算银行卡材料OCR未提取到持卡人姓名，需人工复验'
      ],
      mitigation_conditions: [
        '收单机构在48小时内下发举证函，核实域名授权书或要求商户重新申报与主体一致之ICP备案域名',
        '要求收单机构实地或远程录屏抽检商户实际开展线上销售之交易系统与收银台',
        '补充提供合作对手方青岛**互联之真实工商营业执照与供销合作凭证',
        '上传清晰的银行卡实物照片与开户证明，核实持卡人为法人王启远本人'
      ]
    }
  }
];

