import {TitleBarHeight} from '@/layout';
import {Box, IconButton, Typography} from '@mui/material';
import {SettingsForm} from './components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from 'react';

export const Settings = () => {
  const [error, setError] = useState<string | undefined>()

  const addError = (str: string)=> setError(str)

  return (
    <Box sx={{width: '100%', height: '100%'}}>
      <Box sx={{backgroundColor: 'background.paper', width: '100%', height: '3em'}}>
        <Box sx={{width: '4rem', height: '100%', display: 'grid', placeItems: 'center'}}>
          <IconButton
            sx={{boxSizing: 'border-box'}}
            onClick={() => window.history.back()}
          >
            <ArrowBackIcon sx={{fontSize: '1.5em'}} />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{display: 'flex', height: `calc(100vh - 3em - ${TitleBarHeight})`}}>
        <Box sx={{height: '100%', width: '4em', backgroundColor: 'background.paper'}}></Box>
        <Box sx={{flexGrow: 1, height: '100%', p: 3, overflow: 'auto'}}>
          <Typography
            variant="h4"
            sx={{fontWeight: 'bold'}}
          >
            Settings
          </Typography>
          {error?
          <Box sx={{color: 'error.main'}}>
            <Typography>{JSON.stringify(error)}</Typography>
          </Box>:
          <></>}
          <SettingsForm error={addError}/>
        </Box>
      </Box>
    </Box>
  );
};
