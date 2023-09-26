import {createContext, useContext, useEffect, useState} from 'react';
import {SettingsTypes as Types} from '@/shared/types';

const SettingsContext = createContext<Types.SettingsContext | null>(null);

interface SettingsProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProps> = ({children}) => {
  const [settings, setSettings] = useState<Types.SettingsType>({
    plan: null,
    notifications: {
      enabled: false,
      desktopNotifications: false,
      totalUsage: 0,
      processUsage: 0,
    },
    preferences: {
      language: 'en',
      theme: 'Light',
    },
  });

  useEffect(() => {
    const savedSettings = window.settings.get();
    if (!savedSettings) return window.settings.update(settings);
    setSettings(savedSettings);
  }, []);

  useEffect(() => {
    window.settings.update(settings);
  }, [settings]);

  const updateSettings = (newSettings: Types.SettingsType) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (context === null) {
    throw new Error('Settings context is null');
  }

  return context;
};
