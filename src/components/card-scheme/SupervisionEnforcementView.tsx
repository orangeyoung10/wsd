import React, { useState } from 'react';
import { SupervisionSweepTask, ComplianceWorkOrder } from '../../types';
import { DEMO_SWEEP_TASKS, DEMO_WORK_ORDERS } from '../../data/cardSchemeData';
import {
  Zap,
  FileCheck2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Play,
  PlusCircle,
  Building2,
  Ban,
  Search,
  Timer,
  Send,
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

interface SupervisionEnforcementViewProps {
  initialSubTab?: 'SWEEP_TASKS' | 'DISPATCH_WORKORDERS';
}

export const SupervisionEnforcementView: React.FC<SupervisionEnforcementViewProps> = ({
  initialSubTab = 'SWEEP_TASKS',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'SWEEP_TASKS' | 'DISPATCH_WORKORDERS'>(initialSubTab);
  const [tasks, setTasks] = useState<SupervisionSweepTask[]>(DEMO_SWEEP_TASKS);
  const [workOrders, setWorkOrders] = useState<ComplianceWorkOrder[]>(DEMO_WORK_ORDERS);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New task form state
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskScope, setNewTaskScope] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateSweepTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    const createdTask: SupervisionSweepTask = {
      id: `SWEEP-00${tasks.length + 1}`,
      task_name: newTaskName,
      task_type: 'SPECIAL_INSPECTION',
      target_scope: newTaskScope || '全网近30天申报商户多模态交叉排查',
      total_scanned: 15600,
      suspicious_count: 142,
      blocked_count: 31,
      created_by: '卡组织风控监管处',
      created_at: '2026-09-12',
      status: 'RUNNING',
      progress: 35,
      findings_summary: '系统已调度分布式探针集群启动多维图谱与市监底账比对。',
    };

    setTasks([createdTask, ...tasks]);
    setShowNewTaskModal(false);
    setNewTaskName('');
    setNewTaskScope('');
    showToast(`已成功启动【${createdTask.task_name}】分布式飞行检查任务！`);
  };

  const handleBlacklistWorkOrder = (id: string, merchantName: string, acqName: string) => {
    setWorkOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: 'BLACK_LISTED' as const,
              response_content: '卡组织已裁决：证据不成立。商户予以全网黑名单清退，对该收单机构合规扣 10 分。',
            }
          : o
      )
    );
    showToast(`工单已裁决：已对【${merchantName}】执行全网拉黑，并对【${acqName}】扣减合规积分 10 分！`);
  };

  const handleClearWorkOrder = (id: string, merchantName: string) => {
    setWorkOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: 'CONFIRMED_CLEARED' as const,
              response_content: '经现场核查与水电单核验无误，解除违规嫌疑。',
            }
          : o
      )
    );
    showToast(`已确认【${merchantName}】补充举证材料真实有效，予以销案解除关注！`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>卡组织监管中枢</span>
            <span>/</span>
            <span className="text-blue-600 font-semibold">专项抽检与问责</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            非现场专项飞行检查与收单机构限期举证工单
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            针对高风险行业与异常收单机构发起全网分布式定向大抽检，对疑似商户下发 48 小时举证核查函，形成闭环整改机制。
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'SWEEP_TASKS' && (
            <button
              type="button"
              onClick={() => setShowNewTaskModal(true)}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>新建专项抽检任务</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveSubTab('SWEEP_TASKS')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeSubTab === 'SWEEP_TASKS'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>飞行检查专项任务 ({tasks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('DISPATCH_WORKORDERS')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeSubTab === 'DISPATCH_WORKORDERS'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>机构疑点举证工单 (48h倒计时)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono">
            {workOrders.filter((w) => w.status === 'AWAITING_EVIDENCE').length} 待反馈
          </span>
        </button>
      </div>

      {/* 1. Sweep Tasks Sub-Tab */}
      {activeSubTab === 'SWEEP_TASKS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.task_type === 'SPECIAL_INSPECTION'
                            ? 'bg-blue-100 text-blue-800'
                            : task.task_type === 'REGULATORY_CAMPAIGN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {task.task_type === 'SPECIAL_INSPECTION'
                          ? '行业专项检查'
                          : task.task_type === 'REGULATORY_CAMPAIGN'
                          ? '监管攻坚清网'
                          : '常态化数字巡检'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{task.task_name}</h3>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      创建方: {task.created_by} · 启动日期: {task.created_at}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                        task.status === 'RUNNING'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {task.status === 'RUNNING' ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping mr-1" />
                          巡检执行中 ({task.progress}%)
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          已完成归档
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>覆盖范围: {task.target_scope}</span>
                    <span className="font-mono">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <div>
                    <div className="text-slate-400 text-[10px]">已穿透扫描商户</div>
                    <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                      {task.total_scanned.toLocaleString()} 户
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">检出疑似违规</div>
                    <div className="text-base font-bold font-mono text-amber-600 mt-0.5">
                      {task.suspicious_count} 户
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">触发全网熔断阻断</div>
                    <div className="text-base font-bold font-mono text-rose-600 mt-0.5">
                      {task.blocked_count} 户
                    </div>
                  </div>
                </div>

                {/* Findings */}
                <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800">最新检查研判摘要:</span>
                  <span>{task.findings_summary}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Dispatch Workorders Sub-Tab */}
      {activeSubTab === 'DISPATCH_WORKORDERS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {workOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs">
                        {order.work_order_no}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{order.merchant_name}</h3>
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-600 font-medium">{order.acquirer_name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      下发时间: {order.dispatch_time} · 限期举证截止: {order.deadline_time}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === 'AWAITING_EVIDENCE' && (
                      <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-300 font-mono font-bold flex items-center gap-1.5 text-xs">
                        <Timer className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                        举证倒计时: {order.hours_remaining} 小时
                      </span>
                    )}
                    {order.status === 'UNDER_REVIEW' && (
                      <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-300 font-bold text-xs">
                        机构已反馈 · 待卡组织复核
                      </span>
                    )}
                    {order.status === 'BLACK_LISTED' && (
                      <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-800 border border-rose-300 font-bold text-xs">
                        已违规全网拉黑
                      </span>
                    )}
                    {order.status === 'CONFIRMED_CLEARED' && (
                      <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs">
                        举证属实 · 予以放行
                      </span>
                    )}
                  </div>
                </div>

                {/* Violation description */}
                <div className="p-3.5 rounded-lg bg-rose-50/70 border border-rose-200 space-y-1">
                  <div className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>违规核查事由：{order.violation_type}</span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed">{order.issue_description}</p>
                </div>

                {/* Acquirer Response */}
                {order.response_content && (
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-semibold text-slate-800 text-xs">
                      收单机构举证与处置反馈说明：
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{order.response_content}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  {order.status !== 'BLACK_LISTED' && (
                    <button
                      type="button"
                      onClick={() =>
                        handleBlacklistWorkOrder(order.id, order.merchant_name, order.acquirer_name)
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>裁定违规 · 全网拉黑并扣减机构分</span>
                    </button>
                  )}

                  {order.status !== 'CONFIRMED_CLEARED' && order.status !== 'BLACK_LISTED' && (
                    <button
                      type="button"
                      onClick={() => handleClearWorkOrder(order.id, order.merchant_name)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>认可举证 · 解除督办</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Sweep Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">创建全网专项飞行检查巡检任务</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSweepTask} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800">专项任务名称</label>
                <input
                  type="text"
                  required
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="如：2026秋季华南地区零售超市套码违规清查"
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800">目标排查范围与筛选条件</label>
                <textarea
                  rows={3}
                  value={newTaskScope}
                  onChange={(e) => setNewTaskScope(e.target.value)}
                  placeholder="如：近 60 天申报为 5411 超市且注册资本低于 20 万的商户，覆盖拉**、汇*天下、恒*通达全部报备数据。"
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-800 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  分布式并发扫描机制：
                </div>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  系统将调度卡组织图谱引擎、工信部域名探针及实景反向图片指纹库，异步并行扫描数万家在网商户。
                </p>
              </div>

              <div className="px-0 pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>立即启动全网排查</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
