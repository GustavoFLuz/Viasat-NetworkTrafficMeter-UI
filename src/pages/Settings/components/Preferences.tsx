import React from 'react'
import { CustomGrid } from './CustomGrid'
import { PreferencesSettingsType } from '@/shared/types/Settings'
import { Typography, FormControl, Select, MenuItem } from '@mui/material'

const languages = [
    { name: "English", short: "en" },
    { name: "Portuguese", short: "pt-br" },
]

const themes = ["Light", "Dark"]

interface PreferencesProps {
    settings: PreferencesSettingsType,
    handleChange: (newData: any) => void
}

export const Preferences: React.FC<PreferencesProps> = ({ settings, handleChange }) => {
    return (
        <CustomGrid
            firstComponent={(
                <>
                    <Typography variant='h6' sx={{ fontWeight: "bold" }}>Language</Typography>
                    <FormControl sx={{ my: 3, width: "50%" }}>
                        <Select
                            value={settings.language}
                            onChange={(e) => handleChange({ preferences: { ...settings, language: e.target.value } })}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Select a language
                            </MenuItem>
                            {languages.map(lang => (
                                <MenuItem key={lang.short} value={lang.short}>{lang.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </>
            )}
            secondComponent={(
                <>
                    <Typography variant='h6' sx={{ fontWeight: "bold" }}>Language</Typography>
                    <FormControl sx={{ my: 3, width: "50%" }}>
                        <Select
                            value={settings.theme}
                            onChange={(e) => { handleChange({ preferences: { ...settings, theme: e.target.value } }) }}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Select a theme
                            </MenuItem>
                            {themes.map(theme => (
                                <MenuItem key={"theme_item_" + theme} value={theme}>{theme}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </>
            )}
        />
    )
}
