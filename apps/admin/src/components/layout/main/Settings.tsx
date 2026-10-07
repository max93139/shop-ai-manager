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
  Languages,
} from 'lucide-react';
import type { StoreSettings } from '@shop-ai/types';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setLanguage } from '../../../store/slices/uiSlice';
import { translations } from '../../../utils/translations';

const defaultSettings: StoreSettings = {
  storeName: 'Atelier Premium Clothing',
  supportPhone: '+380 (67) 123-45-67',
  supportEmail: 'support@atelier-store.ua',
  currency: 'UAH',
  timezone: 'Europe/Kyiv (UTC+3)',
  language: 'uk',
  telegramChannel: '@shop_channel',
  telegramBotTokenSet: true,
  autoPublishNewProducts: true,
  telegramAdminId: '98451294',
  lowStockThreshold: 5,
  soundAlerts: true,
  autoArchiveCompleted: false,
};

export default function Settings() {
  const dispatch = useAppDispatch();
  const currentLang = useAppSelector((state) => state.ui.language);
  const t = translations[currentLang] || translations.uk;

  const [settings, setSettings] = useState<StoreSettings>({
    ...defaultSettings,
    language: currentLang,
  });
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
        const parsed = JSON.parse(saved);
        const resolvedLang = parsed.language || currentLang;
        setSettings({ ...defaultSettings, ...parsed, language: resolvedLang });
        if (parsed.language && (parsed.language === 'uk' || parsed.language === 'en')) {
          dispatch(setLanguage(parsed.language));
        }
      } catch {
        setSettings({ ...defaultSettings, language: currentLang });
      }
    }
  }, [dispatch, currentLang]);

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
      if (settings.language) {
        localStorage.setItem('shop_manager_language', settings.language);
        dispatch(setLanguage(settings.language));
      }
      setTimeout(() => {
        setIsSaving(false);
        showToast(t.savedSuccess);
      }, 300);
    } catch (err) {
      setIsSaving(false);
      console.error('Failed to save settings:', err);
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
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
    showToast(t.passwordUpdatedSuccess);
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
            {t.storeSettingsTitle}
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] mt-0.5">
            {t.storeSettingsSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-sm transition-all hover:bg-[var(--accent-hover)] active:scale-[0.98] disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? t.saving : t.saveChanges}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[var(--border)]">
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
                    placeholder="e.g. Atelier Store"
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

              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">{t.currencyLabel}</label>
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
                <label className="text-[12.5px] font-semibold text-[var(--text)]">{t.timezoneLabel}</label>
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

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">
                  {t.languageLabel}
                </label>
                <div className="relative">
                  <Languages className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                  <select
                    value={settings.language || currentLang}
                    onChange={(e) => {
                      const newLang = e.target.value as 'uk' | 'en';
                      setSettings({ ...settings, language: newLang });
                      dispatch(setLanguage(newLang));
                    }}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 pl-9 pr-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                  >
                    <option value="uk">{t.langUk}</option>
                    <option value="en">{t.langEn}</option>
                  </select>
                </div>
                <span className="text-[11.5px] text-[var(--text-tertiary)]">
                  Перемикайте мову панелі керування на українську або англійську. Налаштування зберігається автоматично.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:bg-[var(--accent-hover)] transition-colors"
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
              <h2 className="font-['Fraunces',Georgia,serif] text-[18px] font-[650] text-[var(--text)]">
                {t.telegramTitle}
              </h2>
              <p className="text-[13px] text-[var(--text-secondary)]">
                {t.telegramDesc}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12.5px] font-semibold text-[var(--text)]">{t.telegramChannelLabel}</label>
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
                <label className="text-[12.5px] font-semibold text-[var(--text)]">{t.adminIdLabel}</label>
                <input
                  type="text"
                  value={settings.telegramAdminId}
                  onChange={(e) => setSettings({ ...settings, telegramAdminId: e.target.value })}
                  className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 px-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                  placeholder="e.g. 98451294"
                />
                <span className="text-[11.5px] text-[var(--text-tertiary)]">
                  {t.adminIdDesc}
                </span>
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-[var(--surface-soft)] border border-[var(--border)]">
                <div className="flex flex-col">
                  <span className="font-semibold text-[13.5px] text-[var(--text)]">
                    {t.autoPublishLabel}
                  </span>
                  <span className="text-[12px] text-[var(--text-secondary)]">
                    {t.autoPublishDesc}
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
                    {t.botTokenStatusLabel}
                  </span>
                  <span className="text-[12px] text-[var(--text-secondary)]">
                    {t.botTokenConfigured}
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
                {t.saveTelegramBtn}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Inventory & Alerts */}
        {activeTab === 'inventory' && (
          <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-[700px]">
            <div>
              <h2 className="font-['Fraunces',Georgia,serif] text-[18px] font-[650] text-[var(--text)]">
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
                  min="1"
                  max="50"
                  value={settings.lowStockThreshold}
                  onChange={(e) =>
                    setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 1 })
                  }
                  className="w-full max-w-[180px] rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-2 px-3 text-[13.5px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                />
                <span className="text-[11.5px] text-[var(--text-tertiary)]">
                  {t.lowStockDesc}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-[var(--surface-soft)] border border-[var(--border)]">
                <div className="flex flex-col">
                  <span className="font-semibold text-[13.5px] text-[var(--text)]">
                    {t.soundAlertsLabel}
                  </span>
                  <span className="text-[12px] text-[var(--text-secondary)]">
                    {t.soundAlertsDesc}
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
                    {t.autoArchiveLabel}
                  </span>
                  <span className="text-[12px] text-[var(--text-secondary)]">
                    {t.autoArchiveDesc}
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
                {t.saveInventoryBtn}
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Security & Account */}
        {activeTab === 'security' && (
          <div className="flex flex-col gap-6 max-w-[700px]">
            <div>
              <h2 className="font-['Fraunces',Georgia,serif] text-[18px] font-[650] text-[var(--text)]">
                {t.securityTitle}
              </h2>
              <p className="text-[13px] text-[var(--text-secondary)]">
                {t.securityDesc}
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
                  className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--text)] px-4 py-2 text-[13px] font-semibold text-white shadow-xs hover:opacity-90 transition-opacity"
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
