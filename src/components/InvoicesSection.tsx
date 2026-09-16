import React from 'react';
import { DocTabItem } from '../types';
import { ReportTabContainer } from './ReportTabContainer';
import { Receipt, CheckCircle2, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

interface InvoicesSectionProps {
  invoices: DocTabItem[];
}

export const InvoicesSection: React.FC<InvoicesSectionProps> = ({ invoices }) => {
  const hasFail = invoices.some((inv) =>
    inv.audit_rules.some((r) => r.result === 'FAIL')
  );
  const hasWarning = invoices.some((inv) =>
    inv.audit_rules.some((r) => r.result === 'WARNING')
  );

  return (
    <div id="sec-invoices" className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              KYB 贸易背景发票查验 (KYB Invoices & Tax Verification)
            </h2>
            <p className="text-xs text-slate-500">
              国家税务总局全国增值税发票查验平台直连、购销双方税号对冲、三流合一
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasFail ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              涉伪造/废票拦截 (FAIL)
            </span>
          ) : hasWarning ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              发票存在差异 (WARNING)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              国税查验一致 (PASS)
            </span>
          )}
        </div>
      </div>

      <ReportTabContainer items={invoices} type="invoice" />
    </div>
  );
};
