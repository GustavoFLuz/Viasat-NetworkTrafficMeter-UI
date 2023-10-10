import { CustomGrid } from './CustomGrid'
import { Box, FormControlLabel, FormGroup, Slider, Switch, Typography } from '@mui/material'
import { NotificationsSettingsType } from '@/shared/types/Settings'
import { NumberToByte } from '@/utils/ByteUtils'

interface NotificationsProps {
    settings: NotificationsSettingsType,
    handleChange: (newData: any) => void
}

export const Notifications: React.FC<NotificationsProps> = ({ settings, handleChange }) => {

    const sliderProps:{
        min: number,
        max: number,
        step: number,
        scale: (value: number) => number,
        getAriaValueText: (value: number) => string,
        valueLabelDisplay: "auto" | "on" | "off",
        disabled: boolean
    } = {
        min: 1,
        max: 21,
        step: 1,
        scale: getValueAtPosition,
        getAriaValueText: NumberToByte,
        valueLabelDisplay: "off",
        disabled: !settings.enabled
    }

    return (
        <CustomGrid
            firstComponent={<>
                <Typography variant='h6' sx={{ fontWeight: "bold" }}>Notifications</Typography>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.enabled}
                                onChange={(e) =>
                                    handleChange({
                                        notifications: {
                                            enabled: e.target.checked,
                                            desktopNotifications: false,
                                            totalUsage: marks[Number(e.target.checked)],
                                            processUsage: marks[Number(e.target.checked)],
                                        }
                                    })
                                }
                            />}
                        label={settings.enabled ? "Enabled" : "Disabled"}
                        sx={{ "& .MuiFormControlLabel-label": { width: "fit-content" } }}
                    />
                </FormGroup>
                {/* <Typography variant='h6'>Desktop Notifications</Typography>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.desktopNotifications}
                                onChange={(e) =>
                                    handleChange({
                                        notifications: {
                                            ...settings,
                                            desktopNotifications: e.target.checked,
                                        }
                                    })}
                                disabled={!settings.enabled}
                            />
                        }
                        label={settings.desktopNotifications ? "Enabled" : "Disabled"}
                        sx={{ "& .MuiFormControlLabel-label": { width: "fit-content" } }}
                    />
                </FormGroup> */}

            </>}
            secondComponent={<>
                <Typography gutterBottom>
                    Send a notification when:
                </Typography>
                <Box sx={{ width: "70%", pl: 2 }}>
                    <Typography gutterBottom>
                        total usage reaches {NumberToByte(settings.totalUsage)}
                    </Typography>
                    <Slider
                        value={getPositionAtValue(settings.totalUsage)}
                        onChange={(_, newValue) =>
                            handleChange({ notifications: { ...settings, totalUsage: getValueAtPosition(newValue as number) } })
                        }
                        {...sliderProps}
                    />
                </Box>
                <Box sx={{ width: "70%", pl: 2 }}>
                    <Typography gutterBottom>
                        a process usage reaches {NumberToByte(settings.processUsage)}
                    </Typography>
                    <Slider
                        value={getPositionAtValue(settings.processUsage)}
                        onChange={(_, newValue) =>
                            handleChange({ notifications: { ...settings, processUsage: getValueAtPosition(newValue as number) } })
                        }
                        {...sliderProps}
                    />
                </Box>
            </>}
        />
    )
}

const marks = [
    0,
    100_000_000,
    200_000_000,
    300_000_000,
    400_000_000,
    500_000_000,
    600_000_000,
    700_000_000,
    800_000_000,
    900_000_000,
    1_000_000_000,
    5_000_000_000,
    10_000_000_000,
    20_000_000_000,
    30_000_000_000,
    40_000_000_000,
    50_000_000_000,
    100_000_000_000,
    200_000_000_000,
    300_000_000_000,
    400_000_000_000,
    500_000_000_000,
]

function getValueAtPosition(value: number) {
    return marks[value];
}

function getPositionAtValue(value: number) {
    return marks.indexOf(value);
}