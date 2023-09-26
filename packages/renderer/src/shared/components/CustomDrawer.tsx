import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import {useNavigate} from 'react-router-dom';

interface CustomDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CustomDrawer: React.FC<CustomDrawerProps> = ({open, onClose}) => {
  const navigate = useNavigate();

  return (
    <Drawer
      anchor={'left'}
      open={open}
      onClose={onClose}
    >
      <Box sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/settings')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};
