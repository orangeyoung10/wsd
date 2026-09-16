import React, { useState } from 'react';
import {
  FileSearch,
  DatabaseZap,
  Globe,
  Calculator,
  FileOutput,
  Play,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PipelineStage } from '../types';

interface WorkflowOrchestratorViewProps {
  currentDecision: string;
  confidenceScore: number;
  totalExecutionMs: number;
  onRunSimulation?: () => void;
  isRunning?: boolean;
}

export const WorkflowOrchestratorView: React.FC<WorkflowOrchestratorViewProps> = ({
  currentDecision,
  confidenceScore,
  totalExecutionMs,
  onRunSimulation,
  isRunning = false,
}) => {
  const [showStageDetails, setShowStageDetails] = useState(false);

  const stages: PipelineStage[] = [
    {
      id: 1,
      key: 'stage-1',
      name: '阶段一：材料提取与鉴真',
      description: 'OCR结构化识别、CV图像防伪、EXIF/GPS解析与文本NLP',
      status: 'COMPLETED',
      duration_ms: Math.round(totalExecutionMs * 0.28),
      tools: ['PaddleOCR', 'CV-ELA-Model', 'EXIF-Parser', 'NLP-Contract-Analyzer'],
      findings_count: { pass: 8, warning: 1, fail: currentDecision === 'FAIL' ? 1 : 0 },
    },
    {
      id: 2,
      key: 'stage-2',
      name: '阶段二：三方数据交叉核验',
      description: '工商底账直连、国税发票验真、司法失信被执行人与负面舆情',
      status: 'COMPLETED',
      duration_ms: Math.round(totalExecutionMs * 0.32),
      tools: ['工商底账API', '国税总局查验', '最高法失信库', '全网舆情爬虫'],
      findings_count: { pass: 6, warning: 0, fail: currentDecision === 'FAIL' ? 2 : 0 },
    },
    {
      id: 3,
      key: 'stage-3',
      name: '阶段三：网络场景动态探测',
      description: '工信部ICP备案探测、无头浏览器动态抓取、支付闭环、逆向搜图',
      status: 'COMPLETED',
      duration_ms: Math.round(totalExecutionMs * 0.24),
      tools: ['Headless Chrome', 'ICP-Whois-Probe', 'Payment-SDK-Detector', 'pHash-Search'],
      findings_count: { pass: 5, warning: 1, fail: currentDecision === 'FAIL' ? 1 : 0 },
    },
    {
      id: 4,
      key: 'stage-4',
      name: '阶段四：规则与评分引擎 (RE)',
      description: '30+原子规则匹配、三流合一一致性校验、权重与置信度打分',
      status: 'COMPLETED',
      duration_ms: Math.round(totalExecutionMs * 0.1),
      tools: ['MAAP-Risk-Evaluator', 'Drools-Rule-Engine', 'Veto-Filter'],
      findings_count: { pass: 20, warning: 2, fail: currentDecision === 'FAIL' ? 4 : 0 },
    },
    {
      id: 5,
      key: 'stage-5',
      name: '阶段五：审核报告与业务决策',
      description: '落地JSON存储、可视化样板报告渲染、触发B端Webhook回调',
      status: 'COMPLETED',
      duration_ms: Math.round(totalExecutionMs * 0.06),
      tools: ['JSON-Store', 'Report-Renderer', 'Webhook-Dispatcher'],
      findings_count: { pass: 1, warning: 0, fail: 0 },
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>进件审核流水线状态 (Audit Workflow Engine)</span>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                {isRunning ? '正在异步跑批...' : '全链路已完成 (100%)'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              进件接入 → 异步流水线解耦 → 多维 AI/数据并联处理 → 规则引擎评分 → 综合判定
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRunSimulation}
            disabled={isRunning}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              isRunning
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? '正在跑批...' : '重新执行流水线'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowStageDetails(!showStageDetails)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200"
            title="查看或收起执行引擎明细"
          >
            {showStageDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 5-Stage Stepper View */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {stages.map((stage, idx) => {
          const iconMap = [
            <FileSearch key={1} className="w-4 h-4" />,
            <DatabaseZap key={2} className="w-4 h-4" />,
            <Globe key={3} className="w-4 h-4" />,
            <Calculator key={4} className="w-4 h-4" />,
            <FileOutput key={5} className="w-4 h-4" />,
          ];

          return (
            <div
              key={stage.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isRunning
                  ? 'border-slate-200 bg-slate-50/70 animate-pulse'
                  : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {stage.duration_ms}ms
                </span>
              </div>

              <div className="font-semibold text-xs text-slate-900 mb-1 line-clamp-1">
                {stage.name}
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2">
                {stage.description}
              </div>

              {/* Tools chips */}
              <div className="flex flex-wrap gap-1">
                {stage.tools.slice(0, 2).map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
                {stage.tools.length > 2 && (
                  <span className="text-[10px] text-slate-400">+{stage.tools.length - 2}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Engine Architecture Logs */}
      {showStageDetails && (
        <div className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono space-y-2">
          <div className="text-slate-400 flex items-center justify-between pb-1 border-b border-slate-800">
            <span>AUDIT DISPATCH TRACE LOGS (Task ID: TID-882194)</span>
            <span className="text-emerald-400">STATUS: ACTIVE</span>
          </div>
          <p className="text-slate-300">
            [00:00.012] [Gateway] Received merchant application payload. Generated trace: <span className="text-amber-300">TR-HZ-2026-09941</span>
          </p>
          <p className="text-slate-300">
            [00:00.089] [Orchestrator] Fan-out parallel tasks to RabbitMQ topic exchange <span className="text-blue-400">audit.workflow.pipeline</span>
          </p>
          <p className="text-slate-300">
            [00:00.510] [Stage-1 Worker] PaddleOCR completed for license & legal ID. ELA pixel forensic variance check: PASS.
          </p>
          <p className="text-slate-300">
            [00:01.120] [Stage-2 Worker] Cross-checked SAMR national enterprise database & SAT invoice verification API. 0 latency anomalies.
          </p>
          <p className="text-slate-300">
            [00:01.590] [Stage-3 Worker] Headless Chrome loaded URL. ICP record host parsed. Reverse image search hash computation: 0 external stolen hits.
          </p>
          <p className="text-slate-300">
            [00:01.820] [Stage-4 RuleEngine] Evaluated 30 atomic rules. Veto rules check: {currentDecision === 'FAIL' ? 'TRIGGERED VETO' : 'CLEARED'}. Final Score: <span className="text-emerald-400 font-bold">{confidenceScore}</span>
          </p>
          <p className="text-slate-300">
            [00:01.840] [Stage-5 Webhook] Audit report stored in JSON format. Webhook emitted to client callback URL.
          </p>
        </div>
      )}
    </div>
  );
};
