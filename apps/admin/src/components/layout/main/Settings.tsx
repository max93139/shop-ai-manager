'use client';

import React, { useState, useEffect } from 'react';
import {
  Store,
  Send,
  Bell,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Key,
  Globe,
  Smartphone,
  Mail,
  Building,
} from 'lucide-react';
import type { StoreSettings } from '@shop-ai/types';

const defaultSettings: StoreSettings = {
  storeName: 'Atelier Premium Clothing',
  supportPhone: '+380 (67) 123-45-67',
  supportEmail: 'support@atelier-store.ua',
  currency: 'UAH',
  timezone: 'Europe/Kyiv (UTC+3)',
  telegramChannel: '@shop_channel',
  telegramBotTokenSet: true,
  autoPublishNewProducts: true,
  telegramAdminId: '98451294',
  lowStockThreshold: 5,
  soundAlerts: true,
  autoArchiveCompleted: false,
};

export default function Settings() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'profile' | 'telegram' | 'inventory' | 'security'>('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Security password fields
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('shop_manager_settings');
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      localStorage.setItem('shop_manager_settings', JSON.stringify(settings));
      setTimeout(() => {
        setIsSaving(false);
        showToast('Settings saved successfully!');
      }, 300);
    } catch (err) {
      setIsSaving(false);
      console.error('Failed to save settings:', err);
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.newPassword || passwords.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError(null);
    showToast('Admin password updated successfully');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-7 lg:p-8 max-w-[1100px] w-full mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-[12px] bg-[#1C1B19] px-4 py-3 text-[13px] font-medium text-white shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-['Fraunces',Georgia,serif] text-[24px] sm:text-[28px] font-[650] tracking-[-0.02em] text-[var(--text)]">
            Store Settings
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] mt-0.5">
            Store configuration, Telegram channel automation, inventory triggers, and security
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-sm transition-all hover:bg-[var(--accent-hover)] active:scale-[0.98] disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[var(--border)]">
        {[
          { key: 'profile', label: 'Store Profile', icon: Store },
          { key: 'telegram', label: 'Telegram & Channels', icon: Send },
          { key: 'inventory', label: 'Inventory & Alerts', icon: Bell },
          { key: 'security', label: 'Security & Profile', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`inline-flex items-center gap-2 rounded-t-[8px] px-4 py-2.5 text-[13px] font-semibold transition-all select-none border-b-2 -mb-[1px] whitespace-nowrap ${
                isActive
                  ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--surface-soft)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-soft)]/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 shadow-[0_2px_8px_rgba(28,27,25,0.03)]">
        {/* Tab 1: Store Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-[700px]">
            <div>
              <h2 className="font-['Fraunces',Georgia,serif] text-[18px] font-[650] text-[var(--text)]">
                General Store Information
              </h2>
              <p className="text-[13px] text-[var(--text-secondary)]">
                Brand details visible to customers in Telegram receipts and notifications
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">Store Name</label>
                <div className="relative">
                  <Building className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 pl-9 pr-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                    placeholder="e.g. Atelier Store"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">Support Phone</label>
                <div className="relative">
                  <Smartphone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 pl-9 pr-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                    placeholder="+380..."
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">Support Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 pl-9 pr-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                    placeholder="support@..."
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">Default Store Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 px-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="UAH">Ukrainian Hryvnia (₴ UAH)</option>
                  <option value="USD">US Dollar ($ USD)</option>
                  <option value="EUR">Euro (€ EUR)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">Store Timezone</label>
                <div className="relative">
                  <Globe className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 pl-9 pr-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:bg-[var(--accent-hover)] transition-colors"
              >
                Save Profile Settings
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Telegram & Channels */}
        {activeTab === 'telegram' && (
          <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-[700px]">
            <div>
              <h2 className="font-['Fraunces',Georgia,serif] text-[18px] font-[650] text-[var(--text)]">
                Telegram Channel & Bot Automation
              </h2>
              <p className="text-[13px] text-[var(--text-secondary)]">
                Configure auto-broadcasting of products to channels and order alert webhooks
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">Public Telegram Channel Handle</label>
                <input
                  type="text"
                  value={settings.telegramChannel}
                  onChange={(e) => setSettings({ ...settings, telegramChannel: e.target.value })}
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 px-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                  placeholder="@your_channel_handle"
                />
                <span className="text-[11.5px] text-[var(--text-tertiary)]">
                  The bot must be added as an Administrator with &quot;Post Messages&quot; permission.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">Manager / Admin Telegram ID</label>
                <input
                  type="text"
                  value={settings.telegramAdminId}
                  onChange={(e) => setSettings({ ...settings, telegramAdminId: e.target.value })}
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 px-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                  placeholder="e.g. 98451294"
                />
                <span className="text-[11.5px] text-[var(--text-tertiary)]">
                  Telegram user ID that will receive instant notification pings when orders are confirmed.
                </span>
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-[var(--surface-soft)] border border-[var(--border)]">
                <div className="flex flex-col">
                  <span className="font-semibold text-[13.5px] text-[var(--text)]">
                    Auto-publish New Catalog Items
                  </span>
                  <span className="text-[12px] text-[var(--text-secondary)]">
                    Automatically draft a message to the channel when a product is added in Storage
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({ ...settings, autoPublishNewProducts: !settings.autoPublishNewProducts })
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.autoPublishNewProducts ? 'bg-[var(--accent)]' : 'bg-[#D0CCC2]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      settings.autoPublishNewProducts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-[var(--surface-soft)] border border-[var(--border)]">
                <div className="flex flex-col">
                  <span className="font-semibold text-[13.5px] text-[var(--text)]">
                    Active Bot Token Status
                  </span>
                  <span className="text-[12px] text-[var(--text-secondary)]">
                    Connected via environment configuration (`TELEGRAM_BOT_TOKEN`)
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF5EF] px-2.5 py-1 text-[11.5px] font-semibold text-[#0F6B4F]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Connected
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:bg-[var(--accent-hover)] transition-colors"
              >
                Save Telegram Settings
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Inventory & Alerts */}
        {activeTab === 'inventory' && (
          <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-[700px]">
            <div>
              <h2 className="font-['Fraunces',Georgia,serif] text-[18px] font-[650] text-[var(--text)]">
                Inventory Thresholds & System Alerts
              </h2>
              <p className="text-[13px] text-[var(--text-secondary)]">
                Automatic trigger levels for low inventory stock warnings
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">
                  Low Stock Alert Threshold (Units)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={settings.lowStockThreshold}
                  onChange={(e) =>
                    setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 1 })
                  }
                  className="w-full max-w-[180px] rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 px-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                />
                <span className="text-[11.5px] text-[var(--text-tertiary)]">
                  When a size or color variant drops to or below this number, an alert is triggered in Notifications.
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-[var(--surface-soft)] border border-[var(--border)]">
                <div className="flex flex-col">
                  <span className="font-semibold text-[13.5px] text-[var(--text)]">
                    Audible Alerts for New Orders
                  </span>
                  <span className="text-[12px] text-[var(--text-secondary)]">
                    Play a gentle audio ping when a new customer checkout is received
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, soundAlerts: !settings.soundAlerts })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.soundAlerts ? 'bg-[var(--accent)]' : 'bg-[#D0CCC2]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      settings.soundAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-[var(--surface-soft)] border border-[var(--border)]">
                <div className="flex flex-col">
                  <span className="font-semibold text-[13.5px] text-[var(--text)]">
                    Auto-archive Completed Orders
                  </span>
                  <span className="text-[12px] text-[var(--text-secondary)]">
                    Automatically move delivered orders to archive filter tab after 7 days
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({ ...settings, autoArchiveCompleted: !settings.autoArchiveCompleted })
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.autoArchiveCompleted ? 'bg-[var(--accent)]' : 'bg-[#D0CCC2]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      settings.autoArchiveCompleted ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:bg-[var(--accent-hover)] transition-colors"
              >
                Save Inventory Settings
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Security & Account */}
        {activeTab === 'security' && (
          <div className="flex flex-col gap-6 max-w-[700px]">
            <div>
              <h2 className="font-['Fraunces',Georgia,serif] text-[18px] font-[650] text-[var(--text)]">
                Administrator Account & Security
              </h2>
              <p className="text-[13px] text-[var(--text-secondary)]">
                Manage your credentials and session protection
              </p>
            </div>

            <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
              {passwordError && (
                <div className="flex items-center gap-2 rounded-[8px] bg-[#FDF1F1] border border-[#F7CDCD] p-3 text-[12.5px] text-[#B84343]">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">Current Password</label>
                <div className="relative">
                  <Key className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 pl-9 pr-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-semibold text-[var(--text)]">New Password</label>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 px-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                    placeholder="Min 8 characters"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-semibold text-[var(--text)]">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 px-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                    placeholder="Repeat new password"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--text)] px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:opacity-90 transition-opacity"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
