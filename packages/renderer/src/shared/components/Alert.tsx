import { IconButton, Snackbar } from '@mui/material'
import { useNotification } from '@/shared/contexts'
import { Alert as CustomAlertProps } from '@/shared/types/Notifications'
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';

export const Alert: React.FC<CustomAlertProps> = ({ id, message, type }) => {
    const { removeAlert } = useNotification()

    const handleClose = (_: any, reason?: string) => {
        if (reason === 'clickaway') return;
        removeAlert(id)
    }

    return (
        <Snackbar
            key={"Alert_" + id}
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
