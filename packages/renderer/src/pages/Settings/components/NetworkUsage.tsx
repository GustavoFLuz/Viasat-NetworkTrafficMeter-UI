import {InterfaceSelect} from '@/shared/components';
import {Interface} from '../../../../../types';
import {Typography} from '@mui/material';
import {CustomGrid} from './CustomGrid';

type NetworkUsageProps = {
  currentInterface: Interface | undefined;
  setCurrentInterface: React.Dispatch<React.SetStateAction<Interface | undefined>>;
};

export const NetworkUsage: React.FC<NetworkUsageProps> = ({
  currentInterface,
  setCurrentInterface,
}) => {
  return (
    <CustomGrid
      firstComponent={
        <>
          <Typography
            variant="h6"
            sx={{fontWeight: 'bold', pb:3}}
          >
            Network Usage
          </Typography>
          <InterfaceSelect
            selected={currentInterface}
            setSelected={setCurrentInterface}
          />
        </>
      }

      secondComponent={<></>}
    />
  );
};
