import { ViasatPlanType } from "./Shared"

export type SettingsContext = {
    settings: SettingsType;
    updateSettings: (newSettings: SettingsType) => void;
}

export type SettingsType = {
    plan: ViasatPlanType | null; 
    notifications: NotificationsSettingsType;
    preferences: PreferencesSettingsType;
}

export type NotificationsSettingsType = {
    enabled: boolean;
    desktopNotifications: boolean;
    totalUsage: number;
    processUsage: number;
}

export type PreferencesSettingsType = {
    language: string;
    theme: string;
}