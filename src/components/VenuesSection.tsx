import React from 'react';
import { RuleAuditItem } from '../types';
import { CompareCard } from './CompareCard';
import { MapPin, CheckCircle2, AlertTriangle, XCircle, Navigation, Search } from 'lucide-react';

interface VenuesSectionProps {
  venues: RuleAuditItem[];
}

export const VenuesSection: React.FC<VenuesSectionProps> = ({ venues }) => {
  const hasFail = venues.some((v) => v.result === 'FAIL');
  const hasWarning = venues.some((v) => v.result === 'WARNING');

  return (
    <div id="sec-venues" className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              KYB 实体场地合规核验 (Physical Venues & Geolocation)
            </h2>
            <p className="text-xs text-slate-500">
              门头牌匾文字OCR、EXIF拍摄相机与GPS经纬度解析、地理围栏对齐、反向图像图库搜图排查
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasFail ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              场地核验异常 (FAIL)
            </span>
          ) : hasWarning ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              GPS缺失待人工考察 (WARNING)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              实地实拍一致 (PASS)
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {venues.map((rule) => (
          <CompareCard key={rule.rule_code} rule={rule} />
        ))}
      </div>
    </div>
  );
};
