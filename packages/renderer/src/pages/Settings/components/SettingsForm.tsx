import { useSettings } from '@/shared/hooks';
import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, styled, Switch, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SettingsType } from '@/shared/types/Settings';
import { LoadingIcon } from '@/shared/components';
import { relative } from 'path';

const CustomSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

type SettingsFormProps = {
  defaultSettings: SettingsType;
  update: (key: string, value: any) => void;
  reset: () => void;
};

export const SettingsForm: React.FC<SettingsFormProps> = ({ defaultSettings, update, reset }) => {
  const theme = useTheme();
  const [isBackendRunning, setIsBackendRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateBackendRunning = (isRunning: boolean) => {
    setLoading(false)
    setIsBackendRunning(isRunning)
    handleChange("runBackend", isRunning)
  }

  useEffect(() => {
    window.backend.isRunning().then(updateBackendRunning)
  }, []);

  const handleChange = (key: string, value: any) => {
    update(key, value)
  };

  return (
    <form
      style={{ marginTop: theme.spacing(6), userSelect: 'none' }}
    >
      
      <FormGrid item xs={12} sx={{position:'relative'}}>
        <FormControlLabel
          control={<CustomSwitch/>}
          checked={isBackendRunning}
          onChange={() => {
            setLoading(true)
            isBackendRunning? 
            window.backend.stop().then(updateBackendRunning) : 
            window.backend.start().then(updateBackendRunning)
          }}
          label={<span>Turn {isBackendRunning?"off":"on"} data capture process {loading?<LoadingIcon size='32px'/>:<></>}</span>}
        />
      </FormGrid>

      <FormGrid item xs={12}>
        <FormControlLabel
          control={<Checkbox
            checked={defaultSettings.startOnWindowsStartup}
            onChange={event => handleChange("startOnWindowsStartup", event.target.checked)} 
          />}
          label="Start data capture on Windows startup"
        />
      </FormGrid>
      
      <Divider />

      {/* <Divider />
      <Plan
        settings={formData.plan}
        handleChange={handleChange}
      />{' '} */}
      {/* <Divider />
      <Notifications
        settings={formData.notifications}
        handleChange={handleChange}
      />{' '} */}
      {/* <Divider />
      <Preferences
        settings={formData.preferences}
        handleChange={handleChange}
      />{' '} */}
      <Box sx={{ position: 'absolute', bottom: '24px', right: '24px' }}>
        <Button
          variant="contained"
          sx={{ px: 4, mx: 2, color:"neutral.white" }}
          onClick={reset}
        >
          Reset to default settings
        </Button>
      </Box>
    </form>
  );
};
