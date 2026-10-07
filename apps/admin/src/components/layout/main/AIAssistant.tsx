'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  RefreshCw,
  Package,
  Send,
  Zap,
  Sliders,
  Check,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function AIAssistant() {
  const { t, language } = useTranslation();
  const [enabledRules, setEnabledRules] = useState<Record<string, boolean>>({
    'rule-1': true,
    'rule-2': true,
    'rule-3': true,
    'rule-4': true,
  });
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const toggleRule = (id: string) => {
    setEnabledRules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const runQuickAction = (actionKey: string, successMsg: string) => {
    setRunningAction(actionKey);
    setTimeout(() => {
      setRunningAction(null);
      setActionSuccess(successMsg);
      setTimeout(() => setActionSuccess(null), 3000);
    }, 800);
  };

  const rules = [
    {
      id: 'rule-1',
      name: t.ruleOrderNotificationName,
      description: t.ruleOrderNotificationDesc,
      trigger: t.ruleOrderNotificationTrigger,
      enabled: !!enabledRules['rule-1'],
    },
    {
      id: 'rule-2',
      name: t.ruleLowStockName,
      description: t.ruleLowStockDesc,
      trigger: t.ruleLowStockTrigger,
      enabled: !!enabledRules['rule-2'],
    },
    {
      id: 'rule-3',
      name: t.ruleChannelDraftName,
      description: t.ruleChannelDraftDesc,
      trigger: t.ruleChannelDraftTrigger,
      enabled: !!enabledRules['rule-3'],
    },
    {
      id: 'rule-4',
      name: t.ruleRestockCancelName,
      description: t.ruleRestockCancelDesc,
      trigger: t.ruleRestockCancelTrigger,
      enabled: !!enabledRules['rule-4'],
    },
  ];

  const enabledCount = rules.filter((r) => r.enabled).length;

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-7 lg:p-8 max-w-[1100px] w-full mx-auto">
      {/* Feedback Toast */}
      {actionSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-[12px] bg-[#1C1B19] px-4 py-3 text-[13px] font-medium text-white shadow-xl animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="font-['Fraunces',Georgia,serif] text-[24px] sm:text-[28px] font-[650] tracking-[-0.02em] text-[var(--text)]">
            {t.smartAssistantTitle}
          </h1>
          <span className="rounded-full bg-[var(--surface-soft)] border border-[var(--border)] px-2.5 py-0.5 text-[11.5px] font-semibold text-[var(--accent)]">
            {t.activeBadge}
          </span>
        </div>
        <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] mt-0.5">
          {t.smartAssistantSubtitle}
        </p>
      </div>

      {/* Quick Action Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col justify-between rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--accent-soft)] text-[var(--accent)]">
              <Package className="h-4 w-4" />
            </div>
            <span className="font-semibold text-[13.5px] text-[var(--text)]">{t.inventoryAuditTitle}</span>
          </div>
          <p className="text-[12.5px] text-[var(--text-secondary)] my-2.5">
            {t.inventoryAuditDesc}
          </p>
          <button
            type="button"
            disabled={runningAction === 'audit'}
            onClick={() => runQuickAction('audit', t.auditSuccessMsg)}
            className="inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-soft)] py-1.5 text-[12.5px] font-semibold text-[var(--text)] hover:bg-[var(--surface-sunken)] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${runningAction === 'audit' ? 'animate-spin' : ''}`} />
            <span>{runningAction === 'audit' ? t.runningAuditStatus : t.runAuditBtn}</span>
          </button>
        </div>

        <div className="flex flex-col justify-between rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EBF2F9] text-[#1E5F8B]">
              <Send className="h-4 w-4" />
            </div>
            <span className="font-semibold text-[13.5px] text-[var(--text)]">{t.channelSyncTitle}</span>
          </div>
          <p className="text-[12.5px] text-[var(--text-secondary)] my-2.5">
            {t.channelSyncDesc}
          </p>
          <button
            type="button"
            disabled={runningAction === 'channel'}
            onClick={() => runQuickAction('channel', t.channelSyncSuccessMsg)}
            className="inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-soft)] py-1.5 text-[12.5px] font-semibold text-[var(--text)] hover:bg-[var(--surface-sunken)] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${runningAction === 'channel' ? 'animate-spin' : ''}`} />
            <span>{runningAction === 'channel' ? t.syncingChannelStatus : t.syncChannelBtn}</span>
          </button>
        </div>

        <div className="flex flex-col justify-between rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#FEF6E9] text-[#965A1A]">
              <Zap className="h-4 w-4" />
            </div>
            <span className="font-semibold text-[13.5px] text-[var(--text)]">{t.healthCheckTitle}</span>
          </div>
          <p className="text-[12.5px] text-[var(--text-secondary)] my-2.5">
            {t.healthCheckDesc}
          </p>
          <button
            type="button"
            disabled={runningAction === 'health'}
            onClick={() => runQuickAction('health', t.healthCheckSuccessMsg)}
            className="inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-soft)] py-1.5 text-[12.5px] font-semibold text-[var(--text)] hover:bg-[var(--surface-sunken)] transition-colors disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
            <span>{runningAction === 'health' ? t.checkingHealthStatus : t.checkHealthBtn}</span>
          </button>
        </div>
      </div>

      {/* Configured Automation Rules */}
      <div className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[var(--accent)]" />
            <h2 className="font-['Fraunces',Georgia,serif] text-[18px] font-[650] text-[var(--text)]">
              {t.workflowRulesTitle}
            </h2>
          </div>
          <span className="text-[12px] text-[var(--text-tertiary)]">
            {language === 'uk' ? `${enabledCount} ${t.rulesEnabledOf} ${rules.length}` : `${enabledCount} ${t.rulesEnabledOf} ${rules.length} enabled`}
          </span>
        </div>

        <div className="flex flex-col divide-y divide-[var(--border)]">
          {rules.map((rule) => (
            <div key={rule.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
              <div className="flex flex-col min-w-0 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[14px] text-[var(--text)]">{rule.name}</span>
                  <span className="font-mono text-[11px] rounded bg-[var(--surface-soft)] border border-[var(--border)] px-2 py-0.5 text-[var(--text-secondary)]">
                    {rule.trigger}
                  </span>
                </div>
                <p className="text-[13px] text-[var(--text-secondary)] mt-1">
                  {rule.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleRule(rule.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    rule.enabled ? 'bg-[var(--accent)]' : 'bg-[#D0CCC2]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      rule.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
