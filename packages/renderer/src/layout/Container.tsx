import {Alert} from '@/shared/components/Alert';
import {useNotification} from '@/shared/contexts';
import {Box} from '@mui/material';
import {Outlet} from 'react-router-dom';
import {TitleBar} from './';

export const Container = () => {
  const {alerts} = useNotification();

  return (
    <Box sx={{display: 'flex', height: '100vh', flexDirection: 'column', position: 'relative'}}>
      <TitleBar />
      <Box
        component="main"
        sx={{flexGrow: 1, width: '100%'}}
      >
        <Outlet />
      </Box>
      {alerts.length!=0 && (
        <Box sx={{position: 'absolute', top: '50px', left: '50px'}}>
          <Alert
            {...alerts[0]}
            key={alerts[0].id}
          />
        </Box>
      )}
    </Box>
  );
};
