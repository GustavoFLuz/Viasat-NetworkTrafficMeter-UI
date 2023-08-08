import React, { useContext } from 'react'
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, NativeSelect, Select } from '@mui/material'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { NetworkUsageContext } from '@/shared/contexts';

interface TopBarProps {
  toggleDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TopBar: React.FC<TopBarProps> = ({ toggleDrawer }) => {

  return (
    <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between", gap: 3, backgroundColor: "background.default", px: 3, py: 1, boxSizing: "border-box" }}>
      <Box sx={{ width: "15%", minWidth: "180px", display: "flex" }}>
      </Box>
      <Button onClick={() => toggleDrawer(prev => !prev)}>
        <FormatListBulletedIcon />
      </Button>
    </Box>
  )
}
