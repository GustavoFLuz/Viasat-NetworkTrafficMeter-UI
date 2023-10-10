import {InterfaceSelect} from '@/shared/components';
import {Box, Typography, Button} from '@mui/material';
import {useState} from 'react';
import {Interface} from '../../../../types';
import {useNavigate} from 'react-router-dom';

export const SetInterface = () => {
  const [selectedInterface, setSelectedInterface] = useState<Interface | undefined>();
  const navigate = useNavigate();

  const handleUpdateInterface = async () => {
    if (selectedInterface === undefined) return;

    await window.backend.update_interface(selectedInterface);
    navigate('/');
  };

  return (
    <Box sx={{outline: '1px solid red', height: '100%', display: 'grid', placeItems: 'center'}}>
      <Box sx={{display: 'grid', placeItems: 'center', gap: 1}}>
        <Typography variant="body1">
          For the data capture to work, please choose an interface to monitor
        </Typography>
        <Typography variant="body1">You can later change this option in the settings</Typography>
        <InterfaceSelect
          selected={selectedInterface}
          setSelected={setSelectedInterface}
        />
        <Box sx={{width:"100%"}}>
          <Button
            variant="contained"
            sx={{float: 'right'}}
            onClick={handleUpdateInterface}
          >
            Set
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
