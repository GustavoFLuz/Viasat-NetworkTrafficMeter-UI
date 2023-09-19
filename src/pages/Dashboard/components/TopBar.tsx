import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { DateTimePicker } from "@mui/x-date-pickers";
import React, { useState } from 'react';

const DateTimePickerStyles = { 
  p: 0, 
  "& .MuiInputBase-input": { py: 1 }, 
  "& .MuiFormLabel-root": { lineHeight: ".8em", overflow:"visible" } 
}

interface TopBarProps {
  toggleDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TopBar: React.FC<TopBarProps> = ({ toggleDrawer }) => {
  const [timePeriod, setTimePeriod] = useState('30s');

  const handleChange = (event: { target: { value: string; }; }) => {
    setTimePeriod(event.target.value as string);
  };

  return (
    <Box sx={{ display: "flex", width: "100%", height: "3.6rem", justifyContent: "space-between", gap: 3, backgroundColor: "background.default", px: 3, py: 1, boxSizing: "border-box" }}>
      <Box sx={{ minWidth: "180px", display: "flex", alignItems: "end" }}>
        <FormControl sx={{ flexGrow: 1, mr: 5 }}>
          <InputLabel id="history-label">Show history from</InputLabel>
          <Select
            labelId="history-label"
            id="history-select"
            label="Show history from"
            defaultValue={timePeriod}
            onChange={handleChange}
            sx={{ p: 1, height: "2.3em" }}
          >
            <MenuItem value="30s">30 seconds</MenuItem>
            <MenuItem value="5min">5 minutes</MenuItem>
            <MenuItem value="1h">1 hour</MenuItem>
            <MenuItem value="1m">1 month</MenuItem>
            <MenuItem value="custom">Custom range</MenuItem>
          </Select>
        </FormControl>
        {timePeriod === "custom" && (<>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <DateTimePicker
              label="FROM DATE"
              sx={DateTimePickerStyles}
            />
            <Typography sx={{ fontWeight: 900 }}>:</Typography>
            <DateTimePicker
              label="TO DATE"
              sx={DateTimePickerStyles}
            />
          </Box>
        </>)}
      </Box>
      <Button onClick={() => toggleDrawer(prev => !prev)}>
        <FormatListBulletedIcon />
      </Button>
    </Box>
  )
}
