import { Box, Button, IconButton, Toolbar } from '@mui/material'
import { styled } from '@mui/material/styles';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import ReorderIcon from '@mui/icons-material/Reorder';
import MenuIcon from '@mui/icons-material/Menu';
import { useContext } from 'react';
import { Counter } from '.';
const { ipcRenderer } = require('electron')

const buttonStyles = {
    minWidth: "1.5em",
    mx: 1,
    px: 1,
    color: "primary.dark",
    backgroundColor: "transparent",
    "&:hover": {
        backgroundColor: "primary.dark",
        color: "primary.contrastText"
    },
    appRegion: 'no-drag',
}

export const TitleBar = () => {


    const closeWindow = () => {
        ipcRenderer.send('close-window')
    }

    const expandWindow = () => {
        ipcRenderer.send('maximize-window')
    }

    const minimizeWindow = () => {
        ipcRenderer.send('minimize-window')
    }

    return (
        <Box sx={{
            appRegion: 'drag',
            width: "100%",
            p: '4px 0',
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "primary.contrastText"
        }}>
            <Box sx={{ px: 2, appRegion: 'no-drag', alignSelf: "flex-end", cursor: "default", color:"primary.light" }}><Counter /></Box>
            <Box>
                <Button variant="text" sx={buttonStyles} onClick={minimizeWindow}><MinimizeIcon sx={{fontSize:16}} /></Button>
                <Button variant="text" sx={buttonStyles} onClick={expandWindow}><CropSquareIcon sx={{fontSize:16}} /></Button>
                <Button variant="text" sx={buttonStyles} onClick={closeWindow}><CloseIcon sx={{fontSize:16}} /></Button>
            </Box>
        </Box>
    )
}
