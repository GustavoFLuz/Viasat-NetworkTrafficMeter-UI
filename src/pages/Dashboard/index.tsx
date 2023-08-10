import React, { useContext, useEffect, useReducer, useState } from 'react'
import { TopBar, AreaChart, PieChart, AppList } from './components'
import { Box, Paper, Typography } from '@mui/material'
import { NetworkUsageContext } from '@/shared/contexts';
import { useTheme } from '@mui/material/styles';
import { GroupedTotalData as GroupedDataType } from '@/shared/types/NetworkUsage';
import { TitleBarHeight } from '@/layout';
const { ipcRenderer } = window.require("electron");

export const Dashboard = () => {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const { data: { current, selected: data, add } } = useContext(NetworkUsageContext)!;

    const theme = useTheme();

    useEffect(() => {
        ipcRenderer.on('process', (_event: any, rawData: any) => {
            //console.log(rawData.length)
            add(rawData)
        });
        return () => { ipcRenderer.removeAllListeners('process') };
    }, [])

    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            <TopBar toggleDrawer={setDrawerOpen} />
            <AppList drawerOpen={drawerOpen} data={current}>
                <Box
                    sx={{
                        boxSizing: "border-box", display: "flex", gap: 2,
                        height: '100%', maxHeight: `calc(100vh - 3.6rem - ${TitleBarHeight})`,
                        width: "100%", flexGrow: 1, py: 2, px: 3
                    }}>
                    <Box sx={{ width: "30%" }}>
                        <Paper sx={{ width: "100%", height: "100%", p: 3, boxSizing: "border-box" }}>
                            <Typography variant="h6" textAlign="center">Network usage</Typography>
                            <PieChart data={data[data.length-1]} />
                        </Paper>
                    </Box>
                    <Box sx={{
                        flexGrow: 1, maxHeight: "100%",
                        maxWidth: `calc(70% - ${theme.spacing(2)})`,
                        display: "flex", flexDirection: "column", gap: 2,
                    }}>
                        <Paper sx={{ width: "100%", height: `calc(50% - ${theme.spacing(1)})`, p: 3, boxSizing: "border-box" }}>
                            <Typography variant="h6" textAlign="center">Network usage</Typography>
                            <AreaChart data={formatToInstantUsage(data)} />
                        </Paper>
                        <Paper sx={{ width: "100%", height: `calc(50% - ${theme.spacing(1)})`, p: 3, boxSizing: "border-box" }}>
                            <Typography variant="h6" textAlign="center">Cumulative network usage</Typography>
                            <AreaChart data={data.slice(-30)} />
                        </Paper>
                    </Box>
                </Box>
            </AppList >
        </Box >
    )
}

// Formats cumulative consumption to consumption in the last second
function formatToInstantUsage(data: (GroupedDataType & { time: number })[]) {
    return data.map((element: any, index: number) => {
        if (index === 0) return {
            name: element.name,
            time: element.time,
            total_value: 0,
            download_value: 0,
            upload_value: 0,
        }
        return {
            name: element.name,
            time: element.time,
            total_value: element.total_value - data[index - 1].total_value,
            download_value: element.download_value - data[index - 1].download_value,
            upload_value: element.upload_value - data[index - 1].upload_value,
        }
    }).slice(-30)
}