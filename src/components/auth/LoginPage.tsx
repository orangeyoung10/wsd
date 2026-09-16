import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import {
  ShieldAlert,
  User,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<'STANDARD' | 'QUICK'>('QUICK');
  const [username, setUsername] = useState('auditor_lead');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('请输入登录账号');
      return;
    }
    const success = login(username, password);
    if (!success) {
      setErrorMessage('账号或密码不正确');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 selection:bg-blue-600 selection:text-white font-sans">
      {/* Left Brand Area (Domestic Enterprise Visual) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-tight">MAAP 商户智能审核中台</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded">
                企业专业版
              </span>
            </div>
            <p className="text-xs text-slate-400">Merchant AI Audit Platform · 生产环境</p>
          </div>
        </div>

        {/* Middle Feature Cards */}
        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <div className="space-y-2">
            <h1 className="text-2xl xl:text-3xl font-bold tracking-tight text-white leading-tight">
              针对不同商户业态，<br />
              执行差异化多维 AI 智能审核
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              根据线上电商、线下实体门店、跨境贸易等不同场景，自动路由专属审核流水线，支持自定义审核规则权重与人工协同复核。
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">线上商户专项核验</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  工信部ICP备案全等穿透、动态爬虫探针、支付跳转跑分防范
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">线下实体商户专项核验</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  门头招牌倾斜OCR识别、高精GIS空间围栏核对、实景防盗图排查
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">规则引擎与权重配置</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  灵活调整分项权重、一票否决强阻断、实时算分沙箱模拟
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Safety Text */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-slate-500">
          <KeyRound className="w-3.5 h-3.5" />
          <span>金融级传输加密 · 全量操作防篡改审计存证</span>
        </div>
      </div>

      {/* Right Login Box */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-950/80">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Brand Title */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base">MAAP 商户智能审核中台</span>
              <p className="text-xs text-slate-400">Merchant AI Audit Platform</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white">系统登录</h2>
            <p className="text-xs text-slate-400">请选择身份快捷登入或使用业务账号密码登录</p>
          </div>

          {/* Login Tabs */}
          <div className="flex border-b border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('QUICK')}
              className={`pb-3 px-4 transition-colors relative ${
                activeTab === 'QUICK'
                  ? 'text-blue-400 font-semibold border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span>演示身份快捷登录</span>
              <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-blue-500/20 text-blue-300">
                推荐
              </span>
            </button>
            <button
              onClick={() => setActiveTab('STANDARD')}
              className={`pb-3 px-4 transition-colors relative ${
                activeTab === 'STANDARD'
                  ? 'text-blue-400 font-semibold border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span>账号密码登录</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Tab 1: Quick Role Switcher Login */}
          {activeTab === 'QUICK' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">点击以下预设角色即可一键登录系统作业环境：</p>

              {DEMO_USERS.map((user) => (
                <div
                  key={user.id}
                  onClick={() => quickLogin(user)}
                  className="p-3.5 rounded-xl border border-slate-800 hover:border-blue-500/80 bg-slate-900 hover:bg-blue-950/30 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                      {user.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs">{user.name}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-500/20 text-purple-300'
                            : user.role === 'SENIOR_AUDITOR'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {user.role_name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{user.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-slate-500 group-hover:text-blue-400 transition-colors">
                    <span className="text-xs mr-1 hidden sm:inline">直接进入</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Tab 2: Standard Username/Password Form */
            <form onSubmit={handleStandardSubmit} className="space-y-4">
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-medium">登录账号 / 员工工号</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="请输入用户名（如 auditor_lead）"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-medium">登录密码</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入登录密码"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-0"
                  />
                  <span>记住账号状态</span>
                </label>
                <a href="#reset" onClick={(e) => { e.preventDefault(); alert('请联系企业系统管理员重置密码'); }} className="text-blue-400 hover:underline">
                  忘记密码?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>立即登录作业</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
            MAAP 商户智能 AI 审核平台 · 国内收单风控作业专属系统
          </div>
        </div>
      </div>
    </div>
  );
};
