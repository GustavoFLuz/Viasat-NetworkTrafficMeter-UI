import {useSettings} from '@/shared/contexts/Settings';
import {SettingsType} from '@/shared/types/Settings';
import {Box, Button, Divider, useTheme} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {Notifications, Plan, Preferences} from '.';

type SettingsFormProps = {
  error: (str: string) => void;
};

export const SettingsForm: React.FC<SettingsFormProps> = ({error}) => {
  const theme = useTheme();
  const {settings: currentSettings, updateSettings} = useSettings();
  const [formData, setFormData] = useState<SettingsType>(currentSettings);

  useEffect(() => {
    setFormData(currentSettings);
  }, [currentSettings]);

  const handleChange = (newData: any) => {
    setFormData({...formData, ...newData});
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    updateSettings(formData);
    window.history.back();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{marginTop: theme.spacing(6), userSelect: 'none'}}
    >
      <Divider />
      {/* <Divider />
      <Plan
        settings={formData.plan}
        handleChange={handleChange}
      />{' '} */}
      <Divider />
      <Notifications
        settings={formData.notifications}
        handleChange={handleChange}
      />{' '}
      {/* <Divider />
      <Preferences
        settings={formData.preferences}
        handleChange={handleChange}
      />{' '} */}
      <Box sx={{position: 'absolute', bottom: '24px', right: '24px'}}>
        <Button
          variant="contained"
          sx={{px: 4, mx: 2}}
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{px: 4, mx: 2}}
          type="submit"
        >
          Apply
        </Button>
      </Box>
    </form>
  );
};
