import { SettingsContext } from '@/shared/contexts/Settings';
import { SettingsType } from "@/shared/types/Settings";
import { Box, Button, Divider, useTheme } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Notifications } from './Notifications';
import { Plan } from './Plan';
import { Preferences } from './Preferences';

export const SettingsForm = () => {
    const theme = useTheme();
    const { settings: currentSettings, updateSettings } = useContext(SettingsContext)!;
    const [formData, setFormData] = useState<SettingsType>(currentSettings);

    useEffect(() => {
        setFormData(currentSettings);
    }, [currentSettings])

    useEffect(() => {
        console.log(formData);
    }, [formData])

    const handleChange = (newData: any) => {
        setFormData({ ...formData, ...newData });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('Form data submitted:', formData);
        updateSettings(formData);
        window.history.back()
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: theme.spacing(6), userSelect: "none" }}>
            <Divider />
            <Plan settings={formData.plan} handleChange={handleChange} /> {/* NOT IMPLEMENTED */}
            <Divider />
            <Notifications settings={formData.notifications} handleChange={handleChange} /> {/* NOT IMPLEMENTED */}
            <Divider />
            <Preferences settings={formData.preferences} handleChange={handleChange} /> {/* NOT IMPLEMENTED */}
            <Box sx={{ position: "absolute", bottom: "24px", right: "24px" }}>
                <Button variant="contained" sx={{ px: 4, mx: 2 }} onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button variant="contained" sx={{ px: 4, mx: 2 }} type="submit">
                    Apply
                </Button>
            </Box>
        </form >
    );
}
