import { ViasatPlanType } from "./Shared"


export type SettingsType = {
    startOnWindowsStartup: boolean;
    /* plan: ViasatPlanType | null; 
    notifications: NotificationsSettingsType;
    preferences: PreferencesSettingsType; */
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