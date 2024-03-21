import { useSettings } from '@/shared/hooks';
import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, styled, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import { SettingsType } from '@/shared/types/Settings';

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

  const handleChange = (key: string, value: any) => {
    update(key, value)
  };

  return (
    <form
      style={{ marginTop: theme.spacing(6), userSelect: 'none' }}
    >
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
          sx={{ px: 4, mx: 2 }}
          onClick={reset}
        >
          Reset to default settings
        </Button>
      </Box>
    </form>
  );
};
