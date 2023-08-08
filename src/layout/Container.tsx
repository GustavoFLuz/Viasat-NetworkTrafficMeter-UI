import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { TitleBar } from './'


export const Container = () => {
    return (
        <Box sx={{ display: 'flex', height: "100vh", flexDirection: "column" }}>
            <TitleBar />
            <Box
                component="main"
                sx={{ flexGrow: 1, width: '100%'}}>
                <Outlet />
            </Box>
        </Box>
    )
}
