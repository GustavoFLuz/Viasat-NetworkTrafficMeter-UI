import { TitleBarHeight } from '@/layout';
import { getCummulativeUsageOfProcess, useNetworkData } from '@/shared/contexts';
import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { AppList, AreaChart, BackendNotRunning, PieChart, TopBar, UsageList } from './components';
import { LoadingIcon } from '@/shared/components';

export const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const {
    data: { processes, filteredTotal, synced, add }, interval: { loading }
  } = useNetworkData();
  const [backendRunning, setBackendRunning] = useState<boolean>(false);
  const theme = useTheme();
  
  useEffect(() => {
    const stopConnection = !synced || loading || !backendRunning;
    const timeout: NodeJS.Timeout[] = []
    let socket: WebSocket;
    const connectWebSocket = () => {
      try {
        socket = new WebSocket('ws://localhost:50000/ws');
        socket.addEventListener('open', () => {
          console.log('WebSocket connected');
        });
        socket.addEventListener('message', event => {
          add(event.data);
        });
        socket.addEventListener('close', () => {
          console.log('WebSocket closed');
          timeout.push(setTimeout(connectWebSocket, 3000))
        });
      } catch (error) {
        console.error('WebSocket error:', error);
        timeout.push(setTimeout(connectWebSocket, 3000))
      }
    };
    if (!stopConnection)
      connectWebSocket();

    return () => {
      if (socket) socket.close();
      if (timeout.length) timeout.forEach(clearTimeout)
    };
  }, [synced, loading, backendRunning]);

  useEffect(()=>{
    window.settings.get("runBackend").then(setBackendRunning)
  }, [])

  if(!backendRunning) 
    return <BackendNotRunning/>

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <TopBar toggleDrawer={setDrawerOpen} />
      <AppList
        drawerOpen={drawerOpen}
        data={processes}
      >
        {!loading ?
          <>

            <Box
              sx={{
                boxSizing: 'border-box',
                display: 'flex',
                gap: 2,
                height: '100%',
                maxHeight: `calc(100vh - 3.6rem - ${TitleBarHeight})`,
                width: '100%',
                flexGrow: 1,
                py: 2,
                px: 3,
              }}
            >
              <Box sx={{ width: 'min(30vw, 450px)' }}>
                <Paper sx={{ width: '100%', height: '100%', p: 1, boxSizing: 'border-box', position: "relative", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                  <Typography
                    variant="h6"
                    textAlign="center"
                  >
                    Network usage
                  </Typography>
                  <Box sx={{width: '100%', height: '30%'}}><PieChart data={filteredTotal} /></Box>
                  <Box sx={{width: '100%', height: `calc(50% - ${theme.spacing(2)})`, overflowY:"auto"}}><UsageList data={filteredTotal}/></Box>
                </Paper>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  maxHeight: '100%',
                  maxWidth: `calc(100% - min(30vw, 450px) - ${theme.spacing(2)})`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Paper
                  sx={{
                    height: `calc(50% - ${theme.spacing(1)})`,
                    p: 3,
                    boxSizing: 'border-box',
                    position: "relative"
                  }}
                >
                  <Typography
                    variant="h6"
                    textAlign="center"
                  >
                    Network usage
                  </Typography>
                  <AreaChart data={filteredTotal} />
                </Paper>
                <Paper
                  sx={{
                    height: `calc(50% - ${theme.spacing(1)})`,
                    p: 3,
                    boxSizing: 'border-box',
                    position: "relative"
                  }}
                >
                  <Typography
                    variant="h6"
                    textAlign="center"
                  >
                    Cumulative network usage
                  </Typography>
                  <AreaChart data={getCummulativeUsageOfProcess(filteredTotal)} />
                </Paper>
              </Box>
            </Box>
          </>: <LoadingIcon size='75px' />}
      </AppList>
    </Box>
  );
};
