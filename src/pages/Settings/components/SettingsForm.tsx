import { SettingsContext } from '@/shared/contexts/Settings';
import { SettingsType } from "@/shared/types/Settings";
import { Divider, useTheme } from '@mui/material';
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
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: theme.spacing(6), userSelect: "none" }}>
            <Divider />
            <Plan settings={formData.plan} handleChange={handleChange} /> {/* NOT IMPLEMENTED */}
            <Divider />
            <Notifications settings={formData.notifications} handleChange={handleChange} /> {/* NOT IMPLEMENTED */}
            <Divider />
            <Preferences settings={formData.preferences} handleChange={handleChange}/> {/* NOT IMPLEMENTED */}
        </form >
    );
}
