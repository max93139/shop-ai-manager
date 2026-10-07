'use client';

import React, { useState } from 'react';
import {
  Workflow,
  CheckCircle2,
  Bell,
  RefreshCw,
  Package,
  Send,
  Zap,
  Sliders,
  Check,
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  enabled: boolean;
  category: 'inventory' | 'orders' | 'telegram';
}

const defaultRules: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'Instant Order Telegram Notification',
    description: 'Send direct alert to manager Telegram chat when a customer completes checkout.',
    trigger: 'On Order Created',
    enabled: true,
    category: 'orders',
  },
  {
    id: 'rule-2',
    name: 'Low Stock Auto-Warning',
    description: 'Trigger low stock warning badge and notification when any variant drops to <= 5 units.',
    trigger: 'On Stock <= Threshold',
    enabled: true,
    category: 'inventory',
  },
  {
    id: 'rule-3',
    name: 'Automatic Channel Post Drafting',
    description: 'Prepare ready-to-publish Telegram channel draft whenever a new product is saved in Storage.',
    trigger: 'On Product Creation',
    enabled: true,
    category: 'telegram',
  },
  {
    id: 'rule-4',
    name: 'Automatic Inventory Restoration on Cancellation',
    description: 'Restock product variant quantity if an order is marked as Cancelled.',
    trigger: 'On Order Status = CANCELLED',
    enabled: true,
    category: 'orders',
  },
];

export default function AIAssistant() {
  const [rules, setRules] = useState<AutomationRule[]>(defaultRules);
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const runQuickAction = (actionKey: string, successMsg: string) => {
    setRunningAction(actionKey);
    setTimeout(() => {
      setRunningAction(null);
      setActionSuccess(successMsg);
      setTimeout(() => setActionSuccess(null), 3000);
    }, 800);
  };

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
            Smart Assistant & Automation
          </h1>
          <span className="rounded-full bg-[var(--surface-soft)] border border-[var(--border)] px-2.5 py-0.5 text-[11.5px] font-semibold text-[var(--accent)]">
            Active
          </span>
        </div>
        <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] mt-0.5">
          Automated rules, inventory sync jobs, and store workflow triggers
        </p>
      </div>

      {/* Quick Action Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col justify-between rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--accent-soft)] text-[var(--accent)]">
              <Package className="h-4 w-4" />
            </div>
            <span className="font-semibold text-[13.5px] text-[var(--text)]">Inventory Audit</span>
          </div>
          <p className="text-[12.5px] text-[var(--text-secondary)] my-2.5">
            Verify variant stocks against confirmed orders and update low-stock alerts.
          </p>
          <button
            type="button"
            disabled={runningAction === 'audit'}
            onClick={() => runQuickAction('audit', 'Inventory audit finished. Stocks verified.')}
            className="inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-soft)] py-1.5 text-[12.5px] font-semibold text-[var(--text)] hover:bg-[var(--surface-sunken)] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${runningAction === 'audit' ? 'animate-spin' : ''}`} />
            <span>{runningAction === 'audit' ? 'Auditing…' : 'Run Audit'}</span>
          </button>
        </div>

        <div className="flex flex-col justify-between rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#EBF2F9] text-[#1E5F8B]">
              <Send className="h-4 w-4" />
            </div>
            <span className="font-semibold text-[13.5px] text-[var(--text)]">Telegram Channel Sync</span>
          </div>
          <p className="text-[12.5px] text-[var(--text-secondary)] my-2.5">
            Sync latest product availability status to your linked Telegram channel.
          </p>
          <button
            type="button"
            disabled={runningAction === 'channel'}
            onClick={() => runQuickAction('channel', 'Channel catalog synchronized.')}
            className="inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-soft)] py-1.5 text-[12.5px] font-semibold text-[var(--text)] hover:bg-[var(--surface-sunken)] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${runningAction === 'channel' ? 'animate-spin' : ''}`} />
            <span>{runningAction === 'channel' ? 'Syncing…' : 'Sync Channel'}</span>
          </button>
        </div>

        <div className="flex flex-col justify-between rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#FEF6E9] text-[#965A1A]">
              <Zap className="h-4 w-4" />
            </div>
            <span className="font-semibold text-[13.5px] text-[var(--text)]">Health Verification</span>
          </div>
          <p className="text-[12.5px] text-[var(--text-secondary)] my-2.5">
            Test database latency, worker Redis queue, and bot webhook responsiveness.
          </p>
          <button
            type="button"
            disabled={runningAction === 'health'}
            onClick={() => runQuickAction('health', 'All systems operational: DB, Bot, API OK.')}
            className="inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-soft)] py-1.5 text-[12.5px] font-semibold text-[var(--text)] hover:bg-[var(--surface-sunken)] transition-colors disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
            <span>{runningAction === 'health' ? 'Checking…' : 'Check Health'}</span>
          </button>
        </div>
      </div>

      {/* Configured Automation Rules */}
      <div className="flex flex-col rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[var(--accent)]" />
            <h2 className="font-['Fraunces',Georgia,serif] text-[18px] font-[650] text-[var(--text)]">
              Workflow Rules
            </h2>
          </div>
          <span className="text-[12px] text-[var(--text-tertiary)]">
            {rules.filter((r) => r.enabled).length} of {rules.length} enabled
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
