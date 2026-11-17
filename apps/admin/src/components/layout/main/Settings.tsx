'use client';

import React, { useState, useEffect } from 'react';
import {
  Store,
  Send,
  Bell,
  Shield,
  CheckCircle2,
  AlertCircle,
  Key,
  Smartphone,
  Mail,
  Building,
  Languages,
} from 'lucide-react';
import type { StoreSettings, StoreSettingsResponse } from '@shop-ai/types';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setLanguage } from '../../../store/slices/uiSlice';
import { translations } from '../../../utils/translations';

const emptySettings: StoreSettingsResponse = {
  storeName: '',
  supportPhone: '',
  supportEmail: '',
  managerChatId: '',
  lowStockThreshold: 5,
  botTokenConfigured: false,
  telegramChannel: null,
  managerChatFromEnv: false,
  monobankConfigured: false,
  novaPoshtaSenderConfigured: false,
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const authHeaders = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function Settings() {
  const dispatch = useAppDispatch();
  const currentLang = useAppSelector((state) => state.ui.language);
  const t = translations[currentLang] || translations.uk;

  const [settings, setSettings] = useState<StoreSettingsResponse>(emptySettings);
  const [loadError, setLoadError] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'telegram' | 'inventory' | 'security'>('profile');

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('tab');
    if (requested === 'profile' || requested === 'telegram' || requested === 'inventory' || requested === 'security') {
      setActiveTab(requested);
    }
  }, []);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetch(`${apiUrl}/settings`, { headers: authHeaders(), credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: StoreSettingsResponse) => setSettings(data))
      .catch(() => setLoadError(true));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      const editable: StoreSettings = {
        storeName: settings.storeName,
        supportPhone: settings.supportPhone,
        supportEmail: settings.supportEmail,
        managerChatId: settings.managerChatId,
        lowStockThreshold: settings.lowStockThreshold,
      };
      const res = await fetch(`${apiUrl}/settings`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(editable),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setSaveError((Array.isArray(body?.message) ? body.message[0] : body?.message) || t.settingsSaveFailed);
        return;
      }
      setSettings(body);
      showToast(t.savedSuccess);
    } catch {
      setSaveError(t.settingsSaveFailed);
    } finally {
      setIsSaving(false);
    }
  };

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.newPassword || passwords.newPassword.length < 8) {
      setPasswordError(t.passwordMinLength);
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError(t.passwordsMismatch);
      return;
    }
    setPasswordError(null);
    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/auth/change-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
        setPasswordError(message === 'Current password is incorrect' ? t.passwordCurrentWrong : message || t.passwordChangeFailed);
        return;
      }
      if (body?.access_token) {
        localStorage.setItem('access_token', body.access_token);
      }
      showToast(t.passwordUpdatedSuccess);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      setPasswordError(t.passwordChangeFailed);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="page-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-md bg-[#1C1B19] px-4 py-3 text-[13px] font-medium text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div>
          <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight text-[var(--text)]">
            {t.storeSettingsTitle}
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] mt-0.5">
            {t.storeSettingsSubtitle}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[var(--border)]">
        {[
          { key: 'profile', label: t.tabProfile, icon: Store },
          { key: 'telegram', label: t.tabTelegram, icon: Send },
          { key: 'inventory', label: t.tabInventory, icon: Bell },
          { key: 'security', label: t.tabSecurity, icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`inline-flex items-center gap-2 px-3 py-2.5 text-[13px] font-medium transition-colors select-none border-b-2 -mb-[1px] whitespace-nowrap ${
                isActive
                  ? 'border-[var(--text)] text-[var(--text)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {(loadError || saveError) && (
        <p className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-danger-soft px-4 py-3 text-[13px] text-danger">
          {saveError ?? t.settingsLoadFailed}
        </p>
      )}

      {/* Tab Panels */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7">
        {/* Tab 1: Store Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-[700px]">
            <div>
              <h2 className="text-[16px] font-semibold tracking-tight text-[var(--text)]">
                {t.generalInfoTitle}
              </h2>
              <p className="text-[13px] text-[var(--text-secondary)]">
                {t.generalInfoDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">{t.storeNameLabel}</label>
                <div className="relative">
                  <Building className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 pl-9 pr-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                    placeholder={t.storeNamePlaceholder}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">{t.supportPhoneLabel}</label>
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
                <label className="text-[12.5px] font-semibold text-[var(--text)]">{t.supportEmailLabel}</label>
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

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">
                  {t.languageLabel}
                </label>
                <div className="relative">
                  <Languages className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                  <select
                    value={currentLang}
                    onChange={(e) => dispatch(setLanguage(e.target.value as 'uk' | 'en'))}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 pl-9 pr-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                  >
                    <option value="uk">{t.langUk}</option>
                    <option value="en">{t.langEn}</option>
                  </select>
                </div>
                <span className="text-[11.5px] text-[var(--text-tertiary)]">{t.languageLocalHint}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-[13px] font-semibold text-[var(--text)]">{t.connectionsTitle}</h3>
              <div className="divide-y divide-[var(--border)] rounded-md border border-[var(--border)]">
                {[
                  { label: t.connBot, ok: settings.botTokenConfigured },
                  { label: t.connMonobank, ok: settings.monobankConfigured },
                  { label: t.connNovaPoshta, ok: settings.novaPoshtaSenderConfigured },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-3.5 py-2.5 text-[13px]">
                    <span className="text-[var(--text)]">{item.label}</span>
                    <span className={item.ok ? 'font-semibold text-positive' : 'text-[var(--text-tertiary)]'}>
                      {item.ok ? t.connConfigured : t.connNotConfigured}
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-[11.5px] text-[var(--text-tertiary)]">{t.connectionsHint}</span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
              >
                {t.saveProfileBtn}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Telegram & Channels */}
        {activeTab === 'telegram' && (
          <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-[700px]">
            <div>
              <h2 className="text-[16px] font-semibold tracking-tight text-[var(--text)]">
                {t.telegramTitle}
              </h2>
              <p className="text-[13px] text-[var(--text-secondary)]">
                {t.telegramDesc}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[12.5px] font-semibold text-[var(--text)]">{t.telegramChannelLabel}</span>
                <span className="text-[13.5px] text-[var(--text)]">{settings.telegramChannel ?? '—'}</span>
                <span className="text-[11.5px] text-[var(--text-tertiary)]">{t.channelFromEnvHint}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="manager-chat" className="text-[12.5px] font-semibold text-[var(--text)]">{t.managerChatLabel}</label>
                <input
                  id="manager-chat"
                  type="text"
                  value={settings.managerChatId}
                  onChange={(e) => setSettings({ ...settings, managerChatId: e.target.value })}
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 px-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                  placeholder="-1001234567890"
                />
                <span className="text-[11.5px] text-[var(--text-tertiary)]">
                  {t.managerChatDesc}
                  {!settings.managerChatId && settings.managerChatFromEnv ? ` ${t.managerChatEnvHint}` : ''}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-md bg-[var(--surface-soft)] border border-[var(--border)]">
                <span className="font-semibold text-[13.5px] text-[var(--text)]">{t.botTokenStatusLabel}</span>
                <span className={settings.botTokenConfigured ? 'text-[12.5px] font-semibold text-positive' : 'text-[12.5px] text-[var(--text-tertiary)]'}>
                  {settings.botTokenConfigured ? t.connConfigured : t.connNotConfigured}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
              >
                {t.saveTelegramBtn}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Inventory & Alerts */}
        {activeTab === 'inventory' && (
          <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-[700px]">
            <div>
              <h2 className="text-[16px] font-semibold tracking-tight text-[var(--text)]">
                {t.inventoryTitle}
              </h2>
              <p className="text-[13px] text-[var(--text-secondary)]">
                {t.inventoryDesc}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">
                  {t.lowStockThresholdLabel}
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={settings.lowStockThreshold}
                  onChange={(e) =>
                    setSettings({ ...settings, lowStockThreshold: Math.max(0, parseInt(e.target.value, 10) || 0) })
                  }
                  className="w-full max-w-[180px] rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 px-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                />
                <span className="text-[11.5px] text-[var(--text-tertiary)]">
                  {t.lowStockDesc}
                </span>
              </div>

            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
              >
                {t.saveInventoryBtn}
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Security & Account */}
        {activeTab === 'security' && (
          <div className="flex flex-col gap-6 max-w-[700px]">
            <div>
              <h2 className="text-[16px] font-semibold tracking-tight text-[var(--text)]">
                {t.securityTitle}
              </h2>
              <p className="text-[13px] text-[var(--text-secondary)]">
                {t.securityDesc}
              </p>
            </div>

            <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4">
              {passwordError && (
                <div className="flex items-center gap-2 rounded-[8px] bg-danger-soft border border-[#F7CDCD] p-3 text-[12.5px] text-danger">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">{t.currentPasswordLabel}</label>
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
                  <label className="text-[12.5px] font-semibold text-[var(--text)]">{t.newPasswordLabel}</label>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 px-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                    placeholder="Min 8 characters"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-semibold text-[var(--text)]">{t.confirmPasswordLabel}</label>
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
                  disabled={isChangingPassword}
                  className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--text)] px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {t.updatePasswordBtn}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
