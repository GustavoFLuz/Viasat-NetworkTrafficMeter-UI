export type NotificationContext = {
    alerts: Alert[],
    notify: (pid: string, message: string, type: AlertTypes) => void;
    removeAlert: (pid: string) => void;
}

export type Alert = {
    pid: string,
    message: string,
    type: AlertTypes
}

export type AlertTypes = 'success' | 'error' | 'warning' | 'info'