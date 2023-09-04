import { createContext, useEffect, useState } from "react"
import { SettingsTypes as Types } from "@/shared/types"
import channels from "@/../electron/channels"
const { ipcRenderer } = require('electron')

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

    useEffect(() => {
        ipcRenderer.send(channels.settings.get)
        ipcRenderer.once(channels.settings.get_response, (_event: any, savedSettings: any) => {
            if (!savedSettings) return ipcRenderer.send(channels.settings.update, settings)
            setSettings(savedSettings)
        })
        return () => {
            ipcRenderer.removeAllListeners(channels.settings.get_response);
        };
    }, [])

    useEffect(() => {
        ipcRenderer.send(channels.settings.update, settings)
    }, [settings])

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