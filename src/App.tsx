/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Alert, CoinPrice, ExchangeName, ExchangeStatus, AppSettings, AlertTriggerLog, AppLanguage } from './types/crypto';
import { AlertStorage } from './services/alertEngine/alertStorage';
import { AlertEngine } from './services/alertEngine/alertEngine';
import { ExchangeManager } from './services/exchanges/exchangeManager';
import { foregroundService, ForegroundServiceState } from './services/backgroundService/foregroundService';
import { getLanguageDirection } from './utils/i18n';
import { Header } from './components/Header';
import { OngoingNotificationTicker } from './components/OngoingNotificationTicker';
import { WatchlistScreen } from './components/WatchlistScreen';
import { CreateAlertModal } from './components/CreateAlertModal';
import { AlertDetailBottomSheet } from './components/AlertDetailBottomSheet';
import { SettingsModal } from './components/SettingsModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { FlutterExportModal } from './components/FlutterExportModal';
import { LanguageSelectModal } from './components/LanguageSelectModal';

export default function App() {
  const [alerts, setAlerts] = useState<Alert[]>(() => AlertStorage.getAllAlerts());
  const [prices, setPrices] = useState<Record<string, CoinPrice>>({});
  const [statuses, setStatuses] = useState<Record<ExchangeName, ExchangeStatus>>(() =>
    ExchangeManager.getInstance().getStatuses()
  );
  const [logs, setLogs] = useState<AlertTriggerLog[]>(() => AlertStorage.getLogs());
  const [settings, setSettings] = useState<AppSettings>(() => AlertStorage.getSettings());
  const [serviceState, setServiceState] = useState<ForegroundServiceState>(() =>
    foregroundService.getState()
  );

  // Modals & Bottom Sheets
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(() => !settings.hasChosenLanguage);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFlutterExportOpen, setIsFlutterExportOpen] = useState(false);
  const [selectedAlertForDetail, setSelectedAlertForDetail] = useState<Alert | null>(null);
  const [alertForEdit, setAlertForEdit] = useState<Alert | null>(null);

  // Unread count
  const unreadAlertsCount = alerts.filter((a) => a.hasUnreadTrigger).length;

  // Initialize and listen to Services
  useEffect(() => {
    const exchangeManager = ExchangeManager.getInstance();
    const alertEngine = AlertEngine.getInstance();

    // 1. Listen for price updates
    const unbindPrice = exchangeManager.onPrice((newPrice) => {
      setPrices((prev) => ({
        ...prev,
        [`${newPrice.exchange}_${newPrice.symbol}`]: newPrice,
      }));
    });

    // 2. Listen for exchange status updates
    const unbindStatus = exchangeManager.onStatus((newStatuses) => {
      setStatuses(newStatuses);
    });

    // 3. Listen for Alert Engine events (triggers, updates, adds, deletes)
    const unbindAlerts = alertEngine.onEvent((event) => {
      setAlerts(AlertStorage.getAllAlerts());
      setLogs(AlertStorage.getLogs());

      // If currently selected detail alert updated, sync it
      if (event.alert) {
        setSelectedAlertForDetail((curr) => (curr && curr.id === event.alert!.id ? event.alert! : curr));
      }
    });

    // 4. Listen for Foreground service status
    const unbindService = foregroundService.onStateChange((state) => {
      setServiceState(state);
    });

    return () => {
      unbindPrice();
      unbindStatus();
      unbindAlerts();
      unbindService();
    };
  }, []);

  // Update HTML direction and Theme when settings change
  useEffect(() => {
    const dir = getLanguageDirection(settings.language);
    document.documentElement.setAttribute('lang', settings.language);
    document.documentElement.setAttribute('dir', dir);

    if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [settings.language, settings.theme]);

  // Handlers
  const handleSelectLanguage = (lang: AppLanguage) => {
    const updated = {
      ...settings,
      language: lang,
      hasChosenLanguage: true,
    };
    setSettings(updated);
    AlertStorage.saveSettings(updated);
    setIsLanguageModalOpen(false);
  };

  const handleSaveAlert = (
    alertData: Omit<Alert, 'id' | 'createdAt' | 'triggerCount'>,
    existingId?: string
  ) => {
    const alertEngine = AlertEngine.getInstance();
    if (existingId) {
      const existing = AlertStorage.getAlert(existingId);
      if (existing) {
        alertEngine.updateAlert({
          ...existing,
          ...alertData,
        });
      }
    } else {
      const newAlert: Alert = {
        ...alertData,
        id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: Date.now(),
        triggerCount: 0,
      };
      alertEngine.addAlert(newAlert);
    }
  };

  const handleToggleActive = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    AlertEngine.getInstance().toggleAlertActive(id);
  };

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    AlertStorage.markAsRead(id);
    setAlerts(AlertStorage.getAllAlerts());
  };

  const handleResetReference = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    AlertEngine.getInstance().resetReferencePrice(id);
  };

  const handleCloneAlert = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    AlertEngine.getInstance().cloneAlert(id);
  };

  const handleDeleteAlert = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    AlertEngine.getInstance().deleteAlert(id);
    if (selectedAlertForDetail?.id === id) {
      setSelectedAlertForDetail(null);
    }
  };

  const handleTestTrigger = (id: string) => {
    AlertEngine.getInstance().testTrigger(id);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    AlertStorage.saveSettings(newSettings);
    ExchangeManager.getInstance().setRefreshInterval(newSettings.refreshInterval);
    AlertEngine.getInstance().syncExchangeSubscriptions();
  };

  const handleClearLogs = () => {
    AlertStorage.clearLogs();
    setLogs([]);
  };

  const handleMarkAllLogsAsRead = () => {
    AlertStorage.markAllAsRead();
    AlertStorage.markLogsAsRead();
    setAlerts(AlertStorage.getAllAlerts());
    setLogs(AlertStorage.getLogs());
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        settings.theme === 'amoled'
          ? 'bg-black text-slate-100'
          : settings.theme === 'midnight'
          ? 'bg-[#0a0f1d] text-slate-100'
          : settings.theme === 'light'
          ? 'bg-slate-50 text-slate-900'
          : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Initial Language Onboarding Modal */}
      <LanguageSelectModal
        isOpen={isLanguageModalOpen}
        currentLanguage={settings.language}
        isFirstLaunch={!settings.hasChosenLanguage}
        onSelectLanguage={handleSelectLanguage}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      {/* Top Header */}
      <Header
        statuses={statuses}
        settings={settings}
        unreadCount={unreadAlertsCount}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenFlutterExport={() => setIsFlutterExportOpen(true)}
        onToggleSound={() => handleUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
        onSelectLanguage={handleSelectLanguage}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onReconnectExchange={(ex) => ExchangeManager.getInstance().reconnectExchange(ex)}
      />

      {/* BitcoinChecker Ongoing Notification Ticker Bar */}
      <OngoingNotificationTicker
        prices={prices}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onReconnectExchange={(ex) => ExchangeManager.getInstance().reconnectExchange(ex)}
      />

      {/* Main Watchlist & Content */}
      <main className="flex-1 flex flex-col">
        <WatchlistScreen
          alerts={alerts}
          prices={prices}
          settings={settings}
          onOpenCreate={() => {
            setAlertForEdit(null);
            setIsCreateOpen(true);
          }}
          onSelectAlert={(alert) => setSelectedAlertForDetail(alert)}
          onToggleActive={handleToggleActive}
          onMarkAsRead={handleMarkAsRead}
          onResetReference={handleResetReference}
          onCloneAlert={handleCloneAlert}
          onDeleteAlert={handleDeleteAlert}
        />
      </main>

      {/* Create / Edit Modal */}
      <CreateAlertModal
        isOpen={isCreateOpen}
        initialAlert={alertForEdit}
        settings={settings}
        onClose={() => {
          setIsCreateOpen(false);
          setAlertForEdit(null);
        }}
        onSave={handleSaveAlert}
      />

      {/* Detail Bottom Sheet */}
      <AlertDetailBottomSheet
        alert={selectedAlertForDetail}
        price={
          selectedAlertForDetail
            ? prices[`${selectedAlertForDetail.exchange}_${selectedAlertForDetail.symbol}`]
            : undefined
        }
        settings={settings}
        onClose={() => setSelectedAlertForDetail(null)}
        onEdit={(alert) => {
          setSelectedAlertForDetail(null);
          setAlertForEdit(alert);
          setIsCreateOpen(true);
        }}
        onClone={(id) => handleCloneAlert(id)}
        onToggleActive={handleToggleActive}
        onResetReference={handleResetReference}
        onTestTrigger={handleTestTrigger}
        onDelete={handleDeleteAlert}
        onMarkAsRead={handleMarkAsRead}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        logs={logs}
        serviceState={serviceState}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={handleUpdateSettings}
        onClearLogs={handleClearLogs}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        logs={logs}
        settings={settings}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllAsRead={handleMarkAllLogsAsRead}
        onClearLogs={handleClearLogs}
      />

      {/* Flutter Code Exporter Modal */}
      <FlutterExportModal
        isOpen={isFlutterExportOpen}
        settings={settings}
        onClose={() => setIsFlutterExportOpen(false)}
      />
    </div>
  );
}
