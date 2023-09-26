import {LogoGreen} from '@/assets/logo';
import {CustomDrawer} from '@/shared/components/CustomDrawer';
import CloseIcon from '@mui/icons-material/Close';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import MenuIcon from '@mui/icons-material/Menu';
import MinimizeIcon from '@mui/icons-material/Minimize';
import SettingsIcon from '@mui/icons-material/Settings';
import {Box, Button, IconButton, Tooltip} from '@mui/material';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

export const TitleBarHeight = '2rem';

const buttonStyles = {
  minWidth: '1.5em',
  height: TitleBarHeight,
  px: 2,
  color: 'secondary.light',
  backgroundColor: 'transparent',
  borderRadius: 0,
  '&:hover': {
    backgroundColor: 'secondary.light',
    color: 'secondary.contrastText',
  },
  appRegion: 'no-drag',
};

export const TitleBar = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeWindow = () => {
    window.electron_window.close();
  };

  const expandWindow = () => {
    window.electron_window.maximize();
  };

  const minimizeWindow = () => {
    window.electron_window.minimize();
  };

  const openSettings = () => {
    navigate('/settings');
  };

  return (
    <Box
      sx={{
        appRegion: 'drag',
        width: '100%',
        height: TitleBarHeight,
        display: 'flex',
        alignItems: 'center' /*  */,
        justifyContent: 'space-between',
        backgroundColor: 'secondary.contrastText',
        position: 'relative',
      }}
    >
      <IconButton
        sx={{color: 'secondary.light', mx: 2, appRegion: 'no-drag'}}
        onClick={() => setDrawerOpen(!drawerOpen)}
      >
        <MenuIcon />
      </IconButton>
      <Box
        sx={{
          width: '70px',
          appRegion: 'no-drag',
          display: 'flex',
          position: 'absolute',
          left: '50%',
          top: '50%',
          translate: '-50% -50%',
        }}
      >
        <LogoGreen />
      </Box>
      {/* <Box sx={{ px: 2, appRegion: 'no-drag', alignSelf: "flex-end", cursor: "default", color: "secondary.light", position: "absolute", left: "50%", top: "50%", translate: "-50% -50%" }}><Counter /></Box> */}
      <Box>
        <Tooltip title="Settings">
          <Button
            variant="text"
            sx={{...buttonStyles, mx: 2, '&:hover>svg': {transform: 'rotate(180deg)'}}}
            onClick={openSettings}
          >
            <SettingsIcon style={{transition: 'transform 2s ease'}} />
          </Button>
        </Tooltip>
        <Button
          variant="text"
          sx={buttonStyles}
          onClick={minimizeWindow}
        >
          <MinimizeIcon sx={{fontSize: 16}} />
        </Button>
        <Button
          variant="text"
          sx={buttonStyles}
          onClick={expandWindow}
        >
          <CropSquareIcon sx={{fontSize: 16}} />
        </Button>
        <Button
          variant="text"
          sx={buttonStyles}
          onClick={closeWindow}
        >
          <CloseIcon sx={{fontSize: 16}} />
        </Button>
      </Box>
      <CustomDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </Box>
  );
};
