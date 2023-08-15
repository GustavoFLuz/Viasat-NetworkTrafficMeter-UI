import { createContext, useState } from "react"
import { SettingsTypes as Types } from "@/shared/types"

export const SettingsContext = createContext<Types.SettingsContext | null>(null)

interface SettingsProps {
    children: React.ReactNode
}

export const SettingsProvider: React.FC<SettingsProps> = ({ children }) => {
    const [settings, setSettings] = useState<Types.SettingsType>({
        plan: null,
        notifications: {
            enabled: false,
            desktopNotifications: false,
            totalUsage: 0,
            processUsage: 0
        },
        preferences: {
            language: "en",
            theme: "Light"
        }
    })
    
    const updateSettings = (newSettings: Types.SettingsType) => {
        setSettings(newSettings)
    }

    return (
        <SettingsContext.Provider value={{
            settings, updateSettings
        }}>
            {children}
        </SettingsContext.Provider>
    )
}