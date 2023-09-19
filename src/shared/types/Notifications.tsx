export type NotificationContext = {
    alerts: Alert[],
    notify: ({ id, type, message }: Alert) => void;
    removeAlert: (pid: string) => void;
}

export type Alert = {
    id: string,
    message: string,
    type: AlertTypes
}

export type AlertTypes = 'success' | 'error' | 'warning' | 'info'