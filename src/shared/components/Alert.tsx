import { IconButton, Snackbar } from '@mui/material'
import React, { useContext } from 'react'
import { NotificationContext } from '@/shared/contexts'
import { Alert as CustomAlertProps } from '@/shared/types/Notifications'
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';

export const Alert: React.FC<CustomAlertProps> = ({ pid, message, type }) => {
    const { removeAlert } = useContext(NotificationContext)!

    const handleClose = (_: any, reason?: string) => {
        if (reason === 'clickaway') return;
        removeAlert(pid)
    }

    return (
        <Snackbar
            key={"Alert_" + pid}
            open={true}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}
        >
            <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleClose}
                severity={type}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                {message}
            </MuiAlert>
        </Snackbar>
    );
}
