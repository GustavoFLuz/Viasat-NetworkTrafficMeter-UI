import { createContext, useEffect, useState } from "react"
import { NotificationTypes as Types } from "@/shared/types"

export const NotificationContext = createContext<Types.NotificationContext | null>(null)

interface NotificationProps {
    children: React.ReactNode
}

export const NotificationProvider: React.FC<NotificationProps> = ({ children }) => {
    const [alerts, setAlerts] = useState<Types.Alert[]>([])


    const notify = (pid: string, message: string, type: Types.AlertTypes) => {
        setAlerts(prev => [{ pid, type, message }, ...prev])
    }

    const removeAlert = (pid: string) => {
        setAlerts(prev => prev.filter(alert => alert.pid !== pid))
    }

    return (
        <NotificationContext.Provider value={{
            alerts: alerts,
            notify: notify,
            removeAlert: removeAlert,
        }}>
            {children}
        </NotificationContext.Provider>
    )
}