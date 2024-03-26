import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const BackendNotRunning = () => {
    const navigate = useNavigate()

    const openSettings = () => {
        navigate('/settings')
    }

    return (
        <Box sx={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
            <Box sx={{ height: "250px", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>
                <Typography variant="h1" maxWidth="600px" textAlign="center">The Data Capture process is currently not running</Typography>
                <Typography variant="body1">Please enable it in the settings menu to view the dashboard</Typography>
                <Button
                    variant="contained"
                    sx={{fontSize: "1rem", padding: "0.5rem 1rem", color: "neutral.white", fontWeight: "bold", backgroundColor: "primary.main"}}
                    onClick={openSettings}
                >
                    Settings
                </Button>
            </Box>
        </Box>
    )
}
