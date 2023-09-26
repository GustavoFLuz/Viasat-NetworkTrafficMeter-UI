import { createContext, useContext, useEffect, useState } from "react"
import { NotificationTypes as Types } from "@/shared/types"

const NotificationContext = createContext<Types.NotificationContext | null>(null)

interface NotificationProps {
    children: React.ReactNode
}

export const NotificationProvider: React.FC<NotificationProps> = ({ children }) => {
    const [alerts, setAlerts] = useState<Types.Alert[]>([])

    const notify = ({ id, type, message }: Types.Alert) => {
        setAlerts(prev => prev.find(el => el.id === id) ? prev : [{ id, type, message }, ...prev])
    }

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id))
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

export const useNotification = () => {
    const context = useContext(NotificationContext);

    if (context === null) {
        throw new Error("Notification context is null")
    }

    return context
}