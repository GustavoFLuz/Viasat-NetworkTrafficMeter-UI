import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { TitleBar } from './'
import { useContext } from 'react'
import { NotificationContext } from '@/shared/contexts'
import { Alert } from '@/shared/components/Alert'


export const Container = () => {
    const { alerts } = useContext(NotificationContext)!

    return (
        <Box sx={{ display: 'flex', height: "100vh", flexDirection: "column", position: "relative" }}>
            <TitleBar />
            <Box
                component="main"
                sx={{ flexGrow: 1, width: '100%' }}>
                <Outlet />
            </Box>
            {alerts.length && (
                <Box sx={{ position: "absolute", top: "50px", left: "50px" }}>
                    <Alert {...alerts[0]} key={alerts[0].pid}/>
                </Box>
            )}
        </Box>
    )
}   
